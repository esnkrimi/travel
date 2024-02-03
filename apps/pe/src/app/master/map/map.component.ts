import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IScope } from '@appBase/+state/state';
import { LocationGeoService } from '@appBase/drawer.service';
import { MapSetting } from '@appBase/setting';
import { MapService } from './service';

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
  clientIp: any;
  setting: MapSetting = {
    center: [40.750929, -73.984326],
    country: 'United States',
    city: 'New York',
    state: 'New York',
    formTripShow: false,
    showMap: true,
    distance: {
      destinationLat: '',
      destinationLon: '',
      sourceLat: '',
      sourceLon: '',
    },
  };

  constructor(
    @Inject('userSession') public userSession: any,
    private route: ActivatedRoute,
    private mapService: MapService,
    private geoService: LocationGeoService
  ) {}
  ngOnInit(): void {
    //this.getIPAddress();
    this.getRoutePath();
  }

  formTripShowAction(e: any) {
    this.setting.formTripShow = e;
  }
  getIPAddress() {
    this.geoService.getIPAddress().subscribe((res: any) => {
      this.clientIp = res.ip;
      this.fetchLocationByIpAddress(this.clientIp);
    });
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
  fetchLocationByIpAddress(ipAddress: string) {
    this.mapService.loadingProgress.next(true);
    if (!JSON.parse(this.userSession)?.id)
      this.geoService
        .fetchLocationByIpAddress(ipAddress)
        .subscribe((res: any) => {
          this.setting.center = [res?.latitude, res?.longitude];
          this.setting.country = res?.country_name;
          this.setting.city = res?.city_name;
          this.setting.state = res?.region_name;
          this.mapService.loadingProgress.next(false);
        });
  }
  zoomActivatorFunction(event: boolean) {
    this.zoomActivator.emit(event);
  }
}
