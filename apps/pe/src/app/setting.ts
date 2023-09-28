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
