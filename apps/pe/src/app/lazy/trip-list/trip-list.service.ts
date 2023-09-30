import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TripListsService {
  urlBase = 'https://burjcrown.com/drm/travel/index.php?';

  constructor(private httpClient: HttpClient) {}
  fetchTrips() {
    this.urlBase = 'https://burjcrown.com/drm/travel/index.php?id=26';
    return this.httpClient.get(this.urlBase);
  }

  askToJoin(uid: any, tripTitle: string, owenerid: any) {
    const url = `https://burjcrown.com/drm/travel/index.php?id=27&ownerid=${owenerid}&uid=${uid}&tripTitle=${tripTitle}`;
    console.log(url);
    return this.httpClient.get(url);
  }
}
