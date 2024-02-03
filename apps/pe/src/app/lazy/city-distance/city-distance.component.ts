import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationGeoService } from '@appBase/drawer.service';
import { DistancePipe } from '@appBase/pipe/distance-to-time.pipe';
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
    routingDistance: '0',
    car: '0',
    walk: '0',
    bicycle: '0',
  };
  constructor(
    private distancePipe: DistancePipe,
    private locationGeoService: LocationGeoService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.map = L.map('mapd', {
      crs: L.CRS.EPSG900913,
      zoomControl: false,
    });
  }

  showMapComponent() {
    this.locationGeoService.showCityDistance.next({
      show: false,
    });
    this.locationGeoService.showMap.next(true);
    this.locationGeoService.cityDistance.next({
      sourceLat: this.sourceCity.latitude,
      sourceLon: this.sourceCity.longitude,
      destinationLat: this.destinationCity.latitude,
      destinationLon: this.destinationCity.longitude,
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
    this.distance.direct = Math.round(tmpSource.distanceTo(tmpDestination));
    const t = L.Routing.control({
      showAlternatives: false,
      waypoints: [tmpSource, tmpDestination],
      routeLine: (route) => {
        const line: any = L.Routing.line(route);
        this.distance.routingDistance =
          Math.round(line._route.summary.totalDistance) + 'm';
        this.distance.car = this.distancePipe.transform(
          Math.round(line._route.summary.totalDistance),
          'car'
        );

        this.distance.walk = this.distancePipe.transform(
          Math.round(line._route.summary.totalDistance),
          'walk'
        );
        return line._route.summary.totalDistance;
      },
    })
      .addTo(this.map)
      .hide();
  }
}
