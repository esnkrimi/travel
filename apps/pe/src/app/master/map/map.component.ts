import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

@Component({
  selector: 'pe-map-component',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnChanges {
  center = [40.750929, -73.984326];
  country = 'United States';
  city = ' - New York';
  formTripShow = false;
  @Input() scope: any; //from autocomplete search
  @Input() showTour: any;
  @Input() savedLocation: any;
  @Output() zoomActivator = new EventEmitter<any>();

  showMap = true;

  formTripShowAction(e: any) {
    this.formTripShow = e;
  }
  ngOnChanges(): void {
    if (this.scope) {
      this.center = [this.scope.center[0], this.scope.center[1]];
      this.city = this.scope.city;
      this.country = this.scope.country;
    }
  }

  zoomActivatorFunction(event: any) {
    this.zoomActivator.emit(event);
  }
}
