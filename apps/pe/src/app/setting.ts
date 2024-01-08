import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  language = new BehaviorSubject<string>('en');
}
export const settings = {
  languages: [
    {
      title: 'en',
      language: 'english',
    },
    {
      title: 'fa',
      language: 'فارسی',
    },
    {
      title: 'ge',
      language: 'Dutch',
    },
    {
      title: 'ru',
      language: 'русский',
    },
    {
      title: 'ar',
      language: 'العربی',
    },
  ],
};

export interface LoginSetting {
  routeType: string;
  buttonDisabled: boolean;
  loginError: boolean;
  loginSuccess: boolean;
  errorPasswordEqual: boolean;
}

export interface LocationSetting {
  loadingProgress: boolean;
  rateFilter: string;
  rateFilterNumber: number;
  locatinListFiltered: any;
  locatinList: [];
  locatinTypeList: [];
  selectedType: string;
  page: number;
  cityActive?: string;
}

export interface APPSetting {
  showMap: boolean;
  open: boolean;
  SelectedLanguage: string;
  openModalLocationRoute: boolean;
  isLoggedin?: boolean;
  loadingProgress: boolean;
  savedLocationFlag: boolean;
  bgLoader: boolean;
  showTour: boolean;
}

export interface ZoomSetting {
  showFormSubmit: boolean;
  userListShow: boolean;
  existLocation: boolean;
  userLogined: number;
  loadingSmall: boolean;
}

export interface HeaderSetting {
  animationFlag: string;
  menuShow: boolean;
  scrollDown: boolean;
  shearchShow: boolean;
}
export interface MapSetting {
  center: any;
  country: string;
  city: string;
  state: string;
  formTripShow: boolean;
  showMap: boolean;
}
export interface MapDetailsSetting {
  openModalLocationListFlag: boolean;
  openModalLocationFlag: boolean;
  toolsShow: boolean;
  savedLocationFlag: boolean;
  showMap: boolean;
  createTripActivate: boolean;
  tripSelectIndex: number;
  distanceValue: number;
  routingActivated: boolean;
  distanceActivated: boolean;
  selectLocationActivated: boolean;
  loadingProgress: boolean;
  currentLocationActivated: boolean;
}
