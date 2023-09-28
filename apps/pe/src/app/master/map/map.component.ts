import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'pe-map-component',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnChanges {
  center = [41.02446333535115, 28.953609466552734];
  country = 'turkey';
  @Input() scope: any;
  @Input() showTour: any;
  @Input() savedLocation: any;

  ngOnChanges(): void {
    if (this.scope) {
      this.center = [this.scope.center[0], this.scope.center[1]];
      this.country = this.scope.country;
    }
  }
}
