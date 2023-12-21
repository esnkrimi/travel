import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DrawerService } from '@appBase/drawer.service';

@Component({
  selector: 'pe-navbar-menu',
  templateUrl: './navbar-menu.component.html',
  styleUrls: ['./navbar-menu.component.scss'],
})
export class NavbarMenuComponent implements OnDestroy {
  boardShow = '';
  contactForm = new FormGroup({
    email: new FormControl(''),
    comment: new FormControl(''),
  });
  constructor(private router: Router, private drawerService: DrawerService) {}
  ngOnDestroy(): void {
    this.boardShow = '';
  }
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
  board(type: string) {
    this.boardShow = type;
  }
  submit() {}
}
