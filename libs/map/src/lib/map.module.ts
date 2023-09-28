import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapBoardComponent } from './component/map.component';
import { LoadingProgressModule } from '@pe/loading-progress';
import { MatRippleModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { JoyrideModule } from 'ngx-joyride';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DistancePipe } from './component/pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FormTripLocationModule } from '@pe/form-trip-location';
import { TripsModule } from '@pe/trips';
import { TripSubmitModule } from '@pe/trip-submit';
import { HelpModule } from '@pe/help';

@NgModule({
  declarations: [MapBoardComponent, DistancePipe],
  imports: [
    CommonModule,
    MatSnackBarModule,
    LoadingProgressModule,
    MatButtonModule,
    FormsModule,
    HelpModule,
    MatRippleModule,
    MatFormFieldModule,
    TripsModule,
    TripSubmitModule,
    MatInputModule,
    ReactiveFormsModule,
    JoyrideModule.forRoot(),
    MatDialogModule,
    DragDropModule,
    FormTripLocationModule,
    MatButtonModule,
  ],
  exports: [MapBoardComponent],
})
export class MapModule {}