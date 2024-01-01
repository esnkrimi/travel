import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperiencesComponent } from './component/experiences.component';
import { LoadingProgressModule } from '@pe/loading-progress';
import { ImageGalleryModule } from '@pe/image-gallery';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    LoadingProgressModule,
    MatButtonModule,
    ImageGalleryModule,
  ],
  declarations: [ExperiencesComponent],
  exports: [ExperiencesComponent],
})
export class ExperiencesModule {}
