import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectILocationTypes,
  selectLocation,
  selectSavedLocation,
  selectSharedLocation,
  selectUsersOfSite,
} from '@appBase/+state/select';
import { MapService } from '@appBase/master/map/service';
import { LocationGeoService } from '@appBase/drawer.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, tap } from 'rxjs';
import { LocationSetting } from '@appBase/setting';
import { actions } from '@appBase/+state/actions';

@Component({
  selector: 'pe-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
})
export class LocationListComponent implements OnInit, OnChanges {
  @Output() selectedLocation = new EventEmitter<any>();
  @Input() city: string;
  @Input() country: string;
  @Input() state: string;
  @Input() type: any;
  @Input() typeOfLocation: any;
  @Input() citySelectToLocationList: any;

  distanceTo: any;
  setting: LocationSetting = {
    rateFilter: 'Nearest',
    rateFilterNumber: 0,
    locatinListFiltered: [],
    locatinList: [],
    locatinTypeList: [],
    selectedType: '',
    page: 0,
    cityActive: 'New York',
    loadingProgress: false,
  };
  rates = ['0', '0', '0', '0', '0'];
  formSearchTrip = new FormGroup({
    itemToSearch: new FormControl<any>(''),
    typeSearch: new FormControl<string>(''),
  });
  info = {
    imagePrefix: 'https://burjcrown.com/drm/travel/users/',
    imagePostfix: '/master/1.jpg',
    destinationUrlPrefix: 'https://www.burjcrown.com/zoom/',
    bgColor: 'white',
    textColor: 'black',
    borderColor: '#ccffdd',
    imgWidth: '13em',
    imgHeight: '7em',
    numberOfPage: 3,
    arrowColor: '#ffffff',
    Speed: 3,
    //Speed ,for mobile view select 3 or lower for pc view select 8 or more height: '24em',
    autoPlay: false,
  };
  constructor(
    @Inject('userSession') public userSession: string,
    private drawerService: LocationGeoService,
    private mapService: MapService,
    public dialog: MatDialog,
    private store: Store
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.citySelectToLocationList)
      this.setting.cityActive = this.citySelectToLocationList;
    if (JSON.parse(this.userSession)?.id) this.selectUser();
    this.inputListener();
    setTimeout(() => {
      this.fetchLocations();
      this.makeDistance();
    }, 1000);
  }

  selectUser() {
    this.store
      .select(selectUsersOfSite)
      .pipe(
        map((res) =>
          res.filter((res: any) => res.id === JSON.parse(this.userSession)?.id)
        )
      )
      .subscribe((res) => {
        if (this.citySelectToLocationList)
          this.setting.cityActive = this.citySelectToLocationList;
        else this.setting.cityActive = res[0].city;
      });
  }
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
    this.setting.loadingProgress = true;
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
    this.drawerService.showLocations.subscribe((res) => {
      this.type = res.type;
      if (this.type === 'shared') this.fetchAllSharedLocations();
      else if (this.type === 'saved') this.savedLocations();
      else this.fetchAllLocations();
    });
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
        this.setting.loadingProgress = false;
        this.setting.locatinList = res;
        this.setting.locatinListFiltered = res;
      });
  }
  savedLocations() {
    this.setting.selectedType = '';
    this.store
      .select(selectSavedLocation)
      .pipe(
        map((res) =>
          res.filter(
            (res: any) =>
              Number(res.score) >= Number(this.setting.rateFilterNumber)
          )
        )
      )
      .subscribe((res: any) => {
        this.setting.loadingProgress = false;
        this.setting.locatinList = res;
        this.setting.locatinListFiltered = res;
      });
  }

  extractRate(rate: string) {
    const tmp = rate.split('-');
    return tmp;
  }

  fetchAllLocations() {
    this.setting.selectedType = '';
    this.setting.cityActive = '';

    if (this.city) this.setting.cityActive = this.city;
    this.store
      .select(selectLocation)
      .pipe(
        map((res) =>
          res.filter(
            (res: any) =>
              this.type !== 'saved' && res.city === this.setting.cityActive
          )
        ),
        //   tap((res) => console.log(this.setting.cityActive, res)),
        map((res) =>
          res.filter(
            (res: any) =>
              this.typeOfLocation === '' || res.type === this.typeOfLocation
          )
        )
      )
      .subscribe((res: any) => {
        this.setting.locatinListFiltered = res;
        this.setting.locatinList = res;
        if (this.setting.rateFilter === 'Nearest')
          this.setting.locatinListFiltered = res.sort((a: any, b: any) => {
            if (a.distanceFromMyLocation < b.distanceFromMyLocation) {
              return -1;
            }
            if (a.distanceFromMyLocation > b.distanceFromMyLocation) {
              return 1;
            }
            return 0;
          });
        else
          this.setting.locatinListFiltered = res.sort((a: any, b: any) => {
            if (
              Number(this.extractRate(a.score)[0]) <
              Number(this.extractRate(b.score)[0])
            ) {
              return 1;
            }
            if (
              Number(this.extractRate(a.score)[0]) >
              Number(this.extractRate(b.score)[0])
            ) {
              return -1;
            }
            return 0;
          });

        setTimeout(() => {
          this.setting.loadingProgress = false;
        }, 1000);
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
  makeDistance() {
    this.mapService.myLocation.subscribe((res) => {
      const d = {
        lat: res.lat,
        lng: res.lng,
      };
      this.store.dispatch(
        actions.startUpdateDistance({
          data: this.setting.locatinListFiltered,
          myLocation: d,
        })
      );
    });
  }

  ngOnInit(): void {}
}
