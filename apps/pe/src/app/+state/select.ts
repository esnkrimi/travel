import { createFeatureSelector } from '@ngrx/store';
import { createSelector } from '@ngrx/store';
import { reducerStates } from './reducer';
import { State } from './state';

export const {
  selectLocation,
  selectUser,
  selectSetview,
  selectTrip,
  selectReviewtrip,
  selectUsersOfSite,
  selectAllTrips,
} = reducerStates;
