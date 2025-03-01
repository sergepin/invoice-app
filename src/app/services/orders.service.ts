import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appSettings } from './../settings/app.settings';

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
}
