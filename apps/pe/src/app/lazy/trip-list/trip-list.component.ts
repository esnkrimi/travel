import { Component, OnInit, inject } from '@angular/core';
import { TripListsService } from './trip-list.service';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import { selectAllTrips } from '@appBase/+state/select';
import { MapService } from '@appBase/master/map/service';
import { LocalService } from '@appBase/storage';

@Component({
  selector: 'pe-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent implements OnInit {
  trips: any = [];

  constructor(
    private mapService: MapService,
    private service: TripListsService,
    private localStorage: LocalService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.mapService.loadingProgress.next(true);
    this.fetchTrips();
  }
  result(result: any) {
    this.trips = result;
  }
  ask(tripTitle: string, uid: any) {
    const user = JSON.parse(this.localStorage.getData('user'));
    const data = { uid: user.id, tripTitle: tripTitle, owenerid: uid };
    this.store.dispatch(actions.getStartAskToJoin({ data: data }));
  }

  fetchTrips() {
    this.service.fetchTrips().subscribe(() => {
      this.store.dispatch(actions.startFetchAllTrips());
      setTimeout(() => {
        this.select();
      }, 2000);
    });
  }

  select() {
    this.store.select(selectAllTrips).subscribe((res) => {
      this.trips = res;
      this.mapService.loadingProgress.next(false);
    });
  }
}
