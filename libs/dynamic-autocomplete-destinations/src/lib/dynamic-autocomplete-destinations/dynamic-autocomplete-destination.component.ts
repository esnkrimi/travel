import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';
import { MapService } from '@appBase/master/map/service';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import { selectCity, selectDestinationCity } from '@appBase/+state/select';

@Component({
  selector: 'pe-dynamic-autocomplete-destinations',
  templateUrl: './dynamic-autocomplete-destination.component.html',
  styleUrls: ['./dynamic-autocomplete-destination.component.scss'],
})
export class DynamicAutocompleteDestinationsComponent implements OnInit {
  myresult: any = [];
  loading = false;
  @Input() divId: any;
  @Output() results = new EventEmitter<any>();
  locationInputDestination = new FormControl('', []);

  constructor(private mapService: MapService, private store: Store) {}
  ngOnInit(): void {
    this.listener();
    this.selectFoundItems();
  }
  comebackResult(result: any) {
    this.results.emit(result);
    this.myresult = [];
  }
  listener() {
    this.locationInputDestination.valueChanges
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
    this.store.select(selectDestinationCity).subscribe((res) => {
      console.log(res);
      this.myresult = res.slice(0, 5);
      this.loading = false;
    });
  }
  toLower(str: string) {
    return str.toLocaleLowerCase();
  }
  search(searchItem: string) {
    this.store.dispatch(
      actions.startFetchDestinationCities({ searchItem: searchItem })
    );
  }

  lower(str: any) {
    if (str[0] === ' ') str = str.slice(1, str.length);
    return str.replaceAll(' ', '-').replaceAll('%20', '-').toLowerCase();
  }
}
