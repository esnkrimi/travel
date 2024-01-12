import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoadingProgressModule } from '@pe/loading-progress';
import { DynamicAutocompleteComponent } from './dynamic-autocomplete/dynamic-autocomplete.component';

@NgModule({
  declarations: [DynamicAutocompleteComponent],
  exports: [DynamicAutocompleteComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    LoadingProgressModule,
  ],
})
export class DymaicAutocompleteModule {}
