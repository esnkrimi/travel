import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DrawerService } from '@appBase/drawer.service';

@Component({
  selector: 'pe-map-component',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnChanges {
  constructor(
    private drawerService: DrawerService,
    private route: ActivatedRoute
  ) {}
  center = [41.02446333535115, 28.953609466552734];
  country = 'turkey';
  @Input() scope: any;
  @Input() showTour: any;
  @Input() savedLocation: any;
  showMap = true;
  ngOnChanges(): void {
    if (this.scope) {
      this.center = [this.scope.center[0], this.scope.center[1]];
      this.country = this.scope.country;
    }
  }
}
