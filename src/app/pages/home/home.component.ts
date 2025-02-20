import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/login';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private authService = inject(AuthService);
  user: User | null = null;

  constructor() {
    this.user = this.authService.getUser();
  }
}
