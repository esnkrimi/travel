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
  selectILocationTypes,
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
  @Output() results = new EventEmitter<any>();
  data: any;
  autocompleteDataFiltered: any;
  locationInput = new FormControl('', []);
  loading = false;
  constructor(private mapService: MapService, private store: Store) {}

  ngOnInit(): void {
    this.selectLocationTypes();
    this.inputListener();
  }
  inputListener() {
    this.locationInput.valueChanges.subscribe((res) => {
      this.autocompleteDataFiltered = this.data.filter((result: any) =>
        result.type.includes(res)
      );
    });
  }
  selectLocationTypes() {
    this.store.select(selectILocationTypes).subscribe((res) => {
      this.data = res;
    });
  }
  lower(str: any) {
    if (str[0] === ' ') str = str.slice(1, str.length);
    return str.replaceAll(' ', '-').replaceAll('%20', '-').toLowerCase();
  }
  setLocationType(type: any) {
    this.locationInput.setValue(type);
    this.autocompleteDataFiltered = [];
    this.results.emit(type);
  }
}
