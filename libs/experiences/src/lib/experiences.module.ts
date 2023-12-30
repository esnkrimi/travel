import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperiencesComponent } from './component/experiences.component';
import { LoadingProgressModule } from '@pe/loading-progress';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [CommonModule, LoadingProgressModule, MatButtonModule],
  declarations: [ExperiencesComponent],
  exports: [ExperiencesComponent],
})
export class ExperiencesModule {}
