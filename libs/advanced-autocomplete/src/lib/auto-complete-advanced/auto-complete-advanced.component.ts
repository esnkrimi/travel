import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';
import { MapService } from '@appBase/master/map/service';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import {
  selectAllTrips,
  selectLocation,
  selectSetview,
} from '@appBase/+state/select';
import { AdvancedAutoCompleteService } from './service';

@Component({
  selector: 'pe-advanced-autocomplete',
  templateUrl: './auto-complete-advanced.component.html',
  styleUrls: ['./auto-complete-advanced.component.scss'],
})
export class AdvancedAutocompleteComponent implements OnInit {
  locationInput = new FormControl('', []);
  responseData: any = [];
  result: any = [];
  trips: any = [];
  locationResult: any = [];
  loading = false;
  @Output() results = new EventEmitter<any>();
  constructor(private mapService: MapService, private store: Store) {}

  ngOnInit(): void {
    this.listener();
  }

  select() {
    this.store.select(selectAllTrips).subscribe((res) => {
      this.trips = res;
    });
  }
  tripSearch(itemToSearch: any) {
    for (let i = 0; i < this.trips.length; i++)
      for (let j = 0; j < this.trips[i].tripjson.length; j++)
        if (this.trips[i].tripjson[j].title === itemToSearch) {
          return true;
        }
    return false;
  }

  search(itemToSearch: any) {
    let k = 0;
    for (let i = 0; i < this.trips.length; i++)
      for (let j = 0; j < this.trips[i].tripjson.length; j++) {
        if (this.trips[i].tripjson[j].title === itemToSearch) {
          this.responseData[k] = this.trips[i].tripjson[j];
          k++;
        }
      }
    this.results.emit(this.responseData);
  }

  listener() {
    this.select();
    this.locationInput.valueChanges
      .pipe(
        tap((res: any) => {
          this.mapService.loadingProgress.next(true);
          this.responseData = [];
          this.search(res);
        }),
        debounceTime(1000)
      )
      .subscribe();
  }

  lower(str: any) {
    if (str[0] === ' ') str = str.slice(1, str.length);
    return str.replaceAll(' ', '-').replaceAll('%20', '-').toLowerCase();
  }
  setView(i: number) {
    const t = this.result[i];
    this.result = [];
    this.locationInput.setValue('');
    this.mapService.loadingProgress.next(true);
    this.store.dispatch(
      actions.startSetviewAction({
        location: {
          city: t?.city,
          country: t?.country,
          geo: t?.geo,
        },
      })
    );
    this.store.select(selectSetview).subscribe((res: any) => {
      if (res.length > 0) this.results.emit(res[0]);
    });
  }
}
