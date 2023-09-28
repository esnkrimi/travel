import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperiencesComponent } from './component/experiences.component';
import { LoadingProgressModule } from '@pe/loading-progress';

@NgModule({
  imports: [CommonModule, LoadingProgressModule],
  declarations: [ExperiencesComponent],
  exports: [ExperiencesComponent],
})
export class ExperiencesModule {}
