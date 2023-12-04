import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';
import { MapService } from '@appBase/master/map/service';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import {
  selectAutoCompleteFind,
  selectLocation,
  selectSetview,
} from '@appBase/+state/select';

@Component({
  selector: 'pe-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit {
  locationInput = new FormControl('', []);
  result: any = [];
  locationResult: any = [];
  loading = false;
  @Input() setting: any;
  @Output() results = new EventEmitter<any>();

  constructor(private mapService: MapService, private store: Store) {}
  ngOnInit(): void {
    this.listener();
  }

  listener() {
    this.store.select(selectAutoCompleteFind).subscribe((res) => {
      this.result = res;
      console.log(res);
      this.loading = false;
    });

    this.locationInput.valueChanges
      .pipe(
        tap((res: any) => {
          this.loading = res.length > 3 ? true : (this.loading = false);
          this.result = [];
        }),
        debounceTime(1000),
        tap((res: any) => {
          if (res)
            this.store.dispatch(actions.startAutocompleteAction({ text: res }));
        })
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
