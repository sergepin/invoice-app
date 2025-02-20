import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/products';

  getProducts(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrl, { headers });
  }

  addProduct(product: any): Observable<any> {
    const token = localStorage.getItem('access_token'); // ✅ Añadir token
    return this.http.post(`http://localhost:5000/products`, product, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  updateProduct(id: string, product: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    return this.http.patch(`http://localhost:5000/products/${id}`, product, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }


}
