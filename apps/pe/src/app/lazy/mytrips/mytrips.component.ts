import { Component, Inject, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import { selectTripRequests } from '@appBase/+state/select';
import { DrawerService } from '@appBase/drawer.service';
import { map } from 'rxjs';

@Component({
  selector: 'pe-mytrips',
  templateUrl: './mytrips.component.html',
  styleUrls: ['./mytrips.component.scss'],
})
export class MytripsComponent implements OnInit {
  trips: any = [];
  constructor(
    private store: Store,
    private drawerService: DrawerService,
    @Inject('userSession') public userSession: any
  ) {}
  ngOnInit(): void {
    this.hideMap();
    this.myTrips();
  }
  hideMap() {
    this.drawerService.showMap.next(false);
  }
  myTrips() {
    this.store
      .select(selectTripRequests)
      .pipe(
        map((res: any) =>
          res.filter((res: any) => res.uid === JSON.parse(this.userSession)?.id)
        )
      )
      .subscribe((res) => {
        this.trips = res;
      });
  }
  confirm(event: any, ownerId: string, tripTitle: string, userId: string) {
    const action = event.checked ? 1 : 0;
    this.store.dispatch(
      actions.getStartConfirmInvite({
        ownerId: ownerId,
        tripTitle: tripTitle,
        uid: userId,
        action: action,
      })
    );
    this.myTrips();
  }
}
