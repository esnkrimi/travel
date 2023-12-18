import { Component, Input, OnInit } from '@angular/core';
import { DrawerService } from '@appBase/drawer.service';

@Component({
  selector: 'pe-navbar-menu',
  templateUrl: './navbar-menu.component.html',
  styleUrls: ['./navbar-menu.component.scss'],
})
export class NavbarMenuComponent implements OnInit {
  text: any;
  arrayOfText = [];
  arrayToShow = [];
  i = 0;
  constructor(private drawerService: DrawerService) {}
  ngOnInit(): void {}
  showLocationsOnMapComponent() {
    this.drawerService.showLocations.next(true);
  }
}
