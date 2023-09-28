import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripsComponent } from './component/trips.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  declarations: [TripsComponent],
  exports: [TripsComponent],
})
export class TripsModule {}
