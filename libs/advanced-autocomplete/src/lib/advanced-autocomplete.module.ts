import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvancedAutocompleteComponent } from './auto-complete-advanced/auto-complete-advanced.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoadingProgressModule } from '@pe/loading-progress';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    TranslateModule,
    LoadingProgressModule,
  ],
  declarations: [AdvancedAutocompleteComponent],
  exports: [AdvancedAutocompleteComponent],
})
export class AdvancedAutocompleteModule {}
