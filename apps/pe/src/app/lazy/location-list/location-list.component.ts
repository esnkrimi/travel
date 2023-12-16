import { Component, Inject, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import {
  selectAllTrips,
  selectLocation,
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

@Component({
  selector: 'pe-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
})
export class LocationListComponent implements OnInit {
  locatinListFiltered: any;
  page = 0;
  locatinList: any;
  rates = ['0', '0', '0', '0', '0'];
  formSearchTrip = new FormGroup({
    itemToSearch: new FormControl(''),
  });
  constructor(
    private mapService: MapService,
    private drawerService: DrawerService,
    private router: Router,
    private localStorage: LocalService,
    public dialog: MatDialog,
    private store: Store,
    @Inject('userSession') public userSession: any
  ) {}
  //John F Kennedy Intl
  inputListener() {
    this.locatinListFiltered = [];
    this.formSearchTrip
      .get('itemToSearch')
      ?.valueChanges.subscribe((res: any) => {
        this.page = 0;
        if (res.length === 0) this.locatinListFiltered = this.locatinList;
        else {
          this.locatinListFiltered = this.locatinList.filter((result: any) =>
            result.title.toLowerCase().includes(res.toLowerCase())
          );
        }
      });
  }
  starRates(rate: any) {
    this.rates = this.rates.fill('1', 0, rate);
    return this.rates;
  }
  hideMap() {
    this.drawerService.showMap.next(false);
  }
  fetchLocations() {
    this.store.select(selectLocation).subscribe((res) => {
      this.locatinList = res;
      this.locatinListFiltered = res;
    });
  }
  ngOnInit(): void {
    this.hideMap();
    this.inputListener();
    this.fetchLocations();
  }
}
