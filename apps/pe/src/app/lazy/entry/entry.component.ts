import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EntryService } from './entry.service';
import { LocationGeoService } from '@appBase/drawer.service';
import { LocalService } from '@appBase/storage';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import { IloginInfo } from '@appBase/+state/state';
import { selectUser } from '@appBase/+state/select';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { MapService } from '@appBase/master/map/service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { LoginSetting } from '@appBase/setting';

@Component({
  selector: 'pe-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {
  loginSetting: LoginSetting = {
    routeType: 'login',
    buttonDisabled: false,
    loginError: false,
    loginSuccess: false,
    errorPasswordEqual: false,
  };
  formLogin = new FormGroup({
    email: new FormControl<any>('', [Validators.email, Validators.required]),
    password: new FormControl<any>('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });
  formSubmit = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    password2: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  constructor(
    private route: ActivatedRoute,
    private mapService: MapService,
    private service: EntryService,
    private drawerService: LocationGeoService,
    private localStorage: LocalService,
    private store: Store,
    private socialAuthService: SocialAuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.hideMap();
    this.loginSetting.routeType = this.route.snapshot.url[0].path;
    this.selectGoogleAuth();
    this.selectUserLogined();
  }

  logOut(): void {
    this.socialAuthService.signOut();
  }
  selectGoogleAuth() {
    this.socialAuthService.authState.subscribe((user) => {
      const loginInfo: IloginInfo = {
        email: user.email,
        password: 'AcxfnhjDfg6y',
      };
      this.store.dispatch(actions.startLoginAction({ user: loginInfo }));
    });
  }
  onSubmitLogin() {
    this.mapService.loadingProgress.next(true);
    const loginInfo: IloginInfo = { ...this.formLogin.value };
    this.loginSetting.buttonDisabled = true;
    this.store.dispatch(actions.startLoginAction({ user: loginInfo }));
  }
  selectUserLogined() {
    this.store.select(selectUser).subscribe((res: any) => {
      if (res?.length > 0) {
        this.loginSetting.loginSuccess = true;
        this.localStorage.saveData('user', JSON.stringify(res[0]));
        setTimeout(() => {
          this.service.userLoginInformation.next(res);
          this.mapService.loadingProgress.next(false);
          location.reload();
        }, 2000);
      } else {
        setTimeout(() => {
          this.mapService.loadingProgress.next(false);
        }, 2000);
        if (this.formLogin.get('email')?.value)
          this.loginSetting.loginError = true;
        this.loginSetting.buttonDisabled = false;
        //   this.mapService.loadingProgress.next(false);
      }
    });
  }
  closeSnackBar() {
    this._snackBar.dismiss();
  }

  openSnackBar() {
    this._snackBar.openFromComponent(AnnotationComponent, {
      duration: 5 * 1000,
    });
  }

  onSubmitSignup() {
    this.loginSetting.errorPasswordEqual = false;
    this.mapService.loadingProgress.next(true);
    const passEqual =
      this.formSubmit.get('password')?.value ===
      this.formSubmit.get('password2')?.value
        ? true
        : false;
    if (passEqual) {
      const signupInfo: IloginInfo = { ...this.formSubmit.value };
      this.store.dispatch(actions.startSignupAction({ user: signupInfo }));
      this.store.dispatch(actions.startLoginAction({ user: signupInfo }));
      setTimeout(() => {
        this.selectUserLogined();
        location.reload();
      }, 1000);
    }
  }
  hideMap() {
    this.drawerService.showMap.next(false);
    9;
  }
}

@Component({
  template: `username or password is incorrect`,
})
export class AnnotationComponent {
  snackBarRef = inject(MatSnackBarRef);
}
