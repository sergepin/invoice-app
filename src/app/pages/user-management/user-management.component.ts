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

  registerForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    role: ['user', Validators.required],
  });

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.toastr.info('Users loaded successfully!', 'Users');
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.toastr.error('Failed to load users.', 'Error');
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

    this.userService.deleteUser(this.selectedUser._id).subscribe({
      next: () => {
        this.toastr.success('User deleted successfully!', 'Success');
        this.closeDeleteModal();
        this.fetchUsers();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.toastr.error('Failed to delete user.', 'Error');
      },
    });
  }

  saveUserChanges(): void {
    if (!this.selectedUser) return;

    const { _id, name, email, role } = this.selectedUser;
    const payload: Partial<manageUser> & { password?: string } = { name, email, role };

    if (this.password) payload.password = this.password;

    this.userService.updateUser(_id, payload).subscribe({
      next: () => {
        this.toastr.success('User updated successfully!', 'Success');
        this.closeEditModal();
        this.fetchUsers();
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.toastr.error('Failed to update user.', 'Error');
      },
    });
  }

  registerUser(): void {
    if (this.registerForm.invalid) return;

    const { name, email, password, confirmPassword, role } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.toastr.error('Passwords do not match', 'Error');
      return;
    }

    const user = { name, email, password, role };

    this.loginService.register(user).subscribe({
      next: () => {
        this.toastr.success('User registered successfully!', 'Success');
        this.closeRegisterModal();
        this.fetchUsers();
      },
      error: (err) => {
        console.error('Error registering user:', err);
        this.toastr.error('Failed to register user.', 'Error');
      },
    });
  }
}
