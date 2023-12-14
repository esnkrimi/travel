import { Inject, Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class CanActivateGuard implements CanActivate {
  constructor(
    private _router: Router,
    @Inject('userSession') public userSession: any
  ) {}

  canActivate(): boolean {
    if (!JSON.parse(this.userSession)?.id) {
      this._router.navigate([{ outlets: { secondRouter: 'lazy/login' } }]);

      return false;
    }
    return true;
  }
}
