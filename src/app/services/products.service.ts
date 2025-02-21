import { appSettings } from './../settings/app.settings';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${appSettings.apiUrl}/products`;

  getProducts(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrl, { headers });
  }

  addProduct(product: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    return this.http.post(this.apiUrl, product, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  updateProduct(id: string, product: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    return this.http.patch(`${this.apiUrl}/${id}`, product, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
