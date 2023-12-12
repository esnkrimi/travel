import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FormtripApiService {
  baseUrl = 'https://www.burjcrown.com/drm/travel/index.php?id=8=';
  constructor(private httpClient: HttpClient) {}
  fetch(locationId: string) {
    this.baseUrl =
      'https://www.burjcrown.com/drm/travel/index.php?id=8&locationId=' +
      locationId;
    return this.httpClient.get(this.baseUrl);
  }
  tripPictureUploading(uid: any, tripTitle: string, formData: any) {
    const url =
      'https://www.burjcrown.com/drm/travel/index.php?' +
      `id=44&uid=${uid}&tripTitle=${tripTitle}`;
    return this.httpClient.post(url, formData);
  }
}
