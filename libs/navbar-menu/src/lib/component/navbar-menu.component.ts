import { Component, Input, OnInit } from '@angular/core';

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
  constructor() {}
  ngOnInit(): void {}
}
