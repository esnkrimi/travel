import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarMenuComponent } from './component/navbar-menu.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [NavbarMenuComponent],
  exports: [NavbarMenuComponent],
})
export class NavbarMenuModule {}
