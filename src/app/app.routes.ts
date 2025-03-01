import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { ProductsComponent } from './pages/products/products.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { UsersComponent } from './pages/users/users.component';
import { PublicGuard } from './guards/public.guard';
import { AuthGuard } from './guards/auth.guard';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { User } from './interfaces/login';

export const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [PublicGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [PublicGuard] },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
      { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
      { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
      { path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuard]}
    ],
  },
];
