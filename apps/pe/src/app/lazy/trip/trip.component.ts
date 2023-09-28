import { NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { actions } from '@appBase/+state/actions';
import { selectReviewtrip, selectTrip } from '@appBase/+state/select';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';
import { TripService } from './trip.service';
import { JoyrideService } from 'ngx-joyride';

@Component({
  selector: 'pe-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss'],
})
export class TripComponent implements OnInit {
  cancelTripConfirm = false;
  panelOpenState = false;
  trip: any;
  listOfReviewTrip: any;
  tripTitle: any;

  types = new Map([
    ['dateIncome', 'date'],
    ['timeIncome', 'time'],
    ['vehicle', 'text'],
    ['note', 'text'],
    ['moneyLost', 'number'],
    ['persons', 'number'],
  ]);
  constructor(
    private tripService: TripService,
    private route: ActivatedRoute,
    private store: Store,
    public dialog: MatDialog,
    private readonly myJoyrideService: JoyrideService,
    private translate: TranslateService
  ) {}

  showTours() {
    this.myJoyrideService.startTour(
      { steps: ['fourthStep', 'fifthStep'] } // Your steps order
    );
  }
  review(tripTitle: string, field: string, trip: any) {
    this.openDialog(tripTitle, field, trip);
  }
  cancelTrip(trip: string) {
    this.tripService.cancelTrip(trip).subscribe();
  }
  openDialog(title: string, field: string, trip: any) {
    const found = this.listOfReviewTrip[0].trip.find(
      (element: any) => element.locationTitle === title
    );

    this.translate.get(field).subscribe((res) => {
      this.dialog.open(DialogDataExampleDialog, {
        data: {
          trip: this.tripTitle,
          title,
          field,
          question: res,
          type: this.types.get(field),
        },
      });
    });
  }
  change(valueOfField: any, title: any, field: any, row: any, tripTitle: any) {
    this.store.dispatch(
      actions.startTripFactorsUpdate({
        location: title,
        field: field,
        vals: valueOfField.target.value,
        trip: tripTitle,
      })
    );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((res: any) => {
      this.tripTitle = res.params.trip;
      this.store
        .select(selectTrip)
        .pipe(
          map((res) => res.filter((res: any) => res.title === this.tripTitle))
        )
        .subscribe((res) => {
          this.trip = res[0];
        });

      this.store
        .select(selectReviewtrip)
        .pipe(
          map((res) => res.filter((res: any) => res.title === this.tripTitle))
        )
        .subscribe((res) => {
          this.listOfReviewTrip = res;
        });
    });
  }
}

@Component({
  selector: 'dialogue',
  templateUrl: 'dialogue.html',
  styleUrls: ['dialogue.scss'],
  standalone: true,
  imports: [MatDialogModule, NgIf, FormsModule, ReactiveFormsModule],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DialogDataExampleDialog implements AfterViewInit {
  @ViewChild('value') value: ElementRef<string> | undefined;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store
  ) {}
  ngAfterViewInit(): void {
    this.store
      .select(selectReviewtrip)
      .pipe(
        map((res) => res.filter((res: any) => res.title === this.data.trip)),
        map((res: any) => res[0].trip),
        map((res: any) =>
          res.filter((res: any) => res.locationTitle === this.data.title)
        )
      )
      .subscribe((res) => (this.value = res[0][this.data.field]));
  }
  submit() {
    this.store.dispatch(
      actions.startReviewUpdate({
        trip: this.data.trip,
        location: this.data.title,
        field: this.data.field,
        vals: this.value,
      })
    );
    this.store.select(selectReviewtrip).subscribe();
  }
}
