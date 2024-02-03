import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoadingProgressModule } from '@pe/loading-progress';
import { DynamicAutocompleteDestinationsComponent } from './dynamic-autocomplete-destinations/dynamic-autocomplete-destination.component';

@NgModule({
  declarations: [DynamicAutocompleteDestinationsComponent],
  exports: [DynamicAutocompleteDestinationsComponent],
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
export class DynamicAutocompleteDestinationsModule {}
