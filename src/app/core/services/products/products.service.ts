import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../token/api-token';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly baseUrl = inject(API_BASE_URL);
  constructor(private httpClient:HttpClient) { }
  getAllProducts(page: number, limit: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/products`, {
      params: {
        page,
        limit
      }
    });
  }
  getProductById(id: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/products/${id}`);
  }
}
