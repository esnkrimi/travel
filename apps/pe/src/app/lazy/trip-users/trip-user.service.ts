import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TripUserService {
  baseUrl = 'https://burjcrown.com/drm/travel/index.php?';

  constructor(private httpClient: HttpClient) {}
  getUserList() {
    const url = this.baseUrl + `id=24`;
    return this.httpClient.get(url);
  }

  fetchUserList(uid: any, tripeTitle: any) {
    const url = `${this.baseUrl}id=25&uid=${uid}&tripeTitle=${tripeTitle}`;
    console.log(url);
    return this.httpClient.get(url);
  }

  addUserToTrip(uid: any, tripTitle: any, ownerid: any) {
    const url = `${this.baseUrl}id=16&uid=${uid}&trip=${tripTitle}&ownerid=${ownerid}`;
    return this.httpClient.get(url);
  }
}
