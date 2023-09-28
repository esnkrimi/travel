import { Component, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { FetchLocationService } from './service';
import { EventEmitter } from '@angular/core';
import { MapService } from '@appBase/master/map/service';
import { merge, of, zip } from 'rxjs';
import { Store } from '@ngrx/store';

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
  @Output() results = new EventEmitter<any>();
  constructor(
    private service: FetchLocationService,
    private mapService: MapService,
    private store: Store
  ) {}

  listener() {
    let v: any;
    this.locationInput.valueChanges
      .pipe(
        tap((res: any) => {
          this.loading = res.length > 3 ? true : (this.loading = false);
          this.result = [];
        }),
        debounceTime(1000),
        switchMap((str: any) =>
          str.length > 3
            ? zip(
                this.service.get(str.charAt(0).toUpperCase() + str.slice(1)),
                this.service.getExactLocation(
                  str.charAt(0).toUpperCase() + str.slice(1)
                )
              )
            : of([])
        )
      )
      .subscribe((res: any) => {
        res.forEach((element: any) => {
          element.then((r: any) => {
            this.result.push(r);
            this.loading = false;
          });
        });
      });
  }
  ngOnInit(): void {
    this.listener();
  }
  lower(str: any) {
    return str.replaceAll(' ', '-').replaceAll('%20', '-').toLowerCase();
  }
  setView(i: number) {
    this.mapService.loadingProgress.next(true);
    this.service
      .getGeographic(this.result[0][i]?.city, this.result[0][i]?.country)
      .subscribe((res) => {
        this.results.emit(res[0]);
      });

    this.result = [];
  }

  setExactView(location: any) {
    this.mapService.loadingProgress.next(true);
    const tmp = [
      {
        country_name: location.country,
        longitude: location.geo[1],
        latitude: location.geo[0],
      },
    ];
    this.results.emit(tmp[0]);
    this.result = [];
  }
}
