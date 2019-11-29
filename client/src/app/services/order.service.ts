import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  serverUrl = 'http://localhost:3000/shopping/api/order';

  constructor(private http: HttpClient) { }

  postNewOrder(data): Observable<any> {
    return this.http.post<any>(this.serverUrl, data, {
      withCredentials: true,
      headers: new HttpHeaders()
      .append('Content-Type', 'application/json')
    });
  }

  getOrderDetails(): Observable<any[]> {
    return this.http.get<any[]>(this.serverUrl, {
      withCredentials: true,
      headers: new HttpHeaders()
      .append('Content-Type', 'application/json')
    });
  }

  getOrderCount(): Observable<any> {
    return this.http.get(`${this.serverUrl}/count`, {
      headers: new HttpHeaders().append('content-type', 'application/json')
    });
  }

  checkOrderExist(): Observable<any> {
    return this.http.get(`${this.serverUrl}/exist`, {
      withCredentials: true,
      headers: new HttpHeaders()
      .append('Content-Type', 'application/json')
    });
  }

  getLastOrderByUser(): Observable<any> {
    return this.http.get(`${this.serverUrl}/last`, {
      withCredentials: true,
      headers: new HttpHeaders()
      .append('Content-Type', 'application/json')
    });
  }

  getShippingDateCount(date): Observable<any> {
    return this.http.get(`${this.serverUrl}/datecheck/${date}`, {
      headers: new HttpHeaders()
      .append('Content-Type', 'application/json')
    });
  }
}
