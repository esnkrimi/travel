import { createFeatureSelector } from '@ngrx/store';
import { createSelector } from '@ngrx/store';
import { reducerStates } from './reducer';

export const {
  selectLocation,
  selectUser,
  selectSetview,
  selectTrip,
  selectReviewtrip,
  selectUsersOfSite,
  selectAllTrips,
  selectTripRequests,
  selectTripUsers,
  selectLocationComments,
  selectAutoCompleteFind,
} = reducerStates;
