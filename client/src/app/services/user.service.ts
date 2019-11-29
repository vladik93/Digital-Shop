import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  serverUrl = 'http://localhost:3000/shopping/api/user';
  isLoggedIn = false;
  isAdmin = false;

  constructor(private http: HttpClient) { }

  register(user): Observable<User> {
    return this.http.post<User>(`${this.serverUrl}/register`, user, {
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  login(user): Observable<User> {
    return this.http.post<User>(`${this.serverUrl}/login`, user, {
      headers: new HttpHeaders().append('content-type', 'application/json'),
      withCredentials: true
    });
  }

  getUserData(): Observable<User> {
    return this.http.get<User>(`${this.serverUrl}/private/userdata`, {
      headers: new HttpHeaders().append('content-type', 'application/json'),
      withCredentials: true
    });
  }

  logout() {
    return this.http.get(`${this.serverUrl}/logout`, {
      headers: new HttpHeaders().append('content-type', 'application/json'),
      withCredentials: true,
    });
  }
}
