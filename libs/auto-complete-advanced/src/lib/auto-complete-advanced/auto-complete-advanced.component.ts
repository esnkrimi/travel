import { Component, Input, OnInit, Output } from '@angular/core';
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
export class AdvancedAutocompleteComponent implements OnInit {
  @Input() data: any;

  @Output() results = new EventEmitter<any>();
  constructor(
    private mapService: AdvancedAutoCompleteService,
    private store: Store
  ) {}
  ngOnInit(): void {}
}
