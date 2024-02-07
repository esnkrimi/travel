import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { actions } from '@appBase/+state/actions';
import { selectILocationTypes, selectLocation } from '@appBase/+state/select';
import { LocationGeoService } from '@appBase/drawer.service';
import { Store } from '@ngrx/store';
import { MapService } from '../map/service';

@Component({
  selector: 'pe-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss'],
})
export class PlacesComponent implements OnInit {
  @Output() viewOnMap = new EventEmitter<any>();
  locationType: any = [];
  location: any = [];
  showContent = false;
  data = [
    {
      id: 591,
      country: 'encre noire',
      city: 'LALIQUE',
      street: '',
    },
  ];
  info = {
    imagePrefix: 'https://burjcrown.com/drm/travel/users/',
    imagePostfix: '/master/1.jpg',
    destinationUrlPrefix: 'https://www.burjcrown.com/zoom/',
    bgColor: 'white',
    textColor: 'black',
    borderColor: '#ccffdd',
    imgWidth: '13em',
    imgHeight: '7em',
    numberOfPage: 3,
    arrowColor: '#ffffff',
    Speed: 3,
    //Speed ,for mobile view select 3 or lower for pc view select 8 or more height: '24em',
    autoPlay: false,
  };
  constructor(
    private store: Store,
    private drawerService: LocationGeoService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.fetchLocationTypes();
    this.fetchLocations();
    this.makeDistance();
  }

  orderByType(type: string) {
    const result = this.location.filter((res: any) => res.type === type);
    return result.slice(0, 5);
  }

  fetchLocationTypes() {
    this.store.select(selectILocationTypes).subscribe((res: any) => {
      this.locationType = res;
    });
  }
  fetchLocations() {
    this.store.select(selectLocation).subscribe((res: any) => {
      this.location = res;
    });
  }
  viewOnMaps(event: any) {
    this.showContent = false;
    this.viewOnMap.emit(event);
  }
  makeDistance() {
    this.mapService.myLocation.subscribe((res) => {
      const d = {
        lat: 4275902,
        lng: -73.97208306,
      };
      this.store.dispatch(
        actions.startUpdateDistance({
          data: this.location,
          myLocation: d,
        })
      );
    });
  }

  showMoreLocationType(type: string) {
    this.showContent = false;

    this.drawerService.showLocations.next({
      show: true,
      type: '',
      typeOfLocation: type,
      city: this.location[0].city,
    });
  }
}
