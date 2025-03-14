import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';
import { InvoiceService } from '../../services/invoice.service';
import { CartProduct } from '../../interfaces/cart-product';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  cart: CartProduct[] = [];
  userId: string | null = null;
  totalAmount: number = 0;
  accessToken: string | null = null;
  isProcessing = false;

  private router = inject(Router);
  private checkoutService = inject(CheckoutService);
  private invoiceService = inject(InvoiceService);
  private toastr = inject(ToastrService);

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    this.cart = navigation?.extras.state?.['cart'] || [];
    this.loadUserData();
    this.calculateTotal();
  }

  private loadUserData() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');

    if (user) {
      this.userId = JSON.parse(user)._id;
    }

    if (token) {
      this.accessToken = token;
    }
  }

  private calculateTotal() {
    this.totalAmount = this.cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
  }

  checkout() {
    if (!this.userId || !this.accessToken) {
      this.toastr.error('User not authenticated or missing token', 'Error');
      return;
    }

    this.isProcessing = true;

    const checkoutData = {
      user_id: this.userId,
      products: this.cart.map(p => ({
        product_id: p._id,
        quantity: p.quantity ?? 1
      })),
      date: new Date().toISOString()
    };

    this.checkoutService.checkout(checkoutData, this.accessToken).subscribe({
      next: () => {
        this.toastr.success('Purchase successful! Redirecting...', 'Success');

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 5000);
      },
      error: (err) => {
        console.error('Checkout error', err);
        this.toastr.error('Checkout failed. Please try again.', 'Error');
        this.isProcessing = false;
      }
    });
  }
}
