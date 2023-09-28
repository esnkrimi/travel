import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MytripsService {
  urlBase = 'https://burjcrown.com/drm/travel/index.php?';

  constructor(private httpClient: HttpClient) {}
  myTrips(uid: any) {
    const url = this.urlBase + `id=20&uid=${uid}`;
    return this.httpClient.get(url);
  }
}
