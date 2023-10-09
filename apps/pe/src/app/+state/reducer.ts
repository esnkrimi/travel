import { createFeature, createReducer, on } from '@ngrx/store';
import { actions } from './actions';
import { initialState } from './state';
import { AppState, state } from '../model';
import { act } from '@ngrx/effects';

export const reducerStates = createFeature({
  name: 'store',
  reducer: createReducer(
    AppState,
    on(actions.askToJoin, function (states: any, action: any) {
      return {
        ...states,
        tripUsers: states.tripUsers.map((res: any) => {
          if (res.tripTitle === action.data.data.tripTitle) {
            const tmp = {
              confirmed: '0',
              family: '',
              name: '',
              uid: action.data.data.uid,
            };
            return {
              ...res,
              users: [tmp],
            };
          } else {
            return {
              ...res,
              tripUsers: states.tripUsers,
            };
          }
        }),
      };
    }),
    on(actions.deleteLocationComments, function (states: any, action: any) {
      return {
        ...states,
        locationComments: action.data,
      };
    }),
    on(actions.fetchLocationComments, function (states: any, action: any) {
      return {
        ...states,
        locationComments: action.data,
      };
    }),
    on(actions.confirmInvite, function (states: any, action: any) {
      return {
        ...states,
        tripRequests: action.data,
      };
    }),

    on(actions.fillUserTrips, function (states: any, action: any) {
      return {
        ...states,
        tripUsers: action.data,
      };
    }),
    on(actions.confirmRequests, function (states: any, action: any) {
      return {
        ...states,
        tripRequests: action.data,
      };
    }),

    on(actions.fetchTripRequests, function (states: any, action: any) {
      return {
        ...states,
        tripRequests: action.data,
      };
    }),
    on(actions.fetchAllTrips, function (states: any, action: any) {
      return {
        ...states,
        allTrips: action.trips,
      };
    }),
    on(actions.fetchUsersOfSite, (states: any, action: any) => ({
      ...states,
      usersOfSite: action.userOfSite,
    })),
    on(actions.startFetchTrip, (states: any, action: any) => ({
      ...states,
    })),
    on(actions.fetchTrip, (states: any, action: any) => ({
      ...states,
      trip: action.trip,
      reviewtrip: action.reviewtrip,
    })),
    on(actions.addTripPoint, (states: any, action: any) => ({
      ...states,
    })),
    on(actions.startFetchCountryLocationAction, (states: any, action: any) => ({
      ...states,
      country: action.country,
    })),
    on(actions.fetchAction, (states: any, action: any) => ({
      ...states,
      location: Object.values(action.location),
    })),
    on(actions.startFetchCountryLocationAction, (states: any, action: any) => ({
      ...states,
      country: action.country,
    })),
    on(actions.startLoginAction, (states: any, action: any) => ({
      ...states,
      loginInfo: action.loginInfo,
    })),
    on(actions.loginAction, (states: any, action: any) => ({
      ...states,
      user: action.user,
    })),
    on(actions.startAutocompleteAction, (states: any, action: any) => ({
      ...states,
    })),
    on(actions.autocompleteAction, (states: any, action: any) => ({
      ...states,
      location: Object.values(action.result),
    })),
    on(actions.startSetviewAction, (states: any, action: any) => ({
      ...states,
    })),
    on(actions.setviewAction, (states: any, action: any) => ({
      ...states,
      setview: Object.values(action.setview),
    })),
    on(actions.saveAction, (states: any, action: any) => ({
      ...states,
    })),
    on(actions.startSaveAction, function (states: any, action: any) {
      return {
        ...states,
        location: states.location.map((res: any) => {
          if (res.id === action.updateSaved[0])
            return {
              ...res,
              saved: !res.saved,
            };
          else
            return {
              ...res,
            };
        }),
      };
    }),
    on(actions.startRateAction, (states: any, action: any) => ({
      ...states,
    })),

    on(actions.rateAction, function (states: any, action: any) {
      return {
        ...states,
        location: states.location.map((res: any) => {
          if (res.id === action.updateSaved[1]) {
            return {
              ...res,
              score: action.updateSaved[2],
            };
          } else
            return {
              ...res,
            };
        }),
      };
    }),
    on(actions.startAddTripPoint, function (states: any, action: any) {
      return {
        ...states,
        trip: [...states.trip, action.trip],
        title: action.title,
      };
    }),
    on(actions.addTrip, function (states: any, action: any) {
      return {
        ...states,
      };
    }),
    on(actions.startReviewUpdate, function (states: any, action: any) {
      return {
        ...states,
        reviewtrip: states.reviewtrip.map((res: any) => {
          if (res.title === action.trip) {
            return {
              ...res,
              trip: res.trip.map((res: any) => {
                if (res.locationTitle === action.location) {
                  return {
                    ...res,
                    [action.field]: action.vals,
                  };
                } else return { ...res };
              }),
            };
          } else
            return {
              ...res,
            };
        }),
      };
    }),
    on(actions.startTripFactorsUpdate, function (states: any, action: any) {
      return {
        ...states,
        trip: states.trip.map((res: any) => {
          if (res.title === action.trip) {
            return {
              ...res,
              trip: res.trip.map((res: any) => {
                if (res.locationTitle === action.location) {
                  return {
                    ...res,
                    [action.field]: action.vals,
                  };
                } else return { ...res };
              }),
            };
          } else
            return {
              ...res,
            };
        }),
      };
    })
  ),
});
