import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocationGeoService } from './drawer.service';
import { Router } from '@angular/router';
import { Iuser } from '@appBase/+state/state';
import { EntryService } from './lazy/entry/entry.service';
import { Store } from '@ngrx/store';
import { MapService } from './master/map/service';
import { APPSetting, SettingService } from './setting';
import { actions } from './+state/actions';
import { MapApiService } from 'libs/map/src/lib/component/map.service';
import { selectAllTrips, selectTripRequests } from './+state/select';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'pe-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class AppComponent implements OnInit {
  @ViewChild('drawer')
  showMap = true;
  setting: APPSetting = {
    showMap: true,
    open: true,
    SelectedLanguage: '',
    openModalLocationRoute: false,
    loadingProgress: false,
    savedLocationFlag: false,
    bgLoader: false,
    showTour: false,
  };

  skip = -1;
  scope: any;
  drawerTypeTmp = '';
  tmpUser: Iuser = {
    id: '',
    name: '',
    lname: '',
    email: '',
    mobile: '',
    password: '',
  };

  constructor(
    @Inject('userSession') public userSession: any,
    private translate: TranslateService,
    private draswerService: LocationGeoService,
    private settingService: SettingService,
    private router: Router,
    private entryService: EntryService,
    private store: Store,
    private mapService: MapService,
    private mapApiService: MapApiService,
    private drawerService: LocationGeoService,
    public dialog: MatDialog
  ) {}
  users() {
    this.store.dispatch(actions.startFetchUsersOfSites());
  }
  zoomActivatorFunction(event: any) {
    this.openDialog();
  }

  fetchTrip() {
    if (JSON.parse(this.userSession)?.id)
      this.store.dispatch(actions.startFetchTrip());
  }
  savedLocation(e: any) {
    this.setting.savedLocationFlag = e;
  }
  getRoute() {
    this.drawerService.showMap.subscribe((res: boolean) => {
      this.showMap = res;
    });
  }
  fetchMyTripRequests() {
    const uid = JSON.parse(this.userSession)?.id;
    if (uid)
      this.store.dispatch(actions.getStartFetchMyTripRequests({ uid: uid }));
  }
  fetchRequests() {
    const uid = JSON.parse(this.userSession)?.id;
    if (uid)
      this.store.dispatch(actions.getStartFetchTripRequests({ uid: uid }));
  }
  fetchAllUserRates() {
    this.store.dispatch(actions.getStartFetchUserRates());
  }
  fetchAllTrips() {
    this.store.dispatch(actions.startFetchAllTrips());
  }
  fetchUserOfTrip() {
    this.store.dispatch(actions.startFetchUsersOfTrip());
  }
  fetchUsersOfTrips() {
    const requestsAll: any = [
      {
        tripTitle: '',
        users: [],
      },
    ];
    this.store.select(selectAllTrips).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[i].tripjson.length; j++) {
          requestsAll.push({
            tripTitle: res[i]?.tripjson[j]?.title,
            users: [],
          });
        }
      }
      this.store.select(selectTripRequests).subscribe((res) => {
        for (let i = 0; i < requestsAll.length; i++) {
          for (let j = 0; j < res.length; j++) {
            if (res[j].tripTitle === requestsAll[i].tripTitle)
              requestsAll[i].users.push({
                name: res[j].reqUserName,
                family: res[j].reqUserFamily,
                confirmed: res[j].adminConfirm,
                uid: res[j].uid,
              });
          }
        }
      });
    });
  }
  fetchLocationTypes() {
    this.store.dispatch(actions.startFetchLocationType());
  }
  ngOnInit(): void {
    this.fetchLocationTypes();
    this.getRoute();
    this.users();
    this.fetchRequests();
    this.fetchUsersOfTrips();
    this.fetchAllTrips();
    this.fetchAllUserRates();
    this.fetchMyTripRequests();
    this.fetchUserOfSite();
    this.mapApiService.bgLoader.subscribe((res) => {
      this.setting.bgLoader = res;
    });

    this.fetchTrip();
    this.settingService.language.subscribe((res) => {
      this.setting.SelectedLanguage = res;
      this.translate.setDefaultLang(res);
      this.translate.use(res);
    });
    this.mapService.loadingProgress.next(true);
    const tmpUser = JSON.parse(this.userSession);
    if (tmpUser) {
      this.tmpUser = {
        id: tmpUser.id,
        name: tmpUser.name,
        lname: tmpUser.lname,
        email: tmpUser.email,
        mobile: '',
        password: '',
      };
      this.entryService.userLoginInformation.next(this.tmpUser);
    }
    this.listener();
    setTimeout(() => {
      this.skip = 0;
    }, 2000);
    this.fetchUserOfTrip();
  }

  showTours() {
    this.setting.showTour = true;
    this.skip = 2;
  }

  skipNext() {
    this.skip = 2;
  }
  change() {
    this.translate.use('fa');
  }
  fetchUserOfSite() {
    this.store.dispatch(actions.startFetchUsersOfSites());
  }
  resultOutputs(e: any) {
    this.scope = e;
  }
  openDialog() {
    this.setting.openModalLocationRoute = true;
  }

  listener() {
    this.mapService.loadingProgress.subscribe((res) => {
      this.setting.loadingProgress = res;
    });
    this.draswerService.drawerType.subscribe((res: any) => {
      this.drawerTypeTmp = res;
      this.router.navigateByUrl('lazy' + res);
      setTimeout(() => {
        this.draswerService.showMap.next(true);
      }, 2000);
    });
  }
}
