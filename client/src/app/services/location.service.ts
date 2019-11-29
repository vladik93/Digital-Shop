import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  serverUrl = 'http://localhost:3000/shopping/api/location';

  constructor(private http: HttpClient) { }

  getCities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverUrl}/city`, {
      headers: new HttpHeaders()
      .append('Content-Type', 'application/json')
    });
  }

  getStreetsByCity(cityName): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverUrl}/street/${cityName}`, {
      headers: new HttpHeaders()
      .append('Content-Type', 'application/json')
    });
  }
}
