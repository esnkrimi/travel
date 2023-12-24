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
import { LocationGeoService } from '@appBase/drawer.service';
import { EntryService } from '@appBase/lazy/entry/entry.service';
import { Iuser } from '@appBase/+state/state';
import { HeaderSetting, SettingService, settings } from '@appBase/setting';
import { LocalService } from '@appBase/storage';
import { MapService } from '../map/service';
import { IScope } from '@appBase/model';

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
  @Output() resultOutputs = new EventEmitter<IScope>();
  languages = settings.languages;
  languageIndex = 1;
  setting: HeaderSetting = {
    animationFlag: 'false',
    menuShow: false,
    scrollDown: false,
  };
  userLoginInformation: Iuser = {
    id: '',
    name: '',
    lname: '',
    email: '',
    mobile: '',
    password: '',
  };
  constructor(
    private drawerService: LocationGeoService,
    private entryService: EntryService,
    private progresService: MapService,
    private mapServicePrivate: MapService,
    private localStorage: LocalService,
    private router: Router,
    private settingService: SettingService
  ) {}
  @HostListener('window:scroll', ['$event']) onWindowScroll(e: any) {
    this.setting.scrollDown =
      e.target['scrollingElement'].scrollTop > 300 ? true : false;
  }

  zoomTrip(tripTitle: string) {
    this.router.navigateByUrl('lazy(secondRouter:lazy/mytrips/');
  }
  logout() {
    this.setting.menuShow = false;
    this.progresService.loadingProgress.next(true);
    this.localStorage.clearData();
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
  ngOnInit(): void {
    this.fetchUser();
  }
  getShowLocationState(type: string) {
    this.drawerService.showLocations.next({
      show: true,
      type: type,
    });
  }
  routeHome() {
    this.drawerService.showMap.next(true);
    window.location.reload();
  }
  changeLanguage(language: string) {
    this.setting.animationFlag =
      this.setting.animationFlag === 'true' ? 'false' : 'true';
    this.mapServicePrivate.loadingProgress.next(true);
    setTimeout(() => {
      this.settingService.language.next(language.toLowerCase());
      this.languageIndex = this.languageIndex >= 4 ? 0 : this.languageIndex + 1;
      this.mapServicePrivate.loadingProgress.next(false);
    }, 1000);
  }
  resultOutput(event: IScope) {
    this.resultOutputs.emit(event);
  }
  fetchUser() {
    this.entryService.userLoginInformation.subscribe((res: Iuser) => {
      this.userLoginInformation = res;
    });
  }
  savedLocations() {
    this.getShowLocationState('saved');
    this.setting.menuShow = false;
    this.showMap(true);
    this.router.navigateByUrl('');
  }
  sharedLocations() {
    this.getShowLocationState('shared');
    this.setting.menuShow = false;
    this.showMap(true);
    this.router.navigateByUrl('');
  }
  route(path: any) {
    this.drawerService.drawerType.next(`/${path}`);
  }

  showLocationsOnMapComponent() {
    this.setting.menuShow = false;
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
