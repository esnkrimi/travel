import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EntryService } from './entry.service';
import { DrawerService } from '@appBase/drawer.service';
import { delay } from 'rxjs';
import { LocalService } from '@appBase/storage';
import { Store } from '@ngrx/store';
import { actions } from '@appBase/+state/actions';
import { IloginInfo } from '@appBase/model';
import { selectUser } from '@appBase/+state/select';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { MapService } from '@appBase/master/map/service';

@Component({
  selector: 'pe-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {
  routeType = 'login';
  buttonDisabled = false;
  loginError = false;
  loginSuccess = false;
  errorPasswordEqual = false;
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
    private router: Router,
    private route: ActivatedRoute,
    private mapService: MapService,
    private service: EntryService,
    private drawerService: DrawerService,
    private localStorage: LocalService,
    private store: Store,
    private _snackBar: MatSnackBar
  ) {}

  onSubmitLogin() {
    this.mapService.loadingProgress.next(true);
    const loginInfo: IloginInfo = { ...this.formLogin.value };
    this.buttonDisabled = true;
    this.store.dispatch(actions.startLoginAction({ user: loginInfo }));
    this.selectUserLogined();
  }
  selectUserLogined() {
    this.store.select(selectUser).subscribe((res: any) => {
      if (res?.length > 0) {
        this.loginSuccess = true;
        this.localStorage.saveData('user', JSON.stringify(res[0]));
        setTimeout(() => {
          this.service.userLoginInformation.next(res);
          this.mapService.loadingProgress.next(false);
          this.drawerService.open.next(false);
          location.reload();
        }, 2000);
      } else {
        setTimeout(() => {
          this.mapService.loadingProgress.next(false);
        }, 2000);
        this.loginError = true;
        this.buttonDisabled = false;
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
    this.errorPasswordEqual = false;
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
      }, 1000);
    }
  }

  ngOnInit(): void {
    this.routeType = this.route.snapshot.url[0].path;
  }
}

@Component({
  template: `username or password is incorrect`,
})
export class AnnotationComponent {
  snackBarRef = inject(MatSnackBarRef);
}
