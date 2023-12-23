import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZoomComponent } from './zoom/zoom.component';
import { EntryComponent } from './entry/entry.component';
import { UsersComponent } from './users/users.component';
import { SettingComponent } from './setting/setting.component';
import { CanActivateGuard } from './guard';
import { MapComponent } from '@appBase/master/map/map.component';
const routes: Routes = [
  {
    path: 'zoom',
    component: ZoomComponent,
  },
  {
    path: 'zoom/:stsruct',
    component: ZoomComponent,
  },
  {
    path: '',
    component: ZoomComponent,
  },
  {
    path: 'login',
    component: EntryComponent,
  },
  {
    path: 'locations/:id',
    component: MapComponent,
  },
  {
    path: ':lat/:lon',
    component: MapComponent,
  },
  {
    path: 'users/:user',
    component: UsersComponent,
  },
  {
    path: 'setting',
    component: SettingComponent,
    canActivate: [CanActivateGuard],
  },

  {
    path: 'signup',
    component: EntryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanActivateGuard],
})
export class lazyRouterModule {}
