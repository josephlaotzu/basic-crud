import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
// basic authentication guard
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot, ) {
    if (this.authService.currentUser) {
      // logged in so return true

      if (this.authService.currentUser.role === 'admin') {
        this.authService.isAdmin.next(true);
      } else {
        this.authService.isAdmin.next(false);
      }

      // role guards on parent route
      if (next.children.length == 0) {
        if (next.data.role && next.data.role !== this.authService.currentUser.role) {
          this.navigateOut('/login');
        }
      } else {
        next.children.forEach(child => {
          if (child.data.role && child.data.role !== this.authService.currentUser.role) {
            this.navigateOut('/login');
          }
        })
      }

      this.authService.loggedIn.next(true);
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.navigateOut(state);
  }

  navigateOut(state) {
    this.authService.loggedIn.next(false);
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}


