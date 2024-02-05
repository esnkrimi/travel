import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { selectILocationTypes, selectLocation } from '@appBase/+state/select';
import { Store } from '@ngrx/store';

@Component({
  selector: 'pe-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss'],
})
export class PlacesComponent implements OnInit {
  locationType: any = [];
  location: any = [];
  @Output() viewOnMap = new EventEmitter<any>();

  showContent = false;
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.fetchLocations();
    this.fetchLocationTypes();
  }

  orderByType(type: string) {
    const result = this.location.filter((res: any) => res.type === type);
    return result;
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

  extractRate(rate: string) {
    const tmp = rate.split('-');
    return tmp;
  }
  changeCenter(lat: any, lon: any) {
    this.showContent = false;
    const tmp = [lat, lon];
    this.viewOnMap.emit(tmp);
  }
}
