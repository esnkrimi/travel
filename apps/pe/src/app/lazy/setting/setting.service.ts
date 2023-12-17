import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProfileSettingService {
  urlBase = 'https://burjcrown.com/drm/travel/index.php?';

  constructor(private httpClient: HttpClient) {}
  updateSetting(data: any) {
    const url =
      this.urlBase +
      `id=41&uid=${data.uid}&name=${data.name}&lname=${data.lname}&email=${data.email}&password=${data.pass}`;
    return this.httpClient.get(url);
  }
  updateSettingAboutMe(uid: any, about: any) {
    const url = this.urlBase + `id=43&uid=${uid}&about=${about}`;
    return this.httpClient.get(url);
  }

  profilePictureUploading(uid: any, form: any) {
    const url = this.urlBase + `id=42&uid=${uid}`;
    return this.httpClient.post(url, form);
  }
}
