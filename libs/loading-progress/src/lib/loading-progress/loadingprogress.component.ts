import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pe-loading-progress',
  templateUrl: './loadingprogress.component.html',
  styleUrls: ['./loadingprogress.component.scss'],
})
export class LoadingProgressComponent {
  @Input() mode: any;
}
