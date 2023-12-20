import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { DrawerService } from '@appBase/drawer.service';
import { EntryService } from '@appBase/lazy/entry/entry.service';
import { Iuser } from '@appBase/+state/state';
import { SettingService, settings } from '@appBase/setting';
import { LocalService } from '@appBase/storage';
import { MapApiService } from 'libs/map/src/lib/component/map.service';
import { MapService } from '../map/service';

@Component({
  selector: 'pe-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('animate', [
      state(
        'true',
        style({
          opacity: 1,
        })
      ),
      state(
        'false',
        style({
          opacity: 1,
        })
      ),
      transition('st1 <=> st2', animate('400ms ease-in')),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  @Output() resultOutputs = new EventEmitter<any>();
  @Output() savedLocation = new EventEmitter<any>();
  scrollDown = false;
  languages = settings.languages;
  languageIndex = 1;
  animationFlag = 'false';
  menuShow = false;
  userLoginInformation: Iuser = {
    id: '',
    name: '',
    lname: '',
    email: '',
    mobile: '',
    password: '',
  };
  constructor(
    private drawerService: DrawerService,
    private entryService: EntryService,
    private mapService: MapApiService,
    private progresService: MapService,
    private mapServicePrivate: MapService,
    private localStorage: LocalService,
    private router: Router,
    private settingService: SettingService
  ) {}
  @HostListener('window:scroll', ['$event']) onWindowScroll(e: any) {
    this.scrollDown =
      e.target['scrollingElement'].scrollTop > 300 ? true : false;

    // Your Code Here
  }
  zoomTrip(tripTitle: string) {
    this.router.navigateByUrl('lazy(secondRouter:lazy/mytrips/');
  }
  logout() {
    this.menuShow = false;
    this.progresService.loadingProgress.next(true);
    this.localStorage.clearData();
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
  ngOnInit(): void {
    this.fetchUser();
  }
  getShowLocationState() {
    this.drawerService.showLocations.next({
      show: true,
      type: 'saved',
    });
  }
  routeHome() {
    this.drawerService.showMap.next(true);
    window.location.reload();
  }
  changeLanguage(language: string) {
    this.animationFlag = this.animationFlag === 'true' ? 'false' : 'true';
    this.mapServicePrivate.loadingProgress.next(true);
    setTimeout(() => {
      this.settingService.language.next(language.toLowerCase());
      this.languageIndex = this.languageIndex >= 4 ? 0 : this.languageIndex + 1;
      this.mapServicePrivate.loadingProgress.next(false);
    }, 1000);
  }
  resultOutput(event: any) {
    this.resultOutputs.emit(event);
  }
  fetchUser() {
    this.entryService.userLoginInformation.subscribe((res: any) => {
      this.userLoginInformation = res;
    });
  }
  savedLocations() {
    this.getShowLocationState();
    this.menuShow = false;
    this.showMap(true);
    this.router.navigateByUrl('');
  }

  route(path: any) {
    this.drawerService.drawerType.next(`/${path}`);
  }
  routeViaSecond(path: any) {
    this.router.navigate([{ outlets: { secondRouter: [`lazy/mytrips`] } }]);
  }
  showLocationsOnMapComponent() {
    this.menuShow = false;
    this.drawerService.showLocations.next({
      show: true,
      type: '',
    });
    this.showMap(true);
    this.router.navigateByUrl('');
  }
  showMap(toggle: boolean) {
    this.drawerService.showMap.next(toggle);
  }
}
