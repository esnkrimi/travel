import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpComponent } from './component/help.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, MatButtonModule, TranslateModule],
  declarations: [HelpComponent],
  exports: [HelpComponent],
})
export class HelpModule {}
