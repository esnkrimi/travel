import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';
import { actions } from './actions';
import { Router } from '@angular/router';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { MapApiService } from 'libs/map/src/lib/component/map.service';
import { EntryService } from '@appBase/lazy/entry/entry.service';
import { FetchLocationService } from 'libs/auto-complete/src/lib/autocomplete/service';
import { merge, pipe, zip } from 'rxjs';
import { ZoomApiService } from '@appBase/lazy/zoom/api.service';
import { RootService } from '@appBase/service';
import { selectReviewtrip, selectTrip } from './select';
import { LocalService } from '@appBase/storage';
import { MytripsService } from '@appBase/lazy/mytrips/mytrips.service';
import { TripUserService } from '@appBase/lazy/trip-users/trip-user.service';
import { TripListsService } from '@appBase/lazy/trip-list/trip-list.service';
import { MessagesApiService } from '@appBase/lazy/messages/messages.service';
import { ExperiencesApiService } from 'libs/experiences/src/lib/component/experiences.service';
import { MyTripsRequestsService } from '@appBase/lazy/my-requests/myrequests.service';
import { UsersService } from '@appBase/lazy/users/users.service';

@Injectable()
export class storeEffects {
  startWriteUserRates: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.getStartWriteUserRates),
      switchMap((res: any) => {
        return this.usersService
          .writeUserRater(res.data)
          .pipe(map((res: any) => actions.writeUserRates({ data: res })));
      })
    );
  });

  startFetchUserRates: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.getStartFetchUserRates),
      switchMap((res: any) => {
        return this.usersService
          .userRater()
          .pipe(map((res: any) => actions.fetchUserRates({ data: res })));
      })
    );
  });

  startRemoveUserFromTrip: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.getStartRemoveUserFromTrip),
      switchMap((res: any) => {
        return this.tripService
          .removeUserFromTrip(res.userId, res.tripTitle, res.ownerId)
          .pipe(map((res: any) => actions.removeUserFromTrip()));
      })
    );
  });

  startFetchUserOfTrip: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.startFetchUsersOfTrip),
      switchMap((res: any) => {
        //console.log(99);
        return this.tripListsService
          .userOfTrip()
          .pipe(
            map((res: any) => actions.fetchUsersOfTrip({ userOfTrip: res }))
          );
      })
    );
  });
  startDeleteLocationComment: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.getStartDeleteLocationComments),
      switchMap((res: any) => {
        return this.experiencesApiService
          .deleteLocationComment(res.userId, res.locationId)
          .pipe(
            map((res: any) => actions.deleteLocationComments({ data: res }))
          );
      })
    );
  });

  startFetchLocationComment: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.getStartFetchLocationComments),
      switchMap((res: any) => {
        return this.experiencesApiService
          .fetch(res.locationId)
          .pipe(
            map((res: any) => actions.fetchLocationComments({ data: res }))
          );
      })
    );
  });

  startConfirmTripInvite: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.getStartConfirmInvite),
      switchMap((res: any) => {
        return this.mytripsService
          .tripReuestConfirmation(
            res.ownerId,
            res.tripTitle,
            res.uid,
            res.action
          )
          .pipe(map((res: any) => actions.confirmInvite({ data: res })));
      })
    );
  });

  startConfirmTripRequests: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.getStartConfirmRequests),
      switchMap((res: any) => {
        return this.messagesApiService
          .tripReuestConfirmation(
            res.ownerId,
            res.tripTitle,
            res.uid,
            res.action
          )
          .pipe(map((res: any) => actions.confirmRequests({ data: res })));
      })
    );
  });

  startMyTripRequests: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.getStartFetchMyTripRequests),
      switchMap((res: any) => {
        return this.myTripsRequestsService
          .myTripsRequests(res.uid)
          .pipe(map((res: any) => actions.fetchMyTripRequests({ data: res })));
      })
    );
  });

  startTripRequests: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.getStartFetchTripRequests),
      switchMap((res: any) => {
        return this.messagesApiService
          .fetch(res.uid)
          .pipe(map((res: any) => actions.fetchTripRequests({ data: res })));
      })
    );
  });

  askToJoin: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.getStartAskToJoin),
      switchMap((res: any) => {
        return this.tripListsService
          .askToJoin(res.data.uid, res.data.tripTitle, res.data.owenerid)
          .pipe(map((res1: any) => actions.askToJoin({ data: res })));
      })
    );
  });

  getStartFtechAllTrips: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.startFetchAllTrips),
      switchMap(() => {
        return this.tripListsService
          .fetchTrips()
          .pipe(
            map(function (res: any) {
              for (let i = 0; i < res.length; i++) {
                res[i].tripjson = JSON.parse(
                  res[i].tripjson.slice(1, res[i].tripjson.length - 1)
                );
              }
              return res;
            })
          )
          .pipe(map((res: any) => actions.fetchAllTrips({ trips: res })));
      })
    );
  });
  getStartFtechUsersOfSite: any = createEffect(() => {
    let t: any;
    return this.actions$.pipe(
      ofType(actions.startFetchUsersOfSites),
      switchMap(() => {
        return this.tripService
          .getUserList()
          .pipe(
            map((res: any) => actions.fetchUsersOfSite({ userOfSite: res }))
          );
      })
    );
  });

  getStartAddUserToTrip: any = createEffect(() => {
    let t: any;
    return this.actions$.pipe(
      ofType(actions.addUserToTripPreparing),
      switchMap((res: any) => {
        //console.log(res);
        return this.tripService
          .addUserToTrip(res.guestId, res.tripTitle, res.ownerId)
          .pipe(map((res: any) => actions.addUserToTrip()));
      })
    );
  });

  getStartTripFactorsUpdate: any = createEffect(() => {
    let t: any;
    return this.actions$.pipe(
      ofType(actions.startTripFactorsUpdate),
      switchMap(() => {
        this.store.select(selectTrip).subscribe((res) => {
          t = JSON.stringify(res);
        });
        return this.ser
          .updateTripFactors(t)
          .pipe(map((res: any) => actions.tripFactorsUpdate()));
      })
    );
  });

  getStartReview: any = createEffect(() => {
    let t: any;
    return this.actions$.pipe(
      ofType(actions.startReviewUpdate),
      switchMap(() => {
        this.store.select(selectReviewtrip).subscribe((res) => {
          t = JSON.stringify(res);
        });
        return this.ser
          .updateReviewTrip(t)
          .pipe(map((res: any) => actions.reviewUpdate()));
      })
    );
  });

  getStartAddTripPoint: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.addTrip),
      switchMap((result: any) => {
        console.log(result);
        return this.ser
          .updateTrip(result.title, JSON.stringify(result.trip))
          .pipe(map((res: any) => actions.addTripPoint()));
      })
    );
  });

  getStartFetchTrip: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.startFetchTrip),
      switchMap((result: any) => {
        return this.ser.fetchTrip().pipe(
          map((res: any) =>
            actions.fetchTrip({
              trip: JSON.parse(
                res[0].tripjson.slice(1, res[0].tripjson.length - 1)
              ),
              reviewtrip: JSON.parse(
                res[0].reviewtrip.slice(1, res[0].reviewtrip.length - 1)
              ),
            })
          )
        );
      })
    );
  });
  getStartShareExperience: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.startShareExperience),
      switchMap((result: any) => {
        return this.zoomService
          .describtion(
            result.uid,
            result.id,
            result.describtion,
            result.formData
          )
          .pipe(map((res: any) => actions.shareExperience()));
      })
    );
  });

  getStartLocationSubmit: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.startSubmitLocation),
      switchMap((result: any) => {
        return this.zoomService
          .submitLocation(result.uid, result.form)
          .pipe(map((res: any) => actions.submitLocation({ form: result })));
      })
    );
  });

  getStartRating: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.startRateAction),
      switchMap((result: any) => {
        result = result.updateSaved;
        return this.zoomService
          .rate(result[0], result[1], result[2])
          .pipe(map((res: any) => actions.rateAction({ updateSaved: result })));
      })
    );
  });

  getStartSaving: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.startSaveAction),
      switchMap((result: any) => {
        result = result.updateSaved;
        return this.zoomService
          .saved(result[0], result[1])
          .pipe(map((res: any) => actions.saveAction({ updateSaved: result })));
      })
    );
  });

  getStartSetview: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.startSetviewAction),
      switchMap((str: any) => {
        str = str.location;
        return this.locationService
          .getGeographic(str.city, str.country, str.geo)
          .pipe(map((res: any) => actions.setviewAction({ setview: res })));
      })
    );
  });

  getStartAutocomplete: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.startAutocompleteAction),
      switchMap((str: any) => {
        str = str.text;
        return zip(
          this.locationService
            .get(str.charAt(0).toUpperCase() + str.slice(1))
            .pipe(
              map((res: any) => actions.autocompleteAction({ result: res }))
            ),
          this.locationService
            .getExactLocation(str.charAt(0).toUpperCase() + str.slice(1))
            .pipe(
              map((res: any) => actions.autocompleteAction({ result: res }))
            )
        ).pipe(
          map((x) => {
            x[0].result = x[0].result.concat(x[1].result);
            return x[0];
          })
        );
      })
    );
  });

  getLocations: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.startFetchCountryLocationAction),
      switchMap((location: any) => {
        return this.ser
          .fetchAllByCountry(location.city)
          .pipe(map((res: any) => actions.fetchAction({ location: res })));
      })
    );
  });

  login: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.startLoginAction),
      switchMap((loginInfo: any) => {
        return this.service
          .login(loginInfo.user)
          .pipe(map((res: any) => actions.loginAction({ user: res })));
      })
    );
  });

  signup: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.startSignupAction),
      switchMap((signupInfo: any) => {
        return this.service.signup(signupInfo.user).pipe(
          tap((res: any) => {
            this.localStorage.saveData('user', JSON.stringify(res[0]));
            //console.log(res);
          }),
          map((res: any) => actions.signupAction({ user: res }))
        );
      })
    );
  });

  userLoginInformation: any;
  constructor(
    private store: Store,
    private experiencesApiService: ExperiencesApiService,
    private actions$: Actions,
    private tripService: TripUserService,
    private ser: MapApiService,
    private localStorage: LocalService,
    private tripListsService: TripListsService,
    private messagesApiService: MessagesApiService,
    private service: EntryService,
    private locationService: FetchLocationService,
    private usersService: UsersService,
    private zoomService: ZoomApiService,
    private mytripsService: MytripsService,
    private myTripsRequestsService: MyTripsRequestsService
  ) {}
}
