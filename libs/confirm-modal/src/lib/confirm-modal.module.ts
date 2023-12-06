import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalomponent } from './confirm-modal/confirm-modal.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [CommonModule, MatButtonModule],
  exports: [ConfirmModalomponent],
  declarations: [ConfirmModalomponent],
})
export class ConfirmModalModule {}
