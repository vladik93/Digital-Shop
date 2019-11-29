import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { CanComponentDeactivate } from '../services/can-deactivate-guard.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private _userService: UserService, private _router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this._userService.getUserData().pipe(map(e => {
      if (e.admin === false || e.admin === undefined) {
        return true;
      } else if (e.admin === true || !this._userService.logout()) {
        this._router.navigate(['/admin']);
      }
    }));
  }

  canDeactivate(component: CanComponentDeactivate) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
