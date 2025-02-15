import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../token/api-token';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly baseUrl = inject(API_BASE_URL);
  constructor(private httpClient:HttpClient) { }
  getAllWishlistProducts(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/wishlist`);
  }
  addProductToWishlist(id: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/v1/wishlist`, {
      productId: id
    })
  }
  removeProductFromWishlist(id: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/api/v1/wishlist/${id}`)
  }
}
