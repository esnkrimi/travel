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
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Iuser, IuserOfSite } from './model';
import { EntryService } from './lazy/entry/entry.service';
import { Store } from '@ngrx/store';
import { MapService } from './master/map/service';
import { SettingService } from './setting';
import { RootService } from './service';
import { actions } from './+state/actions';
import { MapApiService } from 'libs/map/src/lib/component/map.service';

@Component({
  selector: 'pe-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class AppComponent implements OnInit, AfterViewInit {
  routeUrl = 'X';
  routeUrlShow = false;
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
    private translate: TranslateService,
    private draswerService: DrawerService,
    private settingService: SettingService,
    private route: Router,
    private entryService: EntryService,
    @Inject('userSession') public userSession: any,
    private store: Store,
    private mapService: MapService,
    private mapApiService: MapApiService,
    private router: ActivatedRoute
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
    this.route.events.subscribe((event: any) => {
      if (event.url) this.routeUrl = event.url;
      if (this.routeUrl) {
        this.routeUrl = this.routeUrl.substring(1, this.routeUrl.length);
        this.routeUrlShow = this.routeUrl.includes('/');
      }
    });
  }
  ngOnInit(): void {
    this.fetchUserOfSite();
    this.getRoute();
    this.mapApiService.bgLoader.subscribe((res) => {
      this.bgLoader = res;
    });

    this.fetchTrip();
    this.settingService.language.subscribe((res) => {
      this.translate.setDefaultLang(res);
      this.translate.use(res);
    });
    this.mapService.loadingProgress.next(true);
    let tmpUser = JSON.parse(this.userSession);
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
