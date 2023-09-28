import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryComponent } from './entry/entry.component';
import { ZoomComponent } from './zoom/zoom.component';
import { lazyRouterModule } from './routes';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExperiencesModule } from '@pe/experiences';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '@appBase/app.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { LoadingImageModule } from '@pe/loading-image';
import { TripComponent } from './trip/trip.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReviewTripComponent } from './review-trip/review-trip.component';
import { MatDialogModule } from '@angular/material/dialog';
import { VehicleCOmparePipe } from '@appBase/pipe/vehicle.pipe';
import { VehicleDirective } from '@appBase/directive/vehicle.directive';
import { AdvancedAutocompleteModule } from '@pe/advanced-autocomplete';
import { JoyrideModule } from 'ngx-joyride';
import { MatSelectModule } from '@angular/material/select';
import { TripUserComponent } from './trip-users/trip-user.component';
import { MytripsComponent } from './mytrips/mytrips.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TripListComponent } from './trip-list/trip-list.component';

@NgModule({
  declarations: [
    EntryComponent,
    ZoomComponent,
    TripUserComponent,
    TripComponent,
    TripListComponent,
    VehicleDirective,
    ReviewTripComponent,
    VehicleCOmparePipe,
    MytripsComponent,
  ],
  imports: [
    CommonModule,
    lazyRouterModule,
    AdvancedAutocompleteModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatExpansionModule,
    LoadingImageModule,
    MatButtonModule,
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
})
export class LazyModule {}