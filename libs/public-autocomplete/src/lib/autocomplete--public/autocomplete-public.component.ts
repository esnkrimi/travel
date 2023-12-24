import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EventEmitter } from '@angular/core';

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
  ngOnInit(): void {
    this.inputUser.valueChanges.subscribe((result) => {
      const tmp = this.data.filter((res: any) => res.email.includes(result));
      this.result = tmp;
    });
  }
  resultSelect(e: any) {
    this.resultSelected.emit(e);
    const tmp = this.result.filter((res: any) => res.email !== e.email);
    this.result = tmp;
  }
}
