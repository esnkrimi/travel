import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DrawerService } from '@appBase/drawer.service';

@Component({
  selector: 'pe-navbar-menu',
  templateUrl: './navbar-menu.component.html',
  styleUrls: ['./navbar-menu.component.scss'],
})
export class NavbarMenuComponent {
  constructor(private router: Router, private drawerService: DrawerService) {}
  showLocationsOnMapComponent() {
    this.drawerService.showLocations.next({
      show: true,
      type: '',
    });
    this.showMap(true);
    this.router.navigateByUrl('');
  }
  showMap(toggle: boolean) {
    this.drawerService.showMap.next(toggle);
  }
}
