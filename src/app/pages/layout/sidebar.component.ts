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
      id="default-sidebar"
      class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div class="flex flex-col h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 overflow-hidden">
        <ul class="space-y-2 font-medium">
          <li>
            <a
              routerLink="/home"
              routerLinkActive="active"
              class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span class="ms-3">Home</span>
            </a>
          </li>
          <li>
            <a
              routerLink="/products"
              routerLinkActive="active"
              class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span class="ms-3">Products</span>
            </a>
          </li>
          <li *ngIf="user?.role === 'admin'">
          <li>
            <a
              routerLink="/users"
              routerLinkActive="active"
              class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span class="ms-3">User Purchases</span>
            </a>
          </li>
          <li *ngIf="user?.role === 'admin'">
          <li>
            <a
              routerLink="/user-management"
              routerLinkActive="active"
              class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span class="ms-3">User Management</span>
            </a>
          </li>
        </ul>
        <button (click)="logout()" class=" w-full mt-auto focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Log Out</button>
      </div>
    </nav>
  `,
  styles: [],
})
export class SidebarComponent {
  private authService = inject(AuthService);
  user = this.authService.getUser();

  logout() {
    this.authService.logout();
  }
}
