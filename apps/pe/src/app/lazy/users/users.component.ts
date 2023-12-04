import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import { selectUserRates, selectUsersOfSite } from '@appBase/+state/select';
import { DrawerService } from '@appBase/drawer.service';
import { map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'pe-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  usersList: any;
  usersRateList: any;
  userAvgRate: any = [0, 0, 0, 0, 0];
  userId: any;
  constructor(
    private store: Store,
    private drawerService: DrawerService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    @Inject('userSession') public userSession: any
  ) {}
  ngOnInit(): void {
    this.hideMap();
    this.getRoutes();
    this.users();
    this.userRate();
  }
  hideMap() {
    this.drawerService.showMap.next(false);
  }
  getRoutes() {
    this.route.params.subscribe((res: any) => (this.userId = res.user));
  }
  users() {
    this.store
      .select(selectUsersOfSite)
      .pipe(map((res) => res.filter((res) => res.id === this.userId)))
      .subscribe((res) => {
        this.usersList = res;
      });
  }

  userRate() {
    this.userAvgRate = [0, 0, 0, 0, 0];
    this.store
      .select(selectUserRates)
      .pipe(
        map((res) => res.filter((res) => res.user_candidate_id === this.userId))
      )
      .subscribe((res) => {
        this.usersRateList = res;

        let avgScore =
          this.usersRateList.reduce(
            (acc: any, val: any) => (acc += Number(val.rate)),
            0
          ) / this.usersRateList.length;
        avgScore = Math.round(Math.ceil(avgScore));
        this.userAvgRate = this.userAvgRate.fill(1, 0, avgScore);
      });
  }

  openCommentModal(rate: any) {
    const data = {
      rate: rate,
      candidate_id: this.userId,
      comment: 'comment',
      uid: JSON.parse(this.userSession)?.id,
    };
    const dialogRef = this.dialog.open(DialogUserComment, { data: data });
    dialogRef.afterClosed().subscribe();
  }
}

@Component({
  selector: 'dialogue-user-comment',
  templateUrl: 'dialogue.html',
  styleUrls: ['dialogue.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatDialogModule],
})
export class DialogUserComment {
  userList: any = [];
  userListArray: any;
  form = new FormGroup({
    comment: new FormControl(''),
  });
  constructor(
    @Inject('userSession') public userSession: any,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store
  ) {}

  writeRate() {
    this.data.comment = this.form.get('comment')?.value;
    this.store.dispatch(actions.getStartWriteUserRates({ data: this.data }));
  }
}
