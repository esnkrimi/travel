import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class LocationListsService {
  urlBase = 'https://burjcrown.com/drm/travel/index.php?';

  constructor(private httpClient: HttpClient) {}
  fetchLocations() {
    this.urlBase = 'https://burjcrown.com/drm/travel/index.php?id=26';
    return this.httpClient.get(this.urlBase);
  }
}
