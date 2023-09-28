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
import { selectLocation, selectSetview } from '@appBase/+state/select';
import { AdvancedAutoCompleteService } from './service';

@Component({
  selector: 'pe-advanced-autocomplete',
  templateUrl: './auto-complete-advanced.component.html',
  styleUrls: ['./auto-complete-advanced.component.scss'],
})
export class AdvancedAutocompleteComponent implements OnInit, OnChanges {
  locationInput = new FormControl('', []);
  @Input() data: any;
  responseData: any = [];
  result: any = [];
  locationResult: any = [];
  loading = false;
  @Output() results = new EventEmitter<any>();
  constructor(private mapService: MapService, private store: Store) {}
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.listener();
  }

  search(itemToSearch: any) {
    let j = 0;
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].family.includes(itemToSearch)) {
        this.responseData[j] = this.data[i];
        j++;
      }
    }
    console.log(this.responseData);
    this.result.emit(this.responseData);
    console.log(this.responseData);
  }

  listener() {
    this.locationInput.valueChanges
      .pipe(
        tap((res: any) => {
          console.log(res);
          this.search(res);
        })
        // debounceTime(1000)
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
