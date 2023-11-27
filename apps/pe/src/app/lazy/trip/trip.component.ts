import { NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
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
import {
  selectReviewtrip,
  selectTrip,
  selectTripRequests,
} from '@appBase/+state/select';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, map, tap } from 'rxjs';
import { TripService } from './trip.service';
import { JoyrideService } from 'ngx-joyride';
import { DrawerService } from '@appBase/drawer.service';

@Component({
  selector: 'pe-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss'],
})
export class TripComponent implements OnInit {
  cancelTripConfirm = false;
  panelOpenState = false;
  ownerPermission = false;
  trip: any;
  listOfReviewTrip: any;
  tripTitle: any;
  subscription: any;
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
    @Inject('userSession') public userSession: any,
    private readonly myJoyrideService: JoyrideService,
    private drawerService: DrawerService,
    private translate: TranslateService
  ) {}
  hideMap() {
    this.drawerService.showMap.next(false);
  }
  showTours() {
    this.myJoyrideService.startTour(
      { steps: ['fourthStep', 'fifthStep'] } // Your steps order
    );
  }
  review(tripTitle: string, field: string, trip: any) {
    this.openDialog(tripTitle, field, trip);
  }
  cancelTrip(trip: string) {
    this.subscription = this.tripService.cancelTrip(trip).subscribe();
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
    console.log(tripTitle, valueOfField, title, field, row);
    this.store.dispatch(
      actions.startTripFactorsUpdate({
        location: title,
        field: field,
        vals: valueOfField.target.value,
        trip: tripTitle,
      })
    );
  }

  tripOwnerChecking(tripTitle: string): any {
    const uid = JSON.parse(this.userSession)?.id;
    this.store
      .select(selectTripRequests)
      .pipe(
        // tap((res) => console.log(res)),
        map((res: any) => res.filter((res: any) => res.uid === uid)),
        map((res: any) => res.filter((res: any) => res.tripTitle === tripTitle))
        // tap((res) => console.log(res))
        // tap((res) => console.log(res))
      )
      .subscribe((res) => {
        // this.trips = res;
        this.ownerPermission = res.length > 0 ? true : false;
        // return result;
      });
  }

  ngOnInit(): void {
    this.hideMap();
    this.route.paramMap.subscribe((res: any) => {
      this.tripTitle = res.params.trip;
      this.store
        .select(selectTrip)
        .pipe(
          map((res) => res.filter((res: any) => res.title === this.tripTitle))
        )
        .subscribe((res) => {
          this.trip = res[0];
          this.tripOwnerChecking(this.trip.title);
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
