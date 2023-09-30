import {
  IAllTrips,
  ILocationInTrip,
  ITrip,
  ITripUsers,
  Ilocation,
  IloginInfo,
  Iuser,
  IuserOfSite,
} from '@appBase/model';
import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { State } from './state';
export const actions = createActionGroup({
  source: 'store',
  events: {
    'fill user trips': props<{ data: ITripUsers[] }>(),
    'confirm requests': props<{ data: any }>(),
    'get start confirm requests': props<{
      uid: any;
      ownerId: any;
      tripTitle: any;
      action: any;
    }>(),
    'fetch trip requests': props<{ data: any }>(),
    'get start fetch trip requests': props<{ uid: any }>(),
    'ask to join': props<{ data: any }>(),
    'get start ask to join': props<{ data: any }>(),
    'fetch all trips': props<{ trips: IAllTrips[] }>(),
    'start fetch all trips': emptyProps(),
    'fetch users of site': props<{ userOfSite: IuserOfSite[] }>(),
    'start fetch users of sites': emptyProps(),
    'add user to trip': emptyProps(),
    'add user to trip preparing': props<{
      guestId: string;
      tripTitle: string;
      ownerId: string;
    }>(),
    'start fetch country location action': props<{ country: string }>(),
    'fetch action': props<{ location: Ilocation[] }>(),
    'start login action': props<{ user: IloginInfo }>(),
    'start signup action': props<{ user: IloginInfo }>(),
    'signup action': props<{ user: IloginInfo }>(),
    'login action': props<{ user: Iuser }>(),
    'start autocomplete action': props<{ text: string }>(),
    'autocomplete action': props<{ result: any }>(),
    'start setview action': props<{ location: any }>(),
    'setview action': props<{ setview: any }>(),
    'start save action': props<{ updateSaved: any }>(),
    'save action': props<{ updateSaved: any }>(),
    'start rate action': props<{ updateSaved: any }>(),
    'rate action': props<{ updateSaved: any }>(),
    'start submit location': props<{ form: object; uid: number }>(),
    'submit location': props<{ form: object }>(),
    'start share experience': props<{
      uid: number;
      id: number;
      describtion: any;
      formData: any;
    }>(),
    'share experience': emptyProps(),
    'start add trip point': props<{ trip: any; title: string }>(),
    'add trip point': emptyProps(),
    'start fetch trip': emptyProps(),
    'fetch trip': props<{ trip: any; reviewtrip: any }>(),
    'add trip': props<{ trip: any }>(),
    'start fetch review trip': emptyProps(),
    'fetch review trip': props<{ trip: any }>(),
    'start review update': props<{
      trip: any;
      location: any;
      field: any;
      vals: any;
    }>(),
    'review update': emptyProps(),
    'start trip factors update': props<{
      trip: any;
      location: any;
      field: any;
      vals: any;
    }>(),
    'trip factors update': emptyProps(),
  },
});
