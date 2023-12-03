import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MyTripsRequestsService {
  urlBase = 'https://burjcrown.com/drm/travel/index.php?';

  constructor(private httpClient: HttpClient) {}
  myTripsRequests(uid: any) {
    const url = this.urlBase + `id=36&uid=${uid}`;
    return this.httpClient.get(url);
  }
}
