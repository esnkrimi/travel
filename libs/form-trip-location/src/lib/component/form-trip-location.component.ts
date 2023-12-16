import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { actions } from '@appBase/+state/actions';
import {
  selectAllTrips,
  selectTrip,
  selectTripUsers,
} from '@appBase/+state/select';
import { MapService } from '@appBase/master/map/service';
import { Store } from '@ngrx/store';
import { HelpService } from 'libs/help/src/lib/component/help.service';
import { MapApiService } from 'libs/map/src/lib/component/map.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { interval, map, tap } from 'rxjs';

@Component({
  selector: 'pe-form-trip-location',
  templateUrl: './form-trip-location.component.html',
  styleUrls: ['./form-trip-location.component.scss'],
})
export class FormTripLocationComponent implements OnChanges, AfterViewInit {
  @Output() submitedForm = new EventEmitter<any>();
  @Output() tripFinished = new EventEmitter<any>();
  @Output() cancelTripSubmitVar = new EventEmitter<any>();
  @Output() hideForm = new EventEmitter<any>();

  vehicle = '';
  finishTheTrip = 0;
  formSubmitLocation = false;
  vehicles = ['car', 'bus', 'airplane', 'ship', 'boat', 'walk', 'train'];
  @Input() latSelect: any;
  formItemShow = [
    { name: 'lat', type: 'text', label: '' },
    { name: 'lont', type: 'text', label: '' },
    {
      name: 'dateIncome',
      type: 'date',
      label: 'which date you will arrive here?',
    },
    {
      name: 'timeIncome',
      type: 'time',
      label: 'when time you will arrive here?',
    },
    { name: 'vehicle', type: 'text', label: 'which vehicle do you use?' },
    { name: 'note', type: 'text', label: 'note any thing you need !' },
    {
      name: 'moneyLost',
      type: 'number',
      label: 'how much can you spend here?',
    },
    {
      name: 'persons',
      type: 'number',
      label: 'how many person are your team?',
    },
    {
      name: 'locationTitle',
      type: 'string',
      label: 'Where is here ?',
    },
  ];
  indexFormItemShow = 1;
  constructor(
    private mapService: MapService,
    private store: Store,
    public dialog: MatDialog,
    private mapApiService: MapApiService,
    private helpService: HelpService
  ) {}
  formSubmitTitle = new FormGroup({
    inputTitle: new FormControl<string>(''),
  });

  formSubmitTripLocation = new FormGroup({
    lat: new FormControl<string>(''),
    lon: new FormControl<string>(''),
    dateIncome: new FormControl<string>('', Validators.required),
    timeIncome: new FormControl<string>(''),
    vehicle: new FormControl<string>('', Validators.required),
    note: new FormControl<string>(''),
    moneyLost: new FormControl<string>('', Validators.required),
    persons: new FormControl<string>('', Validators.required),
    locationTitle: new FormControl<string>('', Validators.required),
  });
  titleLocal = '';
  disabledTitleSubmit = true;
  repeatedTripTitle = true;
  formCount = 0;
  @Input() title: any;
  @Input() currentTrip: any;
  selectLocationActivated = false;

  ngOnChanges(changes: SimpleChanges): void {
    this.mapApiService.bgLoader.next(true);
    if (this.title.length > 1) this.indexFormItemShow = 2;
    this.formSubmitTripLocation.get('lat')?.setValue(this.latSelect[0]);
    this.formSubmitTripLocation.get('lon')?.setValue(this.latSelect[1]);
  }
  cancelTripSubmit() {
    this.cancelTripSubmitVar.emit(true);
  }
  ngAfterViewInit(): void {
    this.listener();
  }
  listener() {
    this.formSubmitTitle
      .get('inputTitle')
      ?.valueChanges.subscribe((input: any) => {
        this.store
          .select(selectTripUsers)
          .pipe(map((res) => res.filter((res) => res.tripTitle === input)))
          .subscribe((res) => {
            if (res.length > 0) {
              this.repeatedTripTitle = true;
              this.formSubmitTripLocation.invalid;
            } else this.repeatedTripTitle = false;
          });
        this.disabledTitleSubmit = input.length > 2 ? false : true;
      });
  }
  selectVehicle(vehicle: string) {
    this.formSubmitTripLocation.get('vehicle')?.setValue(vehicle);
    this.vehicle = vehicle;
  }
  finish() {
    //console.log('IFNI');
  }
  onCommitSubmitTripLocation(finish: boolean) {
    this.hideForm.emit(false);
    this.mapService.loadingProgress.next(true);
    switch (finish) {
      case true:
        this.finishTheTrip = 2;
        this.helpService.messageWrite(
          'created successfully ! you can manage your tripe via Icon T in tool box'
        );
        this.tripFinished.emit(true);
        break;
      case false:
        this.finishTheTrip = 1;
        this.helpService.messageWrite('select next place would you visit ');
        break;

      default:
        break;
    }
    this.mapService.loadingProgress.next(false);
    this.mapApiService.bgLoader.next(false);
    this.selectLocationActivated = false;
    this.currentTrip.trip.push(this.formSubmitTripLocation.value);
    this.currentTrip.title = this.title;
    const tripTitle = this.title
      ? this.title
      : this.formSubmitTitle.get('inputTitle')?.value;
    this.currentTrip.title = tripTitle;
    this.currentTrip.finish = false;

    this.submitedForm.emit({
      currentTrip: this.currentTrip,
      selectLocationActivated: false,
      title: tripTitle,
    });
  }
  onSubmitTripLocation() {
    this.indexFormItemShow = 9;
  }

  openDialog() {
    const dialogRef = this.dialog.open(ImageDialogue, {
      data: {
        title: this.formSubmitTitle.get('inputTitle')?.value || this.title,
      },
    });
    dialogRef.afterClosed().subscribe();
  }

  FinishSubmitTrip() {
    this.hideForm.emit(false);
    this.onCommitSubmitTripLocation(true);
    this.store.dispatch(
      actions.startAddTripPoint({
        trip: this.currentTrip,
        title: this.currentTrip.title,
        finish: false,
      })
    );
    this.store.select(selectTrip).subscribe((res) => {
      //console.log(res);
      this.store.dispatch(
        actions.addTrip({
          title: this.currentTrip.title,
          trip: JSON.stringify(res),
          finish: false,
        })
      );
    });
    this.currentTrip = {
      title: '',
      trip: [],
      finish: false,
    };
    this.openDialog();
  }
}

@Component({
  selector: 'image-dialogue',
  templateUrl: 'image-dialogue.html',
  styleUrls: ['./image-dialogue.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    RouterModule,
    MatButtonModule,
    NgxPaginationModule,
  ],
})
export class ImageDialogue {
  uid: any;
  timestampValue: any;
  form = new FormGroup({
    uid: new FormControl(),
    title: new FormControl(),
    files: new FormControl(),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject('userSession') public userSession: any,
    private store: Store
  ) {}

  timeStamp() {
    return new Date().getTime();
  }

  onFileChange(event: any) {
    interval(1000).subscribe((res) => {
      this.timestampValue = this.timeStamp();
      this.uid = JSON.parse(this.userSession)?.id;
    });
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.patchValue({
        files: file,
        uid: JSON.parse(this.userSession)?.id,
        title: this.data.title,
      });
    }
    const formData = new FormData();
    formData.append('file', this.form.get('files')?.value);
    const data = {
      tripTitle: this.data.title,
      uid: JSON.parse(this.userSession)?.id,
      formData: formData,
    };
    this.store.dispatch(actions.startTripPictureUploading(data));
  }
}
