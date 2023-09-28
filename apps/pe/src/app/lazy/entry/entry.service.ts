import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Iuser } from '@appBase/model';
import { BehaviorSubject } from 'rxjs';
import { ConditionalExpr } from '@angular/compiler';

@Injectable({ providedIn: 'root' })
export class EntryService {
  urlLogin = 'https://burjcrown.com/drm/travel/index.php?';
  userModel: Iuser = {
    id: '',
    name: '',
    lname: '',
    email: '',
    mobile: '',
    password: '',
  };
  userLoginInformation = new BehaviorSubject<Iuser>(this.userModel);
  constructor(private httpClient: HttpClient) {}
  login(values: any) {
    const url =
      this.urlLogin + `id=1&email=${values.email}&pass=${values.password}`;
    return this.httpClient.get(url);
  }

  signup(values: any) {
    const url =
      this.urlLogin + `id=0&email=${values.email}&pass=${values.password}`;
    return this.httpClient.get(url);
  }
}
