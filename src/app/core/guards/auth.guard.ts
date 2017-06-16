import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService} from '../services/auth.service'
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authservice: AuthService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authservice.isAuthenticated()){
      return true;
    } else {
      this.router.navigate(['signIn'], {});

    }
  }
  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authservice.user) {
      return true;
    } else {
      this.router.navigate([''], {

      });
      return false;
    }
  }

}
