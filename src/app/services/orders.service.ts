  import { Injectable, inject } from '@angular/core';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { appSettings } from './../settings/app.settings';

  interface OrderResponse {
    orders: Array<{
      orderId: string;
      userId: string;
      totalAmount: number;
      date: string;
      user: {
        id: string;
        name: string;
      };
      products: Array<{
        productId: string;
        name: string;
        unitPrice: number;
        quantity: number;
      }>;
    }>;
  }

  @Injectable({
    providedIn: 'root',
  })
  export class OrdersService {
    private http = inject(HttpClient);
    private apiUrl = `${appSettings.apiUrl}/orders`;

    private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('access_token');
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getUserPurchases(userId: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/user-purchases`, {
        headers: this.getAuthHeaders(),
        params: { userId },
      });
    }

  getAllOrdersWithDetails(): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/all-orders-with-details`, {
      headers: this.getAuthHeaders(),
    });
    }
  }
