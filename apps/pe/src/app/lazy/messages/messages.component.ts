import { AfterViewInit, Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { actions } from '@appBase/+state/actions';
import { selectAllTrips, selectTripRequests } from '@appBase/+state/select';
import { Store } from '@ngrx/store';

@Component({
  selector: 'pe-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  tripRequest: any = [];
  allTrips: any = [];
  user_id = '';
  constructor(
    private store: Store,
    @Inject('userSession') public userSession: any
  ) {}

  ngOnInit(): void {
    this.user_id = JSON.parse(this.userSession).id;
    this.getStartTripRequests();
    this.tripRequests();
    this.fetchAllTrips();
  }
  confirmTripRequest(
    ownerId: string,
    tripTitle: string,
    userId: string,
    confirm: string
  ) {
    this.store.dispatch(
      actions.getStartConfirmRequests({
        ownerId: ownerId,
        tripTitle: tripTitle,
        uid: userId,
        action: confirm,
      })
    );
    this.tripRequests();
  }
  getStartTripRequests() {
    this.store.dispatch(
      actions.getStartFetchTripRequests({ uid: this.user_id })
    );
  }
  tripRequests() {
    this.store.select(selectTripRequests).subscribe((res) => {
      this.tripRequest = res;
    });
  }
  fetchAllTrips() {
    this.store.select(selectAllTrips).subscribe((res) => {
      this.allTrips = res;
      console.log(res);
    });
  }
}
