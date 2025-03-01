import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { login } from '../../interfaces/login';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private loginService = inject(LoginService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private formBuild = inject(FormBuilder);
  private toastr = inject(ToastrService);

  public loginForm: FormGroup = this.formBuild.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  isProcessing = false;

  login() {
    if (this.loginForm.invalid) return;

    this.isProcessing = true;

    const object: login = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.loginService.login(object).subscribe({
      next: (data) => {
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
          this.authService.setUser(data.user, data.access_token);

          this.toastr.success('Login successful! Redirecting...', 'Success');

          setTimeout(() => {
            this.router.navigate(['home']);
          }, 3000);
        } else {
          this.toastr.error('Login failed. Try again.', 'Error');
          this.isProcessing = false;
        }
      },
      error: (error) => {
        console.error(error.message);
        this.toastr.error('An error occurred. Try again.', 'Error');
        this.isProcessing = false;
      },
    });
  }

  register() {
    this.router.navigate(['register']);
  }
}
