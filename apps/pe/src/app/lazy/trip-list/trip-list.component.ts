import { Component, OnInit, inject } from '@angular/core';
import { TripListsService } from './trip-list.service';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import {
  selectAllTrips,
  selectTripRequests,
  selectTripUsers,
} from '@appBase/+state/select';
import { MapService } from '@appBase/master/map/service';
import { LocalService } from '@appBase/storage';

@Component({
  selector: 'pe-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent implements OnInit {
  trips: any = [];
  tripUsers: any = [];
  constructor(
    private mapService: MapService,
    private service: TripListsService,
    private localStorage: LocalService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store.select(selectTripUsers).subscribe((res) => {
      this.tripUsers = res;
    });
    this.mapService.loadingProgress.next(true);
    this.fetchTrips();
  }
  results(result: any) {
    this.trips = result;
    setTimeout(() => {
      this.mapService.loadingProgress.next(false);
    }, 500);
  }
  tripZoom(tripTitle: string) {
    alert(tripTitle);
  }
  ask(tripTitle: string, uid: any) {
    const userData = JSON.parse(this.localStorage.getData('user'));
    const data = { uid: userData.id, tripTitle: tripTitle, owenerid: uid };
    this.store.dispatch(actions.getStartAskToJoin({ data: data }));
  }
  fetchTripUsers(tripTitle: string): any {
    let tmpUser: any = [];
    for (let i = 0; i < this.tripUsers.length; i++) {
      if (this.tripUsers[i].tripTitle === tripTitle)
        tmpUser = this.tripUsers[i].users;
    }
    return tmpUser;
  }

  fetchTrips() {
    this.store.dispatch(actions.startFetchAllTrips());
    setTimeout(() => {
      this.select();
    }, 500);
  }

  select() {
    this.store.select(selectAllTrips).subscribe((res) => {
      this.trips = res;
      this.mapService.loadingProgress.next(false);
    });
  }
}
