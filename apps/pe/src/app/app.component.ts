import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DrawerService } from './drawer.service';
import { MatDrawer } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { Iuser, IuserOfSite } from '@appBase/+state/state';
import { EntryService } from './lazy/entry/entry.service';
import { Store } from '@ngrx/store';
import { MapService } from './master/map/service';
import { SettingService } from './setting';
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
  showMap = true;
  isLoggedin?: boolean;
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
    private router: Router,
    private entryService: EntryService,
    private store: Store,
    private mapService: MapService,
    private mapApiService: MapApiService,
    private drawerService: DrawerService,
    public dialog: MatDialog
  ) {}

  zoomActivatorFunction(event: any) {
    this.openDialog();
  }

  fetchTrip() {
    if (JSON.parse(this.userSession)?.id)
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
    // this.store.select(selectTripUsers).subscribe((res) => console.log(res));
  }
  fetchUsersOfTrips() {
    const requestsAll: any = [
      {
        tripTitle: '',
        users: [],
      },
    ];
    let requests: any = [];

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
  }
  ngOnInit(): void {
    this.getRoute();
    this.fetchRequests();
    this.fetchUsersOfTrips();
    this.fetchAllTrips();
    this.fetchAllUserRates();
    this.fetchMyTripRequests();
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
    this.fetchUserOfTrip();
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
  openDialog() {
    const dialogRef = this.dialog.open(DialogContent);
  }

  listener() {
    this.mapService.loadingProgress.subscribe((res) => {
      this.loadingProgress = res;
    });
    this.draswerService.drawerType.subscribe((res: any) => {
      this.drawerTypeTmp = res;
      this.router.navigateByUrl('lazy' + res);

      setTimeout(() => {
        this.draswerService.showMap.next(true);
      }, 2000);
      //router.navigate([{outlets: {primary: 'path' ,sidebar: 'path'}}]);
    });
  }
}

@Component({
  selector: 'dialog-content',
  template: `<div class="d-fixed">
    <router-outlet></router-outlet>
  </div> `,
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule],
})
export class DialogContent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
