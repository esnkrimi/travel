import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IScope } from '@appBase/+state/state';
import { MapSetting } from '@appBase/setting';

@Component({
  selector: 'pe-map-component',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnChanges, OnInit {
  @Input() scope: IScope;
  @Input() showTour: boolean;
  @Input() savedLocation: boolean;
  @Output() zoomActivator = new EventEmitter<any>();
  setting: MapSetting = {
    center: [40.750929, -73.984326],
    country: 'United States',
    city: 'New York',
    state: 'New York',
    formTripShow: false,
    showMap: true,
  };

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.getRoutePath();
  }
  formTripShowAction(e: any) {
    this.setting.formTripShow = e;
  }
  getRoutePath() {
    if (Number(this.route.snapshot.paramMap.get('lat')) !== 0)
      this.setting.center = [
        Number(this.route.snapshot.paramMap.get('lat')),
        Number(this.route.snapshot.paramMap.get('lon')),
      ];
  }
  ngOnChanges(): void {
    this.getRoutePath();
    if (this.scope) {
      this.setting.center = [this.scope.center[0], this.scope.center[1]];
      this.setting.city = this.scope.city;
      this.setting.country = this.scope.country;
      this.setting.state = this.scope.state;
    }
  }

  zoomActivatorFunction(event: boolean) {
    this.zoomActivator.emit(event);
  }
}
