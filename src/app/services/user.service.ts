import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appSettings } from './../settings/app.settings';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${appSettings.apiUrl}/users`;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  updateUser(userId: string, payload: { name?: string; email?: string; password?: string; role?: 'user' | 'admin' }): Observable<any> {
    console.log('Updating user with ID:', userId);
    console.log('Payload:', payload);
    return this.http.patch(`${this.apiUrl}/${userId}`, payload, { headers: this.getAuthHeaders() });
  }

  deleteUser(userId: string): Observable<any> {
    console.log('Deleting user with ID:', userId);
    return this.http.delete(`${this.apiUrl}/${userId}`, { headers: this.getAuthHeaders() });
  }
}
