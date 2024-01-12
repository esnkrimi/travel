import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';
import { MapService } from '@appBase/master/map/service';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import {
  selectAutoCompleteFind,
  selectCity,
  selectLocation,
  selectSetview,
} from '@appBase/+state/select';

@Component({
  selector: 'pe-dynamic-autocomplete',
  templateUrl: './dynamic-autocomplete.component.html',
  styleUrls: ['./dynamic-autocomplete.component.scss'],
})
export class DynamicAutocompleteComponent implements OnInit {
  result: any = [];
  loading = false;
  divId: any;
  @Output() results = new EventEmitter<any>();
  locationInput = new FormControl('', []);

  constructor(private mapService: MapService, private store: Store) {}
  ngOnInit(): void {
    this.listener();
    this.selectFoundItems();
    this.divId = new Date().getTime() + 1;
  }
  comebackResult(result: any) {
    this.results.emit(result);
  }
  listener() {
    this.locationInput.valueChanges
      .pipe(
        tap((res: any) => {
          if (res.length === 0) this.loading = false;
          else this.loading = true;
        }),
        debounceTime(1000),
        tap((res: any) => {
          if (res.length > 3) this.search(res);
        })
      )
      .subscribe();
  }
  selectFoundItems() {
    this.store.select(selectCity).subscribe((res) => {
      this.result = res.slice(0, 5);
      this.loading = false;
    });
  }
  toLower(str: string) {
    return str.toLocaleLowerCase();
  }
  search(searchItem: string) {
    this.store.dispatch(actions.startFetchCities({ searchItem: searchItem }));
  }

  lower(str: any) {
    if (str[0] === ' ') str = str.slice(1, str.length);
    return str.replaceAll(' ', '-').replaceAll('%20', '-').toLowerCase();
  }
}
