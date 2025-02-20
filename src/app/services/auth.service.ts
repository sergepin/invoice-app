import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../interfaces/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private user: User | null = null;

  constructor() {
    this.loadUserFromStorage(); // Carga el usuario al iniciar la app
  }

  private loadUserFromStorage() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }

  setUser(user: User) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    return this.user;
  }

  isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  logout() {
    this.user = null;
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }
}
