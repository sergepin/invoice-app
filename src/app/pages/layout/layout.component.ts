import { Component, inject } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet, CommonModule],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>
      <div class="content">
        <header class="header">
          <span *ngIf="user">Bienvenido, {{ user.name }}</span>
          <button (click)="logout()" class="logout-btn">Cerrar sesión</button>
        </header>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `
      .layout {
        display: grid;
        grid-template-columns: 250px 1fr; /* 250px fijo para el menú, el resto para el contenido */
        height: 100vh;
      }

      .content {
        padding: 20px;
        overflow-y: auto; /* Permite scroll si el contenido es muy grande */
        display: flex;
        flex-direction: column;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #1976d2;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        margin-bottom: 15px;
      }

      .logout-btn {
        background: #d32f2f;
        color: white;
        border: none;
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 4px;
        transition: 0.3s;
      }

      .logout-btn:hover {
        background: #b71c1c;
      }
    `,
  ],
})
export class LayoutComponent {
  private authService = inject(AuthService);
  user = this.authService.getUser();

  logout() {
    this.authService.logout();
  }
}
