import { Component, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements  AfterViewChecked {
  title = 'intac-crud';
  loggedIn: Observable<boolean>;

  constructor(private authService: AuthService, private cdf: ChangeDetectorRef) { }

  ngAfterViewChecked() {
    this.loggedIn = this.authService.isLoggedIn;
    this.cdf.detectChanges();
  }

  logout() {
    this.authService.logout();
  }
}
