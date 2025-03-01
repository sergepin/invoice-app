import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { manageUser } from '../../interfaces/user';
import { LoginService } from '../../services/login.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent implements OnInit {
  private userService = inject(UserService);
  private toastr = inject(ToastrService);
  private loginService = inject(LoginService);
  private formBuilder = inject(FormBuilder);

  users: manageUser[] = [];
  showEditModal = false;
  showDeleteModal = false;
  showRegisterModal = false;
  selectedUser: manageUser | null = null;
  password = '';
  isLoading = false;

  registerForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    role: ['user', Validators.required],
  });

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.toastr.info('Users loaded successfully!', 'Users');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.toastr.error('Failed to load users.', 'Error');
        this.isLoading = false;
      },
    });
  }

  openEditModal(user: manageUser): void {
    if (this.showEditModal) return;
    this.selectedUser = { ...user };
    this.password = '';
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
    this.password = '';
  }

  openRegisterModal(): void {
    this.showRegisterModal = true;
    this.registerForm.reset({ role: 'user' });
  }

  closeRegisterModal(): void {
    this.showRegisterModal = false;
  }

  openDeleteModal(user: manageUser): void {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedUser = null;
  }

  deleteUser(): void {
    if (!this.selectedUser) return;

    this.isLoading = true;
    this.userService.deleteUser(this.selectedUser._id).subscribe({
      next: () => {
        this.toastr.success('User deleted successfully!', 'Success');
        this.closeDeleteModal();
        this.fetchUsers();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.toastr.error('Failed to delete user.', 'Error');
        this.isLoading = false;
      },
    });
  }

  saveUserChanges(): void {
    if (!this.selectedUser) return;

    const { _id, name, email, role } = this.selectedUser;
    const payload: Partial<manageUser> & { password?: string } = { name, email, role };

    if (this.password) payload.password = this.password;

    if (this.isEmailDuplicate(email, _id)) {
      this.toastr.error('Email already exists.', 'Error');
      return;
    }

    this.isLoading = true;
    this.userService.updateUser(_id, payload).subscribe({
      next: () => {
        this.toastr.success('User updated successfully!', 'Success');
        this.closeEditModal();
        this.fetchUsers();
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.toastr.error('Failed to update user.', 'Error');
        this.isLoading = false;
      },
    });
  }

  registerUser(): void {
    if (this.registerForm.invalid) {
      this.toastr.warning('Please fill all required fields correctly.', 'Warning');
      return;
    }

    const { name, email, password, confirmPassword, role } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.toastr.error('Passwords do not match', 'Error');
      return;
    }

    if (this.isEmailDuplicate(email)) {
      this.toastr.error('Email already exists.', 'Error');
      return;
    }

    const user = { name, email, password, role };

    this.isLoading = true;
    this.loginService.register(user).subscribe({
      next: () => {
        this.toastr.success('User registered successfully!', 'Success');
        this.closeRegisterModal();
        this.fetchUsers();
      },
      error: (err) => {
        console.error('Error registering user:', err);
        this.toastr.error('Failed to register user.', 'Error');
        this.isLoading = false;
      },
    });
  }

  private isEmailDuplicate(email: string, userId?: string): boolean {
    return this.users.some((user) => user.email === email && user._id !== userId);
  }
}
