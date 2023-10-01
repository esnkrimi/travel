import { Inject, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, tap } from 'rxjs';
import { ITrip } from '@appBase/model';
import { TripService } from './trip.service';

@Injectable({ providedIn: 'root' })
export class MapApiService {
  baseUrl = '';
  constructor(
    private httpClient: HttpClient,
    private tripService: TripService,
    @Inject('userSession') public userSession: any
  ) {}
  savedLocation = new BehaviorSubject(false);
  template: ITrip = {
    title: '',
    reviewtrip: [
      {
        lat: '',
        lon: '',
        dateIncome: '',
        timeIncome: '',
        note: '',
        moneyLost: '',
        persons: '',
        locationTitle: '',
      },
    ],
    trip: [
      {
        lat: '',
        lon: '',
        dateIncome: '',
        timeIncome: '',
        note: '',
        moneyLost: '',
        persons: '',
        locationTitle: '',
      },
    ],
  };

  trip = new BehaviorSubject<ITrip>(this.template);
  tripLocations = new BehaviorSubject<any>('');
  bgLoader = new BehaviorSubject<any>(false);

  fetchAllByCountry(country: string) {
    this.baseUrl =
      'https://www.burjcrown.com/drm/travel/index.php?id=6&country=' + country;
    return this.httpClient.get(this.baseUrl);
  }

  fetchTrip() {
    const baseUrl =
      'https://www.burjcrown.com/drm/travel/index.php?id=11&uid=' +
      JSON.parse(this.userSession)?.id;
    return this.httpClient.get(baseUrl);
  }

  updateReviewTrip(trip: any) {
    const baseUrl =
      'https://www.burjcrown.com/drm/travel/index.php?id=13&uid=' +
      JSON.parse(this.userSession)?.id +
      '&trip=' +
      encodeURIComponent(trip);
    return this.httpClient.get(baseUrl);
  }
  updateTripFactors(trip: any) {
    const baseUrl =
      'https://www.burjcrown.com/drm/travel/index.php?id=15&uid=' +
      JSON.parse(this.userSession)?.id +
      '&trip=' +
      encodeURIComponent(trip);
    return this.httpClient.get(baseUrl);
  }

  updateTrip(trip: any) {
    const baseUrl =
      'https://www.burjcrown.com/drm/travel/index.php?id=12&uid=' +
      JSON.parse(this.userSession)?.id +
      '&trip=' +
      encodeURIComponent(trip);
    return this.httpClient.get(baseUrl);
  }
}
