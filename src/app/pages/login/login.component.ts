import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { login } from '../../interfaces/login';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private loginService = inject(LoginService);
  private authService = inject(AuthService); // 🔥 Inyectamos AuthService
  private router = inject(Router);
  private formBuild = inject(FormBuilder);

  public loginForm: FormGroup = this.formBuild.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  login() {
    if (this.loginForm.invalid) return;

    const object: login = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.loginService.login(object).subscribe({
      next: (data) => {
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
          this.authService.setUser(data.user); // 🔥 Guarda el usuario en el servicio
          this.router.navigate(['home']);
        } else {
          alert('Error');
        }
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }

  register() {
    this.router.navigate(['register']);
  }
}
