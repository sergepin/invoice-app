import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';
import { InvoiceService } from '../../services/invoice.service';
import { CartProduct } from '../../interfaces/cart-product';
import { CommonModule } from '@angular/common';

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

  private router = inject(Router);
  private checkoutService = inject(CheckoutService);
  private invoiceService = inject(InvoiceService);

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
      console.error('User not authenticated or missing token');
      return;
    }

    const checkoutData = {
      user_id: this.userId,
      products: this.cart.map(p => ({
        product_id: p._id,
        quantity: p.quantity ?? 1
      })),
      date: new Date().toISOString()
    };

    console.log(checkoutData);

    this.checkoutService.checkout(checkoutData, this.accessToken).subscribe({
      next: response => {
        console.log('Purchase completed:', response);
      },
      error: err => console.error('Checkout error', err)
    });
  }

}
