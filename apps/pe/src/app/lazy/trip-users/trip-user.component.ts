import { NgIf } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { PublicAutocompleteModule } from '@pe/public-autocomplete';
import { TripUserService } from './trip-user.service';
import { filter, map, tap } from 'rxjs';
import { json } from 'stream/consumers';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import { selectUsersOfSite } from '@appBase/+state/select';

@Component({
  selector: 'pe-trip-user',
  templateUrl: './trip-user.component.html',
  styleUrls: ['./trip-user.component.scss'],
})
export class TripUserComponent implements OnChanges {
  @Input() tripId: any;
  @Input() tripTitle: any;
  @Input() addPermission: any;
  userList: any = [];

  constructor(
    @Inject('userSession') public userSession: any,
    public dialog: MatDialog,
    private service: TripUserService,
    private store: Store
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.fetchUserList();
    console.log(this.addPermission);
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
    this.service
      .fetchUserList(JSON.parse(this.userSession)?.id, this.tripTitle)
      .subscribe((res) => {
        this.userList = res;
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
