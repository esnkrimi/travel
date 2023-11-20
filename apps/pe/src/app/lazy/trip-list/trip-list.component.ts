import { Component, Inject, OnInit, inject } from '@angular/core';
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
import { DrawerService } from '@appBase/drawer.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'pe-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent implements OnInit {
  trips: any = [];
  tripUsers: any = [];
  tripUsersAsked: any = [];
  tripRequest: any = [];
  formSearchTrip = new FormGroup({
    itemToSearch: new FormControl(''),
  });
  tripToSearch: any = '';

  constructor(
    private mapService: MapService,
    private drawerService: DrawerService,
    private localStorage: LocalService,
    private store: Store,
    @Inject('userSession') public userSession: any
  ) {}

  fetchCountry(lat: string, lon: string) {
    return this.drawerService
      .fetchLocationByLatlng(lat, lon)
      .subscribe((res) => {
        return res.country;
      });
  }

  tripSearchListener() {
    this.formSearchTrip.get('itemToSearch')?.valueChanges.subscribe((res) => {
      if (res?.length !== 0) this.tripToSearch = res;
    });
  }

  hideMap() {
    this.drawerService.showMap.next(false);
  }
  filterAllTrips(item: any) {
    //console.log(this.trips);
    // this.trips.filter(res=>res.)
  }
  ngOnInit(): void {
    this.store.select(selectTripUsers).subscribe((res) => {
      this.tripUsers = res;
    });
    this.mapService.loadingProgress.next(true);
    this.fetchTrips();
    this.tripSearchListener();
    this.hideMap();
  }

  tripZoom(tripTitle: string) {
    alert(tripTitle);
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
    //    this.store.dispatch(actions.startFetchAllTrips());
    setTimeout(() => {
      this.select();
    }, 500);
  }
  cost(tripTitle: string) {
    let sumCost = 0;
    for (let i = 0; i < this.trips.length; i++) {
      for (let j = 0; j < this.trips[i].tripjson.length; j++) {
        if (this.trips[i].tripjson[j].title === tripTitle) {
          for (let k = 0; k < this.trips[i].tripjson[j].trip.length; k++) {
            sumCost += Number(this.trips[i].tripjson[j].trip[k].moneyLost);
          }
        }
      }
    }
    return sumCost;
  }
  ask(tripTitle: string, uid: any) {
    this.mapService.loadingProgress.next(false);
    const userData = JSON.parse(this.localStorage.getData('user'));
    const data = { uid: userData.id, tripTitle: tripTitle, owenerid: uid };
    this.store.dispatch(actions.getStartAskToJoin({ data: data }));
    this.store.dispatch(actions.startFetchUsersOfTrip());
  }
  includes(title: any, tripToSearch: any) {
    return title?.includes(tripToSearch);
  }
  select() {
    this.store.select(selectAllTrips).subscribe((res) => {
      this.trips = res;
      console.log(res);
    });
    this.store.select(selectTripUsers).subscribe((res) => {
      //console.log(res);
      this.tripRequest = res;
      this.mapService.loadingProgress.next(false);
    });
  }
  isAsked(tripTitle: string) {
    const user_id = JSON.parse(this.userSession)?.id;
    const tmpArray = this.tripRequest?.filter(
      (res: any) => res.tripTitle === tripTitle
    );
    const tmpArray_ = tmpArray[0]?.users?.filter(
      (res: any) => res.uid === user_id
    );
    if (tmpArray_) return tmpArray_[0]?.uid === '1';
    else return false;
  }
}
