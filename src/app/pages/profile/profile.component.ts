import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isUpdating = false;

  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  userId: string = '';

  ngOnInit(): void {
    this.getUserIdFromStorage();
    this.loadUserData();
  }

  private getUserIdFromStorage(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const { _id } = JSON.parse(userData);
        this.userId = _id;
      } catch (error) {
        this.toastr.error('Invalid user data format', 'Error');
      }
    } else {
      this.toastr.error('User not found in localStorage', 'Error');
    }
  }

  loadUserData(): void {
    if (!this.userId) return;

    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.profileForm = this.fb.group({
          name: [user.name, [Validators.required]],
          email: [user.email, [Validators.required, Validators.email]],
          password: [''],
        });
      },
      error: () => this.toastr.error('Failed to load user data', 'Error'),
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid || this.isUpdating) return;

    this.isUpdating = true;
    const { name, email, password } = this.profileForm.value;

    const payload: { name?: string; email?: string; password?: string } = { name, email };
    if (password) payload.password = password;

    this.userService.updateUser(this.userId, payload).subscribe({
      next: () => {
        this.toastr.success('Profile updated successfully!', 'Success');
        this.isUpdating = false;
      },
      error: () => {
        this.toastr.error('Failed to update profile', 'Error');
        this.isUpdating = false;
      },
    });
  }

  resetForm(): void {
    this.profileForm.reset();
    this.loadUserData();
    this.toastr.info('Form has been reset to the latest saved values.', 'Form Reset');
  }
}
