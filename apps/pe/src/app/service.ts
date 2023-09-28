import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RootService {
  constructor(private httpClient: HttpClient) {}
  fetchTrip(uid: string) {
    const baseUrl =
      'https://www.burjcrown.com/drm/travel/index.php?id=11&uid=' + uid;
    return this.httpClient.get(baseUrl);
  }
}
