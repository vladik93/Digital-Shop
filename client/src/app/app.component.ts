import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user = sessionStorage.getItem('username');
  isAdmin = false;

  constructor(private _userService: UserService, private _http: HttpClient,
    private cookieService: CookieService, private _router: Router) {}

  ngOnInit() {
    setInterval(() => {
      this.user = sessionStorage.getItem('username');
    }, 50);
  }


  checkLoggedIn() {
    this._userService.getUserData()
    .subscribe(
      res => sessionStorage.getItem('username'),
      err => sessionStorage.removeItem('username')
    );
  }

  logout() {
    this._userService.logout()
    .subscribe(
      data => {
        console.log(data); this._router.navigate(['/main']);
        this.cookieService.delete('mysession.sid', '/');
        sessionStorage.removeItem('username');
        this._userService.isLoggedIn = false;
      },
      err => console.log(err)
    );
  }
}
