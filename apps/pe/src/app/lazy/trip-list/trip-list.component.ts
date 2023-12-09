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
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'pe-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent implements OnInit {
  adminRate = [1, 2, 3, 4, 5];
  trips: any = [];
  tripUsers: any = [];
  tripUsersFlat: any = [];
  tripUsersAsked: any = [];
  tripRequest: any = [];
  formSearchTrip = new FormGroup({
    itemToSearch: new FormControl(''),
  });
  tripToSearch: any = '';
  askToJoinLoading = '';
  constructor(
    private mapService: MapService,
    private drawerService: DrawerService,
    private router: Router,
    private localStorage: LocalService,
    public dialog: MatDialog,
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
    this.formSearchTrip
      .get('itemToSearch')
      ?.valueChanges.subscribe((res: any) => {
        this.tripToSearch = res;
        if (res.length > 0) {
          this.flattingTrips(this.trips);
          this.tripUsersFlat = this.tripUsersFlat.filter((result: any) =>
            this.includes(result.title, res)
          );
        } else this.flattingTrips(this.trips);
      });
  }

  hideMap() {
    this.drawerService.showMap.next(false);
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
  zoomTrip(tripTitle: string) {
    this.router.navigateByUrl('lazy(secondRouter:lazy/trip/' + tripTitle);
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
    this.askToJoinLoading = tripTitle;
    this.mapService.loadingProgress.next(true);
    const userData = JSON.parse(this.localStorage.getData('user'));
    const data = { uid: userData.id, tripTitle: tripTitle, owenerid: uid };
    this.store.dispatch(actions.getStartAskToJoin({ data: data }));
    this.store.dispatch(actions.startFetchUsersOfTrip());
    setTimeout(() => {
      this.askToJoinLoading = '';
      this.mapService.loadingProgress.next(false);
    }, 300);
  }

  includes(title: any, tripToSearch: any) {
    return title?.toUpperCase().includes(tripToSearch.toUpperCase());
  }

  select() {
    this.store.select(selectAllTrips).subscribe((res) => {
      this.trips = res;
      this.flattingTrips(this.trips);
    });
    this.store.select(selectTripUsers).subscribe((res) => {
      this.tripRequest = res;
      this.mapService.loadingProgress.next(false);
    });
  }

  getFromTripFlat(tripTitle: string) {
    for (let i = 0; i < this.trips.length; i++)
      for (let j = 0; j < this.trips[i].tripjson.length; j++) {
        if (this.trips[i].tripjson[j].title === tripTitle) {
          return this.trips[i];
        }
      }
  }

  tripIsLive(tripTitle: string) {
    const compareResult = this.tripRequest.filter(
      (res: any) => res.tripTitle == tripTitle
    );
    if (compareResult.length > 0) {
      return true;
    }
    return false;
  }

  flattingTrips(trips: any) {
    this.tripUsersFlat = [];
    for (let i = 0; i < trips.length; i++) {
      this.tripUsersFlat.push(trips[i].tripjson);
    }
    this.tripUsersFlat = this.tripUsersFlat.flat();
  }

  isAsked(tripTitle: string) {
    const user_id = JSON.parse(this.userSession)?.id;
    const tmpArray = this.tripRequest?.filter(
      (res: any) => res.tripTitle === tripTitle && res.user_id === user_id
    );
    return tmpArray?.length > 0;
  }

  differentBetweenTwoDates(startDate: any, endDate: any) {
    const date1: any = new Date(startDate);
    const date2: any = new Date(endDate);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + ' days';
  }
  openDialog(tripTitle: string) {
    const dialogRef = this.dialog.open(GuestsDialog, {
      data: { tripTitle: tripTitle },
    });
    dialogRef.afterClosed().subscribe();
  }
}

@Component({
  selector: 'guests-dialog',
  templateUrl: 'guests.html',
  styleUrls: ['./guests.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule],
})
export class GuestsDialog implements OnInit {
  tripUsers: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store.select(selectTripUsers).subscribe((res) => {
      this.tripUsers = res;
    });
  }
  fetchTripUsers(): any {
    const tmpUser: any = [];
    for (let i = 0; i < this.tripUsers.length; i++) {
      if (this.tripUsers[i].tripTitle == this.data.tripTitle) {
        tmpUser.push(this.tripUsers[i]);
      }
    }
    return tmpUser;
  }
}
