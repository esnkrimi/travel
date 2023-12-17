import { NgIf } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { PublicAutocompleteModule } from '@pe/public-autocomplete';
import { filter, map, tap } from 'rxjs';
import { json } from 'stream/consumers';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import {
  selectTripComments,
  selectTripUsers,
  selectUsersOfSite,
} from '@appBase/+state/select';

@Component({
  selector: 'pe-trip-comments',
  templateUrl: './trip-comments.component.html',
  styleUrls: ['./trip-comments.component.scss'],
})
export class TripCommentsComponent implements OnChanges {
  @Input() tripId: any;
  @Input() teamMemberPermission: any;
  @Input() tripTitle: any;
  @Input() addPermission: any;
  userList: any = [];
  arrayStar: any = [1, 2, 3, 4, 5];
  formRate = new FormGroup({
    comment: new FormControl(''),
    rate: new FormControl(0),
  });
  addIdeaPermission = false;
  constructor(
    @Inject('userSession') public userSession: any,
    public dialog: MatDialog,
    private store: Store
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.fetchUserList();
  }
  changeRate(rate: number) {
    this.formRate.get('rate')?.setValue(rate);
  }
  submitIdea() {
    const data = {
      userId: JSON.parse(this.userSession)?.id,
      tripTitle: this.tripTitle,
      comment: this.formRate.value.comment,
      rate: this.formRate.value.rate,
    };
    this.store.dispatch(actions.getStartWriteTripRates({ data: data }));
  }
  getArrayEnormous(length: any) {
    let tmp: any = [0, 0, 0, 0, 0];
    tmp = tmp.fill(1, 0, Number(length));
    return tmp;
  }
  remove(user: any) {
    if (this.addPermission)
      this.store.dispatch(
        actions.getStartRemoveUserFromTrip({
          userId: user.user_id,
          tripTitle: user.trip,
          ownerId: user.ownerid,
        })
      );

    this.fetchUserList();
  }

  addUser() {
    const dialogRef = this.dialog.open(DialogDataUserAdd, {
      data: { tripTitle: this.tripTitle, userExistsList: this.userList },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.fetchUserList();
    });
  }

  fetchUserList() {
    this.store.dispatch(
      actions.getStartFetchTripRates({
        userId: JSON.parse(this.userSession)?.id,
        tripTitle: this.tripTitle,
      })
    );

    this.store.select(selectTripComments).subscribe((res: any) => {
      this.userList = res;
      res;
      this.addIdeaPermission =
        this.userList.filter(
          (res: any) => res.user_id === JSON.parse(this.userSession)?.id
        ).length > 0
          ? true
          : false;
    });
  }
}

@Component({
  selector: 'dialogue',
  templateUrl: 'dialogue.html',
  styleUrls: ['dialogue.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    PublicAutocompleteModule,
  ],
})
export class DialogDataUserAdd implements OnInit {
  userList: any = [];
  userListArray: any;
  constructor(
    @Inject('userSession') public userSession: any,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store
  ) {}
  ngOnInit(): void {
    this.fetchUserList();
  }

  removeDuplicate(existsUsers: any, userList: any) {}

  fetchUserList() {
    this.userListArray = this.data.userExistsList.map(
      (res: any) => res.user_id
    );
    this.store
      .select(selectUsersOfSite)
      .pipe(
        map((res) =>
          res.filter((res: any) => !this.userListArray.includes(res.id))
        )
      )
      .subscribe((res) => {
        this.userList = res;
      });
  }
  resultSelected(user: any) {
    this.store.dispatch(
      actions.addUserToTripPreparing({
        guestId: user.id,
        tripTitle: this.data.tripTitle,
        ownerId: JSON.parse(this.userSession)?.id,
      })
    );
  }
}
