import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import {
  selectAllTrips,
  selectILocationTypes,
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
import { map, tap } from 'rxjs';

@Component({
  selector: 'pe-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
})
export class LocationListComponent implements OnInit {
  @Output() selectedLocation = new EventEmitter<any>();
  @Input() city: any;
  @Input() country: any;
  @Input() state: any;
  rateFilter = 'all rates';
  rateFilterNumber = 0;
  locatinListFiltered: any;
  locatinList: any;
  locatinTypeList: any;
  selectedType = '';
  page = 0;
  rates = ['0', '0', '0', '0', '0'];
  formSearchTrip = new FormGroup({
    itemToSearch: new FormControl(''),
    typeSearch: new FormControl(''),
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
        if (res.length === 0) this.changeLocationTypes(this.selectedType);
        else {
          this.locatinListFiltered = this.locatinList.filter(
            (result: any) =>
              result.title.toLowerCase().includes(res.toLowerCase()) &&
              (result.type === this.selectedType || this.selectedType === '')
          );
        }
      });
  }
  setView(item: any) {
    //    this.showMap();
    this.router.navigateByUrl('zoom/');
  }
  changeRates(rate: any) {
    this.page = 1;
    this.rateFilterNumber =
      this.rateFilter === 'all rates' || this.rateFilter === ''
        ? 0
        : this.rateFilter === 'low'
        ? 2
        : this.rateFilter === 'midle'
        ? 3
        : 5;
    this.fetchLocations();
  }
  hideMap() {
    this.drawerService.showMap.next(false);
  }
  showMap() {
    this.drawerService.showMap.next(true);
  }
  fetchLocations() {
    this.selectedType = '';
    this.store
      .select(selectLocation)
      .pipe(
        map((res) =>
          res.filter(
            (res: any) => Number(res.score) >= Number(this.rateFilterNumber)
          )
        )
      )
      .subscribe((res) => {
        this.locatinList = res;
        this.locatinListFiltered = res;
      });
  }
  changeLocationTypes(type: string) {
    this.selectedType = type;
    this.page = 1;
    this.locatinListFiltered = this.locatinList.filter(
      (res: any) => type === '' || res.type === type
    );
  }
  fetchLocationTypes() {
    this.store.select(selectILocationTypes).subscribe((res) => {
      this.locatinTypeList = res;
    });
  }
  selectLocation(lat: any, lon: any) {
    this.selectedLocation.emit({
      lat: lat,
      lon: lon,
    });
  }
  ngOnInit(): void {
    this.inputListener();
    this.fetchLocations();
  }
}
