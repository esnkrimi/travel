import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UsersService {
  urlBase = 'https://burjcrown.com/drm/travel/index.php?';

  constructor(private httpClient: HttpClient) {}
  users(uid: any) {
    const url = this.urlBase + `id=36&uid=${uid}`;
    return this.httpClient.get(url);
  }

  userRater() {
    const url = this.urlBase + `id=37`;
    return this.httpClient.get(url);
  }

  writeUserRater(data: any) {
    const url =
      this.urlBase +
      `id=38` +
      `&uid=${data.uid}&user_candidate_id=${data.candidate_id}&comment=${data.comment}&rate=${data.rate}`;
    //console.log(url);
    return this.httpClient.get(url);
  }
}
