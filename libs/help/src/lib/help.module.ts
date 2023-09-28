import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpComponent } from './component/help.component';

@NgModule({
  imports: [CommonModule],
  declarations: [HelpComponent],
  exports: [HelpComponent],
})
export class HelpModule {}
