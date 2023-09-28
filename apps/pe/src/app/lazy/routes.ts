import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ZoomComponent } from './zoom/zoom.component';
import { EntryComponent } from './entry/entry.component';
import { TripComponent } from './trip/trip.component';
import { ReviewTripComponent } from './review-trip/review-trip.component';
import { MytripsComponent } from './mytrips/mytrips.component';
import { TripListComponent } from './trip-list/trip-list.component';
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
    path: 'mytrips',
    component: MytripsComponent,
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
})
export class lazyRouterModule {}
