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
  Inject,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { LocationGeoService } from '@appBase/drawer.service';
import { EntryService } from '@appBase/lazy/entry/entry.service';
import { IScope, Iuser } from '@appBase/+state/state';
import { HeaderSetting, SettingService, settings } from '@appBase/setting';
import { LocalService } from '@appBase/storage';
import { MapService } from '../map/service';
import { DOCUMENT } from '@angular/common';

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
    shearchShow: false,
    languageMenu: false,
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
    @Inject(DOCUMENT) private document: Document,
    @Inject('deviceIsWide') public deviceIsWide: any,
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
  activeSearchFixedWidth(active: boolean) {
    this.setting.shearchShow = active;
    this.mapServicePrivate.loadingProgress.next(active);
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
    this.setting.shearchShow = this.deviceIsWide;
    this.fetchUser();
  }
  getShowLocationState(type: string) {
    this.drawerService.showLocations.next({
      show: true,
      type: type,
      typeOfLocation: '',
    });
  }
  routeHome() {
    this.drawerService.showMap.next(true);
    window.location.reload();
  }
  timeStamp() {
    return new Date().getTime() + 1;
  }
  changeCssFile(language: string) {
    const headTag = this.document.getElementsByTagName(
      'head'
    )[0] as HTMLHeadElement;
    const existingLink = this.document.getElementById(
      'langCss'
    ) as HTMLLinkElement;
    const bundleName =
      language === 'ar' || language === 'fa'
        ? 'arabicStyle.css'
        : 'englishStyle.css';
    if (existingLink) {
      existingLink.href = bundleName;
    } else {
      const newLink = this.document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.type = 'text/css';
      newLink.id = 'langCss';
      newLink.href = bundleName;
      headTag.appendChild(newLink);
    }
  }
  showCityDIstanceMapComponent() {
    this.drawerService.showLocations.next({
      show: false,
      type: '',
      typeOfLocation: '',
    });

    this.drawerService.showCityDistance.next({
      show: true,
    });
    this.showMap(true);
    this.router.navigateByUrl('');
  }
  changeLanguage(language: string) {
    this.changeCssFile(language);
    this.setting.animationFlag =
      this.setting.animationFlag === 'true' ? 'false' : 'true';
    this.mapServicePrivate.loadingProgress.next(true);
    this.settingService.language.next(language.toLowerCase());
    this.languageIndex = this.languageIndex >= 4 ? 0 : this.languageIndex + 1;
    setTimeout(() => {
      this.mapServicePrivate.loadingProgress.next(false);
    }, 2000);
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
      typeOfLocation: '',
    });
    this.showMap(true);
    this.router.navigateByUrl('');
  }
  showMap(toggle: boolean) {
    this.drawerService.showMap.next(toggle);
  }
}
