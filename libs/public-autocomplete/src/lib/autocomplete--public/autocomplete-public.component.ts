import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';
import { MapService } from '@appBase/master/map/service';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import { selectLocation, selectSetview } from '@appBase/+state/select';

@Component({
  selector: 'pe-autocomplete-public',
  templateUrl: './autocomplete-public.component.html',
  styleUrls: ['./autocomplete-public.component.scss'],
})
export class AutocompletePoublicComponent implements OnInit {
  inputUser = new FormControl('', []);
  @Input() data: any;
  loading = false;
  result: any = [];
  @Output() resultSelected = new EventEmitter<any>();
  constructor() {}
  ngOnInit(): void {
    this.inputUser.valueChanges.subscribe((result) => {
      const tmp = this.data.filter((res: any) => res.email.includes(result));
      this.result = tmp;
    });
  }
  resultSelect(e: any) {
    this.resultSelected.emit(e);
  }
}
