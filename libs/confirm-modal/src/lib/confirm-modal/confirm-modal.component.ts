import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'pe-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalomponent {
  @Input() message: any;
  @Output() resultEvent = new EventEmitter<boolean>();

  resultEmitting(value: boolean) {
    this.resultEvent.emit(value);
  }
}
