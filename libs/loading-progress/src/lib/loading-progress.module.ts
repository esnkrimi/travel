import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingProgressComponent } from './loading-progress/loadingprogress.component';

@NgModule({
  declarations: [LoadingProgressComponent],
  imports: [CommonModule],
  exports: [LoadingProgressComponent],
})
export class LoadingProgressModule {}
