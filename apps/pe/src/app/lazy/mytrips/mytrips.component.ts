import { Component, Inject, OnInit, inject } from '@angular/core';
import { MytripsService } from './mytrips.service';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import { selectTripRequests } from '@appBase/+state/select';

@Component({
  selector: 'pe-mytrips',
  templateUrl: './mytrips.component.html',
  styleUrls: ['./mytrips.component.scss'],
})
export class MytripsComponent implements OnInit {
  trips: any = [];
  tripRequest: any = [];
  constructor(
    private store: Store,
    private service: MytripsService,
    @Inject('userSession') public userSession: any
  ) {}
  ngOnInit(): void {
    this.myTrips();
  }
  myTrips() {
    //I should change to ngrx format
    this.service
      .myTrips(JSON.parse(this.userSession)?.id)
      .subscribe((res: any) => {
        this.trips = res;
        console.log(this.trips);
      });
  }
  confirm(event: any, ownerId: string, tripTitle: string, userId: string) {
    const action = event.checked ? 1 : 0;
    this.store.dispatch(
      actions.getStartConfirmInvite({
        ownerId: ownerId,
        tripTitle: tripTitle,
        uid: userId,
        action: action,
      })
    );
    this.tripRequests();
  }

  tripRequests() {
    this.store.select(selectTripRequests).subscribe((res) => {
      this.tripRequest = res;
    });
  }
}
