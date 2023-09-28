import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripSubmitComponent } from './component/trip-submit.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [CommonModule, MatButtonModule],
  declarations: [TripSubmitComponent],
  exports: [TripSubmitComponent],
})
export class TripSubmitModule {}
