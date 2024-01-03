import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MapService {
  loadingProgress = new BehaviorSubject(true);
  locationPrevious = new ReplaySubject(1);
  myLocation = new BehaviorSubject({
    lat: 40.75533379726998,
    lng: -73.9846158027649,
  });
}
