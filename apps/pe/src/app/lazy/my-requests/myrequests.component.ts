import { Component, Inject, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import {
  selectAllTrips,
  selectMyTripRequests,
  selectTripRequests,
} from '@appBase/+state/select';
import { DrawerService } from '@appBase/drawer.service';
import { map, tap } from 'rxjs';

@Component({
  selector: 'pe-requests',
  templateUrl: './myrequests.component.html',
  styleUrls: ['./myrequests.component.scss'],
})
export class MyrequestsComponent implements OnInit {
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
      .select(selectMyTripRequests)
      .pipe(
        map((res: any) =>
          res.filter(
            (res: any) =>
              res.ownerid !== JSON.parse(this.userSession)?.id &&
              res.uid === JSON.parse(this.userSession)?.id
          )
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
