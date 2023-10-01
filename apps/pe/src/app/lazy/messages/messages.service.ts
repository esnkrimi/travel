import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MessagesApiService {
  baseUrl = 'https://www.burjcrown.com/drm/travel/index.php?id=8=';
  constructor(private httpClient: HttpClient) {}
  tripReuestConfirmation(
    ownerid: string,
    tripTitle: string,
    user_id: string,
    confirm: boolean
  ) {
    this.baseUrl = `https://www.burjcrown.com/drm/travel/index.php?id=29&uid=${user_id}&ownerid=${ownerid}&tripTitle=${tripTitle}&action=${confirm}`;
    return this.httpClient.get(this.baseUrl);
  }
  fetch(uid: string) {
    this.baseUrl =
      'https://www.burjcrown.com/drm/travel/index.php?id=28&uid=' + uid;
    return this.httpClient.get(this.baseUrl);
  }
}
