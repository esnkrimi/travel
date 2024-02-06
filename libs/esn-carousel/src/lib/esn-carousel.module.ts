import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EsnCarouselComponent } from './components/esn-carousel.component';

@NgModule({
  declarations: [EsnCarouselComponent],
  exports: [EsnCarouselComponent],
  imports: [CommonModule],
})
export class EsnCarouselModule {}
