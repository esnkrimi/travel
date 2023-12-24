import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';
import { actions } from './actions';
import { MapApiService } from 'libs/map/src/lib/component/map.service';
import { EntryService } from '@appBase/lazy/entry/entry.service';
import { FetchLocationService } from 'libs/auto-complete/src/lib/autocomplete/service';
import { zip } from 'rxjs';
import { ZoomApiService } from '@appBase/lazy/zoom/api.service';
import { selectReviewtrip, selectTrip } from './select';
import { LocalService } from '@appBase/storage';
import { ExperiencesApiService } from 'libs/experiences/src/lib/component/experiences.service';
import { UsersService } from '@appBase/lazy/users/users.service';
import { ProfileSettingService } from '@appBase/lazy/setting/setting.service';
import { AdvancedAutoCompleteService } from 'libs/advanced-autocomplete/src/lib/auto-complete-advanced/service';
import { TripUserService } from '@appBase/lazy/users/trip-user.service';
import { ILocationTypes, ILocationtype } from '@appBase/model';

@Injectable()
export class storeEffects {
  constructor(
    private store: Store,
    private tripUserService: TripUserService,
    private experiencesApiService: ExperiencesApiService,
    private actions$: Actions,
    private ser: MapApiService,
    private localStorage: LocalService,
    private service: EntryService,
    private advancedAutoCompleteService: AdvancedAutoCompleteService,
    private locationService: FetchLocationService,
    private usersService: UsersService,
    private profileSettingService: ProfileSettingService,
    private zoomService: ZoomApiService
  ) {}

  startFetchLocationTypes: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.startFetchLocationType),
      switchMap((res: any) => {
        return this.advancedAutoCompleteService
          .fetchLocationTypes()
          .pipe(map((res: any) => actions.fetchLocationType({ data: res })));
      })
    );
  });
  startUpdateSettingAboutMe: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.getStartUpdateSettingAboutMe),
      switchMap((res: any) => {
        return this.profileSettingService
          .updateSettingAboutMe(res.uid, res.about)
          .pipe(map((res: any) => actions.updateSettingAboutMe({ data: res })));
      })
    );
  });

  getStartProfilePictureUploading: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.startProfilePictureUploading),
      switchMap((result: any) => {
        return this.profileSettingService
          .profilePictureUploading(result.uid, result.formData)
          .pipe(map((res: any) => actions.profilePictureUploading()));
      })
    );
  });

  startUpdateSetting: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.getStartUpdateSetting),
      switchMap((res: any) => {
        return this.profileSettingService
          .updateSetting(res.data)
          .pipe(map((res: any) => actions.updateSetting({ data: res })));
      })
    );
  });

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
          .getGeographic(str.city, str.country, str.geo, str.sym)
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

  getStartFtechUsersOfSite: any = createEffect(() => {
    let t: any;
    return this.actions$.pipe(
      ofType(actions.startFetchUsersOfSites),
      switchMap(() => {
        return this.tripUserService
          .getUserList()
          .pipe(
            map((res: any) => actions.fetchUsersOfSite({ userOfSite: res }))
          );
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
            res;
          }),
          map((res: any) => actions.signupAction({ user: res }))
        );
      })
    );
  });
}
