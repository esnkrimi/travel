import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectILocationTypes,
  selectLocation,
  selectSharedLocation,
} from '@appBase/+state/select';
import { MapService } from '@appBase/master/map/service';
import { LocalService } from '@appBase/storage';
import { LocationGeoService } from '@appBase/drawer.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { LocationSetting } from '@appBase/setting';

@Component({
  selector: 'pe-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
})
export class LocationListComponent implements OnInit {
  @Output() selectedLocation = new EventEmitter<any>();
  @Input() city: string;
  @Input() country: string;
  @Input() state: string;
  @Input() type: any;
  setting: LocationSetting = {
    rateFilter: 'all rates',
    rateFilterNumber: 0,
    locatinListFiltered: [],
    locatinList: [],
    locatinTypeList: [],
    selectedType: '',
    page: 0,
  };
  rates = ['0', '0', '0', '0', '0'];
  formSearchTrip = new FormGroup({
    itemToSearch: new FormControl<any>(''),
    typeSearch: new FormControl<string>(''),
  });

  constructor(
    @Inject('userSession') public userSession: string,
    private drawerService: LocationGeoService,
    private router: Router,
    public dialog: MatDialog,
    private store: Store
  ) {}

  inputListener() {
    this.setting.locatinListFiltered = [];
    this.formSearchTrip
      .get('itemToSearch')
      ?.valueChanges.subscribe((res: string) => {
        this.setting.page = 0;
        if (res.length === 0)
          this.changeLocationTypes(this.setting.selectedType);
        else {
          this.setting.locatinListFiltered = this.setting.locatinList.filter(
            (result: any) =>
              result.title.toLowerCase().includes(res.toLowerCase()) &&
              (result.type === this.setting.selectedType ||
                this.setting.selectedType === '')
          );
        }
      });
  }

  changeRates(rate: any) {
    this.setting.page = 1;
    this.setting.rateFilterNumber =
      this.setting.rateFilter === 'all rates' || this.setting.rateFilter === ''
        ? 0
        : this.setting.rateFilter === 'low'
        ? 2
        : this.setting.rateFilter === 'midle'
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
    if (this.type === 'shared') this.fetchAllSharedLocations();
    else this.fetchAllLocations();
  }
  fetchAllSharedLocations() {
    const tmp = JSON.parse(this.userSession)?.id;
    this.setting.selectedType = '';
    this.store
      .select(selectSharedLocation)
      .pipe(
        map((res) => res.filter((res: any) => res.receiverId === tmp)),
        map((res) =>
          res.filter(
            (res: any) =>
              Number(res.score) >= Number(this.setting.rateFilterNumber)
          )
        )
      )
      .subscribe((res: any) => {
        this.setting.locatinList = res;
        this.setting.locatinListFiltered = res;
      });
  }

  fetchAllLocations() {
    this.setting.selectedType = '';
    this.store
      .select(selectLocation)
      .pipe(
        map((res) =>
          res.filter(
            (res: any) =>
              Number(res.score) >= Number(this.setting.rateFilterNumber)
          )
        ),
        map((res) =>
          res.filter((res: any) => this.type !== 'saved' || res.saved === true)
        )
      )
      .subscribe((res: any) => {
        this.setting.locatinList = res;
        this.setting.locatinListFiltered = res;
      });
  }
  changeLocationTypes(type: string) {
    this.setting.selectedType = type;
    this.setting.page = 1;
    this.setting.locatinListFiltered = this.setting.locatinList.filter(
      (res: any) => type === '' || res.type === type
    );
  }
  fetchLocationTypes() {
    this.store.select(selectILocationTypes).subscribe((res: any) => {
      this.setting.locatinTypeList = res;
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
    setTimeout(() => {
      this.fetchLocations();
    }, 1000);
  }
}
