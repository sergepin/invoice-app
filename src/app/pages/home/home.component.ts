import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/login';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private authService = inject(AuthService);
  user: User | null = null;

  constructor() {
    this.user = this.authService.getUser();
  }
}
