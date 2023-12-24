import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryComponent } from './entry/entry.component';
import { UsersComponent } from './users/users.component';
import { ZoomComponent } from './zoom/zoom.component';
import { lazyRouterModule } from './routes';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExperiencesModule } from '@pe/experiences';
import { ConfirmModalModule } from '@pe/confirm-modal';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '@appBase/app.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { LoadingImageModule } from '@pe/loading-image';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { AdvancedAutocompleteModule } from '@pe/advanced-autocomplete';
import { JoyrideModule } from 'ngx-joyride';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SettingComponent } from './setting/setting.component';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { LocationListComponent } from './location-list/location-list.component';
import { MatChipsModule } from '@angular/material/chips';
import { LoadingProgressModule } from '@pe/loading-progress';
import { ScoreDirective } from '@appBase/directive/score.directive';
import { PublicAutocompleteModule } from '@pe/public-autocomplete';
import { ScorePipe } from '@appBase/pipe/score.pipe';
@NgModule({
  declarations: [
    ScorePipe,
    ScoreDirective,
    EntryComponent,
    LocationListComponent,
    ZoomComponent,
    SettingComponent,
    UsersComponent,
  ],
  imports: [
    CommonModule,
    GoogleSigninButtonModule,
    lazyRouterModule,
    MatChipsModule,
    AdvancedAutocompleteModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    PublicAutocompleteModule,
    ConfirmModalModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
    NgxPaginationModule,
    LoadingImageModule,
    MatButtonModule,
    LoadingProgressModule,
    MatInputModule,
    MatSelectModule,
    JoyrideModule.forRoot(),
    MatSnackBarModule,
    MatIconModule,
    ExperiencesModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [LocationListComponent],
})
export class LazyModule {}
