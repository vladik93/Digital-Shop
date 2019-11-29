import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  serverUrl = 'http://localhost:3000/shopping/api/cart';

  constructor(private http: HttpClient) { }

  getAllCartItems(): Observable<any[]> {
    return this.http.get<any[]>(this.serverUrl, {
      headers: new HttpHeaders().append('content-type', 'application/json'),
      withCredentials: true
    });
  }

  postNewCartItem(data): Observable<any> {
    return this.http.post<any>(this.serverUrl, data, {
      withCredentials: true,
      headers: new HttpHeaders()
      .append('Content-Type', 'application/json')
    });
  }

  createCart(): Observable<any> {
    return this.http.get(`${this.serverUrl}/new`, {
      withCredentials: true,
      headers: new HttpHeaders()
      .append('Content-Type', 'application/json')
    });
  }

  getCartData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverUrl}/valid`, {
      withCredentials: true,
      headers: new HttpHeaders()
      .append('Content-Type', 'application/json')
    });
  }

  deleteCart(): Observable<any> {
    return this.http.delete<any>(this.serverUrl, {
      withCredentials: true,
      headers: new HttpHeaders()
      .append('Content-Type', 'application/json')
    });
  }

  deleteAllItems(): Observable<any> {
    return this.http.delete<any>(`${this.serverUrl}/all`, {
      withCredentials: true,
      headers: new HttpHeaders()
      .append('Content-Type', 'application/json')
    });
  }

  deleteItemById(itemId): Observable<any> {
    return this.http.delete<any>(`${this.serverUrl}/${itemId}`, {
      withCredentials: true,
      headers: new HttpHeaders()
      .append('Content-Type', 'application/json')
    });
  }
}
