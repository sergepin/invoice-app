import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav
      id="sidebar"
      class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-gray-50 dark:bg-gray-800"
      aria-label="Sidebar"
    >
      <div class="flex flex-col h-full px-4 py-6">
        <a routerLink="/home" class="flex justify-center items-center mb-6">
          <img src="assets/phoenix-seeklogo.png" alt="Phoenix Logo" class="h-16 w-auto" />
        </a>

        <div class="text-gray-700 dark:text-gray-300 mb-4">
          <p>Welcome, {{ user?.name || 'User' }}</p>
          <small>{{ user?.role | titlecase }}</small>
        </div>

        <ul class="space-y-2 font-medium flex-1 overflow-y-auto">
          <li *ngFor="let link of links">
            <a
              [routerLink]="link.path"
              routerLinkActive="bg-blue-600 text-white"
              class="flex items-center p-3 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              *ngIf="!link.role || link.role === user?.role"
            >
              <span>{{ link.label }}</span>
            </a>
          </li>
        </ul>

        <button
          (click)="logout()"
          class="mt-4 w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Log Out
        </button>
      </div>
    </nav>
  `,
  styles: [],
})
export class SidebarComponent {
  private authService = inject(AuthService);
  user = this.authService.getUser();
  activePath = window.location.pathname;

  links = [
    { path: '/home', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/users', label: 'User Purchases', role: 'admin' },
    { path: '/user-management', label: 'User Management', role: 'admin' },
    { path: '/profile', label: 'Profile' },
    { path: '/my-orders', label: 'My Orders', role: 'user' },
  ];

  logout() {
    this.authService.logout();
  }
}
