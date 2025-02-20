import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appSettings } from '../settings/app.settings';
import { AuthResponse, login, User } from '../interfaces/login';
import { Observable } from 'rxjs';
import { user } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);
  private baseUrl: string = appSettings.apiUrl;

  constructor() {}

  login(object: login): Observable<AuthResponse> {
    return new Observable((observer) => {
      this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, object, {
        headers: { 'Content-Type': 'application/json' },
      }).subscribe({
        next: (data) => {
          if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user)); // Guarda el usuario
            observer.next(data);
            observer.complete();
          } else {
            observer.error('Error al iniciar sesión');
          }
        },
        error: (error) => observer.error(error),
      });
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  getUser(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  register(object: user): Observable<User>{
    return this.http.post<User>(`${this.baseUrl}/auth/register`, object)
  }
}
