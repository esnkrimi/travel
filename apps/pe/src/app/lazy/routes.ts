import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ZoomComponent } from './zoom/zoom.component';
import { EntryComponent } from './entry/entry.component';
import { TripComponent } from './trip/trip.component';
import { ReviewTripComponent } from './review-trip/review-trip.component';
import { MytripsComponent } from './mytrips/mytrips.component';
import { TripListComponent } from './trip-list/trip-list.component';
import { MessagesComponent } from './messages/messages.component';
import { MyrequestsComponent } from './my-requests/myrequests.component';
import { UsersComponent } from './users/users.component';
import { SettingComponent } from './setting/setting.component';
import { CanActivateGuard } from './guard';
import { LocationListComponent } from './location-list/location-list.component';
import { AppComponent } from '@appBase/app.component';
import { MapComponent } from '@appBase/master/map/map.component';
const routes: Routes = [
  {
    path: 'zoom',
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
    path: 'mytrips',
    component: MytripsComponent,
    canActivate: [CanActivateGuard],
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
    path: 'myrequests',
    component: MyrequestsComponent,
    canActivate: [CanActivateGuard],
  },
  {
    path: 'messages',
    component: MessagesComponent,
    canActivate: [CanActivateGuard],
  },
  {
    path: 'setting',
    component: SettingComponent,
    canActivate: [CanActivateGuard],
  },
  {
    path: 'trips',
    component: TripListComponent,
  },
  {
    path: 'signup',
    component: EntryComponent,
  },
  {
    path: 'trip/:trip',
    component: TripComponent,
  },
  {
    path: 'review/:trip',
    component: ReviewTripComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanActivateGuard],
})
export class lazyRouterModule {}
