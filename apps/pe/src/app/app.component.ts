import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DrawerService } from './drawer.service';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Iuser, IuserOfSite } from './model';
import { EntryService } from './lazy/entry/entry.service';
import { Store } from '@ngrx/store';
import { MapService } from './master/map/service';
import { SettingService } from './setting';
import { actions } from './+state/actions';
import { MapApiService } from 'libs/map/src/lib/component/map.service';
import { selectAllTrips, selectTripRequests } from './+state/select';

@Component({
  selector: 'pe-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class AppComponent implements OnInit, AfterViewInit {
  showMap = true;
  tips = [
    'search location by name or on map',
    'write your tript experience or read others',
    'measure distance time for your trip',
    'schedule your trip and your trip budget',
    'see how your trip is going on',
  ];
  loadingProgress = false;
  skip = -1;
  scope: any;
  bgLoader = false;
  showFiller = false;
  open = true;
  drawerTypeTmp = '';
  @ViewChild('drawer')
  drawer!: MatDrawer;
  savedLocationFlag = false;
  tmpUser: Iuser = {
    id: '',
    name: '',
    lname: '',
    email: '',
    mobile: '',
    password: '',
  };
  showTour = false;
  constructor(
    @Inject('userSession') public userSession: any,
    private translate: TranslateService,
    private draswerService: DrawerService,
    private settingService: SettingService,
    private route: Router,
    private entryService: EntryService,
    private store: Store,
    private mapService: MapService,
    private mapApiService: MapApiService,
    private drawerService: DrawerService
  ) {}
  ngAfterViewInit(): void {
    this.drawer.openedChange.subscribe((o: boolean) => {
      if (!o) this.draswerService.open.next(false);
    });
  }
  fetchTrip() {
    this.store.dispatch(actions.startFetchTrip());
  }
  savedLocation(e: any) {
    this.savedLocationFlag = e;
  }
  getRoute() {
    this.drawerService.showMap.subscribe((res) => {
      this.showMap = res;
    });
  }
  fetchRequests() {
    const uid = JSON.parse(this.userSession).id;
    this.store.dispatch(actions.getStartFetchTripRequests({ uid: uid }));
  }
  fetchAllTrips() {
    this.store.dispatch(actions.startFetchAllTrips());
  }
  fetchUsersOfTrips() {
    let requestsAll: any = [
      {
        tripTitle: '',
        users: [],
      },
    ];
    let requests: any = [];
    let trips: any = [];

    this.store.select(selectAllTrips).subscribe((res) => {
      for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[i].tripjson.length; j++) {
          requestsAll.push({ tripTitle: res[i].tripjson[j].title, users: [] });
        }
      }
      this.store.select(selectTripRequests).subscribe((res) => {
        requests = res;
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
    setTimeout(() => {
      this.store.dispatch(actions.fillUserTrips({ data: requestsAll }));
    }, 2000);
  }
  ngOnInit(): void {
    this.getRoute();
    this.fetchRequests();
    this.fetchUsersOfTrips();
    this.fetchAllTrips();
    this.fetchUserOfSite();
    this.mapApiService.bgLoader.subscribe((res) => {
      this.bgLoader = res;
    });

    this.fetchTrip();
    this.settingService.language.subscribe((res) => {
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
  }

  showTours() {
    this.showTour = true;
    this.skip = 2;
  }

  skipNext() {
    //this.mapService.loadingProgress.next(false);
    this.skip = 2;
  }
  change() {
    this.translate.use('fa');
  }
  fetchUserOfSite() {
    let tmpUser: IuserOfSite[];
    this.store.dispatch(actions.startFetchUsersOfSites());
  }
  resultOutputs(e: any) {
    this.scope = e;
  }
  listener() {
    this.mapService.loadingProgress.subscribe((res) => {
      this.loadingProgress = res;
    });
    this.draswerService.drawerType.subscribe((res: any) => {
      this.drawerTypeTmp = res;
      this.route.navigateByUrl('lazy' + res);
      //router.navigate([{outlets: {primary: 'path' ,sidebar: 'path'}}]);
    });
    this.draswerService.open.subscribe((res) => {
      this.open = res;
    });
  }
}
