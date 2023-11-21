import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DrawerService } from '@appBase/drawer.service';

@Component({
  selector: 'pe-map-component',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnChanges {
  center = [31.95376472, -89.23450472];
  city = 'Okolona';
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
    }
  }

  zoomActivatorFunction(event: any) {
    this.zoomActivator.emit(event);
  }
}
