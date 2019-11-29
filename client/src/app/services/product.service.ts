import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  serverUrl = 'http://localhost:3000/shopping/api/product';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.serverUrl, {
      headers: new HttpHeaders().append('content-type', 'application/json')
    });
  }

  getProductById(id): Observable<Product> {
    return this.http.get<Product>(`${this.serverUrl}/${id}`, {
      headers: new HttpHeaders().append('content-type', 'application/json')
    });
  }

  postProduct(data): Observable<Product> {
    return this.http.post<Product>(this.serverUrl, data, {
      headers: new HttpHeaders().append('content-type', 'application/json')
    });
  }

  getProductsByName(string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.serverUrl}/name/${string}`, {
      headers: new HttpHeaders().append('content-type', 'application/json')
    });
  }

  getProductCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverUrl}/category`, {
      headers: new HttpHeaders().append('content-type', 'application/json')
    });
  }

  postCategory(data): Observable<any> {
    return this.http.post<any>(`${this.serverUrl}/category`, data, {
      headers: new HttpHeaders().append('content-type', 'application/json')
    });
  }

  getProductsByCategory(id): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.serverUrl}/category/${id}`, {
      headers: new HttpHeaders().append('content-type', 'application/json')
    });
  }

  getProductCount(): Observable<any> {
    return this.http.get<any>(`${this.serverUrl}/count`, {
      headers: new HttpHeaders().append('content-type', 'application/json')
    });
  }

  updateProductById(id, data): Observable<any> {
    return this.http.put<any>(`${this.serverUrl}/${id}`, data, {
      headers: new HttpHeaders().append('content-type', 'application/json')
    });
  }
}
