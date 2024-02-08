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
import { ImageGalleryModule } from '@pe/image-gallery';
import { ConfirmModalModule } from '@pe/confirm-modal';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { DymaicAutocompleteModule } from '@pe/dymaic-autocomplete';
import { DynamicAutocompleteDestinationsModule } from '@pe/dynamic-autocomplete-destinations';
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
import { CityDistanceComponent } from './city-distance/city-distance.component';
import { EsnCarouselModule } from '@pe/esn-carousel';
import { DistanceOredrPipe } from '@appBase/pipe/distance-order';

@NgModule({
  declarations: [
    ScorePipe,
    CityDistanceComponent,
    ScoreDirective,
    EntryComponent,
    LocationListComponent,
    ZoomComponent,
    SettingComponent,
    UsersComponent,
    DistanceOredrPipe,
  ],
  imports: [
    ImageGalleryModule,
    CommonModule,
    GoogleSigninButtonModule,
    lazyRouterModule,
    DynamicAutocompleteDestinationsModule,
    DymaicAutocompleteModule,
    MatChipsModule,
    AdvancedAutocompleteModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    PublicAutocompleteModule,
    ConfirmModalModule,
    ReactiveFormsModule,
    EsnCarouselModule,
    FormsModule,
    MatExpansionModule,
    NgxPaginationModule,
    MatButtonModule,
    LoadingProgressModule,
    MatInputModule,
    MatSelectModule,
    JoyrideModule.forRoot(),
    MatSnackBarModule,
    MatIconModule,
    ExperiencesModule,
    TranslateModule,
  ],
  exports: [LocationListComponent, CityDistanceComponent],
})
export class LazyModule {}
