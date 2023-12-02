import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, tap } from 'rxjs';
import { ITrip } from '@appBase/+state/state';

@Injectable({ providedIn: 'root' })
export class TripService {
  trip!: ITrip;
  tripList = new BehaviorSubject<string>('');
  constructor(private httpClient: HttpClient) {}
}
