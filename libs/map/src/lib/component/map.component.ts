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
import { LazyModule } from '@appBase/lazy/lazy.module';
import { MapService } from '@appBase/master/map/service';
import { DrawerService } from '@appBase/drawer.service';
import { Ilocation, typeOflocations } from '@appBase/+state/state';
import { MapApiService } from './map.service';
import { LatLngExpression } from 'leaflet';
import { map, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import { selectLocation, selectTrip } from '@appBase/+state/select';
import { JoyrideService } from 'ngx-joyride';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as L from 'leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import { DistancePipe } from './pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { HelpService } from 'libs/help/src/lib/component/help.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
@Component({
  selector: 'pe-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DistancePipe],
})
export class MapBoardComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() formTripShow: any;
  @Output() formTripShowAction = new EventEmitter<any>();
  openModalLocationListFlag = false;

  @Input() country: any;
  @Input() city: any;
  @Input() center: any;

  @Input() showTour: any;
  @Input() tripLocations: any;
  @Input() savedLocation = false;

  @Output() zoomActivator = new EventEmitter<any>();
  draggingLocation = {
    country: 'United States',
    city: ' - New York',
    street: '',
    suburb: ' ',
  };
  showMap = true;
  createTripActivate = false;

  currentTrip: any = {
    title: '',
    trip: [],
  };
  tripSelectIndex = 1;
  distanceValue = 0;
  distanceActivated = false;
  selectLocationActivated = false;
  listOfTrip: any;
  fromOrTo = 'from';
  distanceFrom: any;
  distanceTo: any;
  mapConfig = {
    center: [40.750929, -73.984326],
    countryScope: 'United States',
    typeOfLocation: 'all',
  };
  typeOflocations = typeOflocations;
  positionView: any;
  selectedType = 'all';
  private map: any;
  previous: any = null;
  distance = 0;
  loadingProgress = true;
  icon: any = new L.Icon({
    className: 'my-markers',
    iconUrl: 'assets/img/mall.png',
    iconSize: [30, 30],
  });
  latSelect: any = [];
  locationSelected: Ilocation = {
    id: 0,
    country: '',
    city: '',
    street: '',
    county: '',
    no: '',
    email: '',
    phone: '',
    web: '',
    describe: '',
    type: '',
    lon: '',
    lat: '',
    title: '',
    district: '',
    score: 0,
  };
  title = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private helpService: HelpService,
    private mapService: MapService,
    private drawerService: DrawerService,
    private distancePipe: DistancePipe,
    private mapApiService: MapApiService,
    private store: Store,
    private readonly joyrideService: JoyrideService,
    private _snackBar: MatSnackBar
  ) {}
  getShowLocationState() {
    this.drawerService.showLocations.subscribe((res: any) => {
      this.openModalLocationListFlag = res;
    });
  }
  cancelTripSubmitVar(event: any) {
    this.selectLocationActivated = !event;
    this.mapApiService.bgLoader.next(false);
    this.formTripShowAction.emit(false);
  }
  submitedForm(e: any) {
    this.selectLocationActivated = e.selectLocationActivated;
    this.currentTrip = e.currentTrip;
    this.title = e.title;
  }

  hideForm(e: any) {
    this.formTripShowAction.emit(false);
  }
  distanceDrawer(from: any, to: any) {
    let lineLng: any;
    this.distanceValue = from.distanceTo(to);
    lineLng = [from, to];
    const polyline = L.polyline(lineLng, {
      smoothFactor: 50,
      noClip: false,
      color: 'purple',
      weight: 13,
      className: 'line',
    })

      .setStyle({
        fillColor: 'red',
      })
      .bindPopup(
        '<strong>' +
          Math.round(this.distanceValue) / 1000 +
          'km </strong><hr>' +
          this.distancePipe.transform(this.distanceValue, 'car') +
          '<br>' +
          this.distancePipe.transform(this.distanceValue, 'walk')
      )

      .on('click', (event) => {
        // this.closeSnackBar();
        polyline.openPopup();
      });
    polyline.addTo(this.map);
    setTimeout(() => {
      polyline.openPopup();
    }, 100);
  }
  distanceActive(e: any) {
    this.addMarker(e.latlng, 'location', [30, 30]);
    if (this.fromOrTo === 'from') {
      this.distanceFrom = e.latlng;
      this.fromOrTo = 'to';
      this.distanceValue = 0;
      this.helpService.messageWrite('select destination on map');
    } else {
      this.helpService.messageWrite('click on purple line');
      this.distanceTo = e.latlng;
      this.fromOrTo = 'from';
      this.distanceDrawer(this.distanceFrom, this.distanceTo);
    }
  }

  createTrip() {
    this.distanceActivated = false;
    this.createTripActivate = !this.createTripActivate;
  }

  startCreateTrip(e: any) {
    this.formTripShowAction.emit(true);
    this.helpService.messageWrite('');
    this.addMarker(e.latlng, 'location', [35, 35]);
    this.tripSelectIndex++;
    this.selectLocationActivated = true;
    this.latSelect = [e.latlng.lat, e.latlng.lng];
    //this.store.dispatch(actions.startAddTripPoin({ trip: trip }));
  }
  getRoute() {
    this.drawerService.showMap.subscribe((res) => {
      this.showMap = res;
    });
  }
  activeDistanceMeter() {
    this.helpService.messageWrite('select start point on map');
    this.createTripActivate = false;
    this.distanceActivated = !this.distanceActivated;
    //  if (this.distanceActivated) this.openSnackBar('select location on map');
  }
  tripFinished(e: any) {
    this.distanceActivated = false;
    this.createTripActivate = true;
  }

  turnOffProgress(time: number) {
    setTimeout(() => {
      this.mapService.loadingProgress.next(false);
    }, time);
  }
  capitalizeFirstLetter(str: string): string {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
  }

  fetchLocations(location: any) {
    this.positionView = this.map?.setView(
      {
        lat: location.trip[0].lat,
        lng: location.trip[0].lon,
      },
      14
    );
    this.router.navigateByUrl('lazy/zoom');
    for (let i = 0; i < location.trip.length; i++) {
      const obj: L.LatLng = new L.LatLng(
        location.trip[i].lat,
        location.trip[i].lon
      );
      this.addMarker(obj, 'location', 0, i + 1);
      if (i < location.trip.length - 1) {
        const objDest: L.LatLng = new L.LatLng(
          location.trip[i + 1].lat,
          location.trip[i + 1].lon
        );
        this.distanceDrawer(obj, objDest);
        const t: any = obj.distanceTo(objDest);
      }
    }
  }

  fetchByCity(city: string, changedCity: boolean) {
    city = city.toLowerCase();
    let data: any;
    if (changedCity)
      this.store.dispatch(
        actions.startFetchCountryLocationAction({
          city: city,
        })
      );

    this.store
      .select(selectLocation)
      .pipe(
        map((res) => res.filter((res) => res.saved || !this.savedLocation)),
        map((res) =>
          res.filter(
            (res) =>
              this.selectedType === 'all' || this.selectedType === res?.type
          )
        ),
        tap((r) => {
          if (r.length === 0) this.mapService.loadingProgress.next(false);
        })
      )
      .subscribe((data) => {
        for (let i = 0; i < data.length; i++) {
          const obj: any = {
            lat: data[i]?.lat,
            lng: data[i]?.lon,
          };
          if (obj) this.addMarker(obj, data[i]?.type, [35, 35]);
        }
      });
  }

  savedLocationActive() {
    this.map?.eachLayer((layer: any) => {
      if (!layer._url) layer.remove();
    });
    this.changeCenter();
    this.listener(true);
  }
  change(type: string) {
    this.mapService.loadingProgress.next(true);
    this.selectedType = type === this.selectedType ? 'all' : type;
    this.map.eachLayer((layer: any) => {
      if (!layer._url) layer.remove();
    });
    this.listener(true);
  }

  //CLICK ON MAP
  clickOnMap() {
    this.map.on('click', (e: any) => {
      if (this.distanceActivated) this.distanceActive(e);
      else if (this.createTripActivate) this.startCreateTrip(e);
      else this.bind(e);
    });
  }

  bind(e: any) {
    // this.drawerService.open.next(true);
    this.zoomActivator.emit(true);
    this.locationSelected.lon = e.latlng.lng;
    this.locationSelected.lat = e.latlng.lat;
    this.drawerService.localInformation.next(this.locationSelected);
  }

  async changeCenter() {
    this.positionView = await this.map?.setView(this.center, 15);
  }

  listener(changedCity: boolean) {
    this.fetchByCity(this.city, changedCity);
  }

  private loadMap(): void {
    this.map = L.map('map', { zoomControl: false });

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(this.map);
  }
  fetchTrip() {
    this.store.select(selectTrip).subscribe((res) => {
      this.listOfTrip = res;
    });
  }

  dragMap() {
    this.map.on('mouseup', (e: any) => {
      this.drawerService
        .fetchLocationByLatlng(e.latlng.lat, e.latlng.lng)
        .subscribe((res) => {
          this.draggingLocation.country = res.country;
          this.draggingLocation.street =
            res.street && res.suburb ? ' - ' + res.street : res.street;
          this.draggingLocation.city =
            res.city && res.country ? ' - ' + res.city : res.city;
          this.draggingLocation.suburb = res.suburb;
          if (res.city !== this.city && res.city) {
            this.fetchByCity(res.city, true);
            this.city = res.city;
          }
        });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.draggingLocation.city = this.city;
    this.draggingLocation.country = this.country;
    this.draggingLocation = {
      country: this.country,
      city: this.city,
      street: '',
      suburb: '',
    };
    this.savedLocationActive();
    this.mapApiService.savedLocation.subscribe((res) => {
      this.changeCenter();
      if (this.showTour) this.showTours();
    });
    this.highlightLocation();
  }

  ngOnInit(): void {
    this.loadMap();

    this.mapService.loadingProgress.next(true);
    this.getRoute();
    this.getShowLocationState();
    this.fetchTrip();
    this.fetchByCity('New York', true);
    this.clickOnMap(); //CLICK ON MAP
    this.dragMap(); //CLICK ON MAP
    this.changeCenter();
  }
  imageexists(url: any) {
    const image = new Image();
    image.src = url;
    if (image.width == 0) {
      return false;
    } else {
      return true;
    }
  }
  addMarker(
    position: LatLngExpression,
    icona: string,
    sizes: any,
    num?: number
  ) {
    if (position) {
      let tooltipPopup: any;
      let icon: any;
      if (num) {
        icon = new L.Icon({
          iconUrl: `https://raw.githubusercontent.com/sheiun/leaflet-color-number-markers/main/dist/img/red/marker-icon-2x-red-${num}.png`,
          iconSize: [50, 88],
        });
      } else {
        if (this.imageexists(`assets/img/${icona}.png`))
          icon = new L.Icon({
            iconUrl: `assets/img/${icona}.png`,
            iconSize: sizes,
          });
        else
          icon = new L.Icon({
            iconUrl: `assets/img/location.png`,
            iconSize: sizes,
          });
      }
      if (this.map)
        L?.marker(position, { icon: icon })
          ?.addTo(this.map)
          .on('click', (e) => {
            if (this.distanceActivated) this.distanceActive(e);
            else if (this.createTripActivate) this.startCreateTrip(e);
            else this.bind(e);
          })
          .on('mouseover', (e) => {
            this.store
              .select(selectLocation)
              .pipe(
                map((res) => {
                  return res.filter(
                    (res: any) => res.lat == e.target.getLatLng().lat
                  );
                })
              )
              .subscribe((res) => {
                tooltipPopup = L.popup({
                  offset: L.point(0, -20),
                  closeButton: false,
                  className: 'leaflet-popup',
                });
                tooltipPopup.setContent(
                  `<span class='border-bottom m-1'><b>${this.capitalizeFirstLetter(
                    res[0]?.title
                  )} ${res[0]?.type}
              </span></b> <br><span class=text-medium m-2 p-2>
              ${this.capitalizeFirstLetter(res[0]?.district)} ${res[0]?.street}
              </span><br><b>
              ${res[0]?.phone}</b> `
                );
                tooltipPopup.setLatLng(e.target.getLatLng());
                tooltipPopup.openOn(this.map);
              });
          })
          .on('mouseout', (e) => {
            tooltipPopup.remove();
          });
      this.turnOffProgress(1);
    }
  }
  highlightLocation() {
    this.store
      .select(selectLocation)
      .pipe(
        map((res) =>
          res.filter((res: any) => Number(res.lat) === Number(this.center[0]))
        )
      )
      .subscribe((res) => {
        if (res[0]?.title) {
          L.popup({
            autoClose: false,
            className: 'selected-popup',
            closeButton: false,
          })
            .setLatLng(this.center)
            .setContent(
              `<span class='border-bottom m-1'><b>${this.capitalizeFirstLetter(
                res[0]?.title
              )} ${res[0]?.type}
            </span></b> <br><span class=text-medium m-2 p-2>
            ${this.capitalizeFirstLetter(res[0]?.district)} ${res[0]?.street}
            </span><br><b>
            ${res[0]?.phone}</b> `
            )
            .openOn(this.map);
        }
      });
  }

  showTours() {
    this.joyrideService.startTour({
      steps: ['firstStep', 'secondStep'],
      themeColor: 'green',
      showCounter: false,
      customTexts: {
        prev: 'prev',
        next: 'next',
      },
    });
  }
  searchBox() {
    (L.Control as any)
      .geocoder({
        defaultMarkGeocode: false,
        placeholder: 'Search heres...',
      })
      .on('finishgeocode', (e: any) => {
        const result: any = [];
        let t: {
          country: '';
          city: '';
          geo: [1, 2];
        };
        const array = e.results;
        for (let i = 0; i < array.length; i++) {
          let country = array[i].name
            .split(',')
            [array[i].name.split(',').length - 1].replaceAll(' ', '-');
          country = country.slice(1, country.length);
          t = {
            country: country,
            city: array[i].name.split(',')[0].replaceAll(' ', '-'),
            geo: [array[i].center.lat, array[i].center.lng],
          };
          result.push(t);
        }
        this.store.dispatch(actions.autocompleteAction({ result: result }));
      })

      .addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.searchBox();
    this.mapApiService.tripLocations.subscribe((res) => {
      if (res) {
        this.map.eachLayer((layer: any) => {
          if (!layer._url) layer.remove();
        });
        this.fetchLocations(res);
      }
    });
  }

  selectedLocation(event: any) {
    this.openModalLocationListFlag = false;
    this.center = [Number(event.lat), Number(event.lon)];
    this.changeCenter();
    this.highlightLocation();
  }
  openModalLocationList(toggle: boolean) {
    this.drawerService.showLocations.next(toggle);
  }
}
