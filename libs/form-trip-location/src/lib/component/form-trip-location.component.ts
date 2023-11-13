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
import { actions } from '@appBase/+state/actions';
import { selectTrip } from '@appBase/+state/select';
import { MapService } from '@appBase/master/map/service';
import { Store } from '@ngrx/store';
import { HelpService } from 'libs/help/src/lib/component/help.service';
import { MapApiService } from 'libs/map/src/lib/component/map.service';

@Component({
  selector: 'pe-form-trip-location',
  templateUrl: './form-trip-location.component.html',
  styleUrls: ['./form-trip-location.component.scss'],
})
export class FormTripLocationComponent implements OnChanges, AfterViewInit {
  @Output() submitedForm = new EventEmitter<any>();
  @Output() tripFinished = new EventEmitter<any>();
  @Output() cancelTripSubmitVar = new EventEmitter<any>();

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
    timeIncome: new FormControl<string>('', Validators.required),
    vehicle: new FormControl<string>('', Validators.required),
    note: new FormControl<string>(''),
    moneyLost: new FormControl<string>('', Validators.required),
    persons: new FormControl<string>('', Validators.required),
    locationTitle: new FormControl<string>('', Validators.required),
  });
  titleLocal = '';
  disabledTitleSubmit = true;
  formCount = 0;
  @Input() title: any;
  @Input() currentTrip: any;
  selectLocationActivated = false;

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(this.title);

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
      ?.valueChanges.subscribe((res: any) => {
        this.disabledTitleSubmit = res.length > 2 ? false : true;
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

    this.submitedForm.emit({
      currentTrip: this.currentTrip,
      selectLocationActivated: false,
      title: tripTitle,
    });
  }
  onSubmitTripLocation() {
    this.indexFormItemShow = 9;
  }

  FinishSubmitTrip() {
    this.onCommitSubmitTripLocation(true);
    this.store.dispatch(
      actions.startAddTripPoint({
        trip: this.currentTrip,
        title: this.currentTrip.title,
      })
    );
    this.store.select(selectTrip).subscribe((res) => {
      this.store.dispatch(actions.addTrip({ trip: JSON.stringify(res) }));
    });
    this.currentTrip = {
      title: '',
      trip: [],
    };
  }
}
