import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { actions } from '@appBase/+state/actions';
import { selectTrip } from '@appBase/+state/select';
import { Store } from '@ngrx/store';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { MapApiService } from 'libs/map/src/lib/component/map.service';

@Component({
  selector: 'pe-trip-submit',
  templateUrl: './trip-submit.component.html',
  styleUrls: ['./trip-submit.component.scss'],
})
export class TripSubmitComponent {
  @Input() currentTrip: any;
  anotherLocationFlag = false;
  loadBg = true;

  constructor(
    private store: Store,
    private _snackBar: MatSnackBar,
    private mapApiServie: MapApiService
  ) {}

  return() {
    this.loadBg = false;
  }
  submitTrip() {
    this.loadBg = true;
    this.store.dispatch(
      actions.startAddTripPoint({
        trip: this.currentTrip,
        title: this.currentTrip.title,
      })
    );
    this.store.select(selectTrip).subscribe((res) => {
      //console.log(res);
      this.store.dispatch(
        actions.addTrip({
          title: this.currentTrip.title,
          trip: JSON.stringify(res),
        })
      );
    });
    this.currentTrip = {
      title: '',
      trip: [],
    };
  }
}
