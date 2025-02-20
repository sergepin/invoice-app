import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav class="sidebar">
      <ul>
        <li><a routerLink="/home" routerLinkActive="active">Inicio</a></li>
        <li><a routerLink="/products" routerLinkActive="active">Ver productos</a></li>
        <li *ngIf="user?.role === 'admin'">
          <a routerLink="/users" routerLinkActive="active">Ver usuarios</a>
        </li>
      </ul>
      <button (click)="logout()" class="logout-btn">Cerrar sesión</button>
    </nav>
  `,
  styles: [
    `
      .sidebar {
        background: #2c3e50;
        color: white;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100vh; /* Ajusta la altura al 100% de la pantalla */
      }

      ul {
        list-style: none;
        padding: 0;
      }

      li {
        margin: 15px 0;
      }

      a {
        color: white;
        text-decoration: none;
        padding: 10px;
        display: block;
        border-radius: 4px;
      }

      a:hover,
      .active {
        background: #34495e;
      }

      .logout-btn {
        background: #d32f2f;
        color: white;
        border: none;
        padding: 10px;
        cursor: pointer;
        border-radius: 4px;
        transition: 0.3s;
        width: 100%;
      }

      .logout-btn:hover {
        background: #b71c1c;
      }
    `,
  ],
})
export class SidebarComponent {
  private authService = inject(AuthService);
  user = this.authService.getUser();

  logout() {
    this.authService.logout();
  }
}
