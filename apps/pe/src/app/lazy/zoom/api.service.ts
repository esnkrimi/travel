import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ZoomApiService {
  baseUrl = 'https://www.burjcrown.com/drm/travel/index.php?id=7&lat=';
  constructor(
    private httpClient: HttpClient,
    @Inject('userSession') public userSession: string
  ) {}
  zoom(lat: string, lon: string, uid: any) {
    this.baseUrl =
      'https://www.burjcrown.com/drm/travel/index.php?id=7&lat=' +
      lat +
      '&lon=' +
      lon +
      '&uid=' +
      uid +
      '&i=3';
    return this.httpClient.get(this.baseUrl).pipe(map((res: any) => res[0]));
  }

  saved(lid: number, uid: number) {
    this.baseUrl = `https://www.burjcrown.com/drm/travel/index.php?id=10&lid=${lid}&uid=${uid}`;
    this.baseUrl;
    return this.httpClient.get(this.baseUrl);
  }
  rate(uid: number, id: string, rate: number) {
    this.baseUrl = `https://www.burjcrown.com/drm/travel/index.php?id=4&lid=${id}&uid=${uid}&rate=${rate}`;
    return this.httpClient.get(this.baseUrl);
  }

  describtion(uid: number, id: string, des: string, form: any) {
    this.baseUrl = `https://www.burjcrown.com/drm/travel/index.php?id=5&lid=${id}&uid=${uid}&des=${des}`;
    return this.httpClient.post(this.baseUrl, form);
  }

  share(userId: string, locationId: string) {
    const uid = JSON.parse(this.userSession)?.id;
    this.baseUrl = `https://www.burjcrown.com/drm/travel/index.php?id=46&userId=${userId}&locationId=${locationId}&sender=${uid}`;
    return this.httpClient.get(this.baseUrl);
  }

  submitLocation(uid: number, formValue: any, formFile: any) {
    const formData: any = new FormData();
    formData.append('uid', uid);
    formData.append('title', formValue.title);
    formData.append('country', formValue.country);
    formData.append('city', formValue.city);
    formData.append('county', formValue.county);
    formData.append('street', formValue.street);
    formData.append('email', formValue.email);
    formData.append('phone', formValue.phone);
    formData.append('web', formValue.web);
    formData.append('type', formValue.type);
    formData.append('lat', formValue.lat);
    formData.append('lon', formValue.lon);
    formData.append('district', formValue.district);
    formData.append('describe', formValue.describe);
    formData.append('rate', formValue.score);
    for (let pair of formFile.entries()) {
      formData.append('file[]', pair[1]);
    }

    return this.httpClient.post(
      'https://www.burjcrown.com/drm/travel/index.php?id=3',
      formData
    );
  }
}
