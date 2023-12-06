import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import { url } from 'inspector';

@Injectable({ providedIn: 'root' })
export class ZoomApiService {
  baseUrl = 'https://www.burjcrown.com/drm/travel/index.php?id=7&lat=';
  constructor(private httpClient: HttpClient) {}
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

  saved(lid: any, uid: any) {
    this.baseUrl = `https://www.burjcrown.com/drm/travel/index.php?id=10&lid=${lid}&uid=${uid}`;
    //console.log(this.baseUrl);
    return this.httpClient.get(this.baseUrl);
  }
  rate(uid: any, id: any, rate: number) {
    this.baseUrl = `https://www.burjcrown.com/drm/travel/index.php?id=4&lid=${id}&uid=${uid}&rate=${rate}`;
    return this.httpClient.get(this.baseUrl);
  }

  describtion(uid: any, id: any, des: any, form: any) {
    this.baseUrl = `https://www.burjcrown.com/drm/travel/index.php?id=5&lid=${id}&uid=${uid}&des=${des}`;
    return this.httpClient.post(this.baseUrl, form);
  }

  submitLocation(uid: number, formValue: any) {
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
    formData.append('file', formValue.file);
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
    });
    const options = { headers: headers };
    return this.httpClient.post(
      'https://www.burjcrown.com/drm/travel/index.php?id=3',
      formData
    );
  }
}
