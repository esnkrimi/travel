import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pe-map-component',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnChanges, OnInit {
  center = [40.750929, -73.984326];
  country = 'United States';
  city = 'New York';
  state = 'New York';
  formTripShow = false;
  @Input() scope: any; //from autocomplete search
  @Input() showTour: any;
  @Input() savedLocation: any;
  @Output() zoomActivator = new EventEmitter<any>();

  showMap = true;

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.getRoutePath();
  }
  formTripShowAction(e: any) {
    this.formTripShow = e;
  }
  getRoutePath() {
    if (Number(this.route.snapshot.paramMap.get('lat')) !== 0)
      this.center = [
        Number(this.route.snapshot.paramMap.get('lat')),
        Number(this.route.snapshot.paramMap.get('lon')),
      ];
  }
  ngOnChanges(): void {
    this.getRoutePath();
    if (this.scope) {
      this.center = [this.scope.center[0], this.scope.center[1]];
      this.city = this.scope.city;
      this.country = this.scope.country;
      this.state = this.scope.state;
    }
  }

  zoomActivatorFunction(event: any) {
    this.zoomActivator.emit(event);
  }
}
