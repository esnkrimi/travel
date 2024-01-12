import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { actions } from '@appBase/+state/actions';
import { selectCity, selectLocation } from '@appBase/+state/select';
import { Store } from '@ngrx/store';
import * as L from 'leaflet';

@Component({
  selector: 'pe-city-distance-list',
  templateUrl: './city-distance.component.html',
  styleUrls: ['./city-distance.component.scss'],
})
export class CityDistanceComponent implements OnInit {
  sourceCity: any;
  destinationCity: any;
  map: any;
  line: any;
  distance = {
    direct: 0,
    car: 0,
    walk: 0,
    bicycle: 0,
  };
  constructor(private store: Store) {}
  ngOnInit(): void {
    this.map = L.map('mapd', {
      crs: L.CRS.EPSG900913,
      zoomControl: false,
    });
  }
  sourceComebackesults(city: any) {
    this.sourceCity = city;
  }
  destinationComebackesults(city: any) {
    this.destinationCity = city;
  }
  routing() {
    const tmpSource = L.latLng(
      this.sourceCity.latitude,
      this.sourceCity.longitude
    );
    const tmpDestination = L.latLng(
      this.destinationCity.latitude,
      this.destinationCity.longitude
    );
    this.distance.direct = tmpSource.distanceTo(tmpDestination);
    const t = L.Routing.control({
      showAlternatives: false,
      waypoints: [tmpSource, tmpDestination],
      routeLine: function (route) {
        const line: any = L.Routing.line(route);
        return line;
      },
    })
      //this.distance.car=line._route.summary.totalDistance
      .addTo(this.map)
      .hide();
    console.log(t);
  }
}
