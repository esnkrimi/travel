import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProfileSettingService {
  urlBase = 'https://burjcrown.com/drm/travel/index.php?';

  constructor(private httpClient: HttpClient) {}
  updateSetting(data: any) {
    const url =
      this.urlBase +
      `id=41&uid=${data.uid}&name=${data.name}&lname=${data.lname}&email=${data.email}&password=${data.password}`;
    console.log(url);
    return this.httpClient.get(url);
  }
}
