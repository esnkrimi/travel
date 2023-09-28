import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompletePoublicComponent } from './autocomplete--public/autocomplete-public.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadingProgressModule } from '@pe/loading-progress';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [AutocompletePoublicComponent],
  exports: [AutocompletePoublicComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    LoadingProgressModule,
    MatButtonModule,
    MatInputModule,
  ],
})
export class PublicAutocompleteModule {}
