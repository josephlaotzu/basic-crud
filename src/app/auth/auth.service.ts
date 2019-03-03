import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn = new BehaviorSubject<boolean>(false)
  isAdmin = new BehaviorSubject<boolean>(false)
  constructor(private http: HttpClient, private router: Router) { }

  get isUserAdmin() {
    return this.isAdmin.asObservable();
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get currentUser() {
    return JSON.parse(localStorage.getItem('currentUser'))
  }

  login(username: string, password: string) {
    return this.http.post<any>(`http://localhost:4000/users/authenticate`, { username, password })
      .pipe(map(user => {
        // login successful if there's a user in the response
        if (user) {
          // store user details and basic auth credentials in local storage 
          // to keep user logged in between page refreshes
          if (user.role === 'admin') {
            this.isAdmin.next(true);
          } else {
            this.isAdmin.next(false);
          }
          user.authdata = window.btoa(username + ':' + password);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.loggedIn.next(true);
        }

        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.loggedIn.next(false);
    this.router.navigateByUrl('/')
  }
}
