import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
        'st1',
        style({
          transform: 'rotate(90) !important',
          opacity: 0.8,
        })
      ),
      state(
        'st2',
        style({
          opacity: 1,
        })
      ),
      transition('st1 <=> st2', animate('400ms ease-in')),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  languages = settings.languages;
  languageIndex = 1;
  animationFlag = false;
  @Output() resultOutputs = new EventEmitter<any>();
  @Output() savedLocation = new EventEmitter<any>();
  savedLocationFlag = false;
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
  logout() {
    this.progresService.loadingProgress.next(true);
    this.localStorage.clearData();
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
  ngOnInit(): void {
    this.fetchUser();
  }
  routeHome() {
    this.drawerService.showMap.next(true);
    window.location.reload();
  }
  changeLanguage(language: string) {
    this.mapServicePrivate.loadingProgress.next(true);
    setTimeout(() => {
      this.mapServicePrivate.loadingProgress.next(false);
      this.settingService.language.next(language.toLowerCase());
      this.languageIndex = this.languageIndex >= 4 ? 0 : this.languageIndex + 1;
      this.animationFlag = !this.animationFlag;
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
    this.menuShow = false;
    this.savedLocationFlag = !this.savedLocationFlag;
    this.drawerService.showMap.next(true);
    this.savedLocation.emit(this.savedLocationFlag);
    this.router.navigateByUrl('lazy/zoom');
  }

  route(path: any) {
    this.drawerService.drawerType.next(`/${path}`);
  }
  // [routerLink]="[{ outlets: { secondRouter: ['lazy'] } }]
  routeViaSecond(path: any) {
    this.router.navigate([{ outlets: { secondRouter: [`lazy/mytrips`] } }]);
  }
}
