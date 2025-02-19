import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_BASE_URL } from '../../../token/api-token';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartCount: WritableSignal<number> = signal(0);
  private readonly baseUrl = inject(API_BASE_URL);
  constructor(private httpClient:HttpClient) { }
  addProductToCart(id: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/v1/cart`, {
      productId: id
    })
  }
  getAllCartProducts(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/cart`);
  }
  updateCartProductQuantity(id: string, count: number): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/api/v1/cart/${id}`, {
      count: count
    })
  }
  removeProductFromCart(id: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/api/v1/cart/${id}`);
  }
  clearCart(): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/api/v1/cart`);
  }
  checkoutOnline(id: string, data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/v1/orders/checkout-session/${id}?url=http://localhost:4200`, {
      shippingAddress: data
    })
  }
  checkoutCash(id: string, data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/v1/orders/${id}`, {
      shippingAddress: data
    })
  }
}
