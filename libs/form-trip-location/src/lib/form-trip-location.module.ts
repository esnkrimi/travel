import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoadingProgressModule } from '@pe/loading-progress';
import { MatIconModule } from '@angular/material/icon';
import { FormTripLocationComponent } from './component/form-trip-location.component';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    LoadingProgressModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatRippleModule,
    MatChipsModule,
    MatFormFieldModule,
    MatListModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatDialogModule,
    MatButtonModule,
  ],
  declarations: [FormTripLocationComponent],
  exports: [FormTripLocationComponent],
})
export class FormTripLocationModule {}
