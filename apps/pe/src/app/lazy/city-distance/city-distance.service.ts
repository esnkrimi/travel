import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CityDistanceService {
  urlBase = 'https://burjcrown.com/drm/travel/index.php?';

  constructor(
    private httpClient: HttpClient,
    @Inject('userSession') public userSession: any
  ) {}
  fetchCities(searchItem: string) {
    this.urlBase = `https://burjcrown.com/drm/travel/index.php?time=19&id=52&searchItem=${searchItem}`;
    return this.httpClient.get(this.urlBase);
  }
}
