import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../token/api-token';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly baseUrl = inject(API_BASE_URL);
  constructor(private httpClient:HttpClient) { }
  getAllCategories(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/categories`)
  }
  getCategoryById(id: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/categories/${id}`)
  }
}
