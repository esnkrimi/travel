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

  tripReuestConfirmation(
    ownerid: string,
    tripTitle: string,
    user_id: string,
    confirm: boolean
  ) {
    this.urlBase = `https://www.burjcrown.com/drm/travel/index.php?id=30&uid=${user_id}&ownerid=${ownerid}&tripTitle=${tripTitle}&action=${confirm}`;
    //console.log(this.urlBase);
    return this.httpClient.get(this.urlBase);
  }
}
