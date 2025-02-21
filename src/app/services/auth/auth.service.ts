import { jwtDecode } from 'jwt-decode';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../interfaces/login';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private user: User | null = null;

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');

    if (userData && token && !this.isTokenExpired(token)) {
      this.user = JSON.parse(userData);
    } else {
      this.logout();
    }
  }

  setUser(user: User, token: string) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', token);
  }

  getUser(): User | null {
    return this.user;
  }

  isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return token !== null && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  logout() {
    this.user = null;
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }
}
