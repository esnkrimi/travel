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
  selectMyTripRequests,
  selectTripUsers,
  selectLocationComments,
  selectAutoCompleteFind,
  selectUserRates,
  selectTripComments,
} = reducerStates;
