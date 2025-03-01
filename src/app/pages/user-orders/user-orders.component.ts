import { CommonModule } from '@angular/common';
import { OrdersService } from './../../services/orders.service';
import { Component, OnInit } from '@angular/core';

interface Order {
  orderId: string;
  totalAmount: number;
  date: string;
  products: {
    productId: string;
    name: string;
    unitPrice: number;
    quantity: number
  }[];
}

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  imports: [CommonModule],
  styleUrl: './user-orders.component.css',
})
export class UserOrdersComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?._id) {
      this.ordersService.getUserPurchases(user._id).subscribe({
        next: (response: { purchases: Order[] }) => {
          this.orders = response.purchases.map((order: Order) => ({
            ...order,
            date: this.formatDate(order.date)
          }));
        },
        error: (err) => console.error('Error fetching orders:', err),
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }

  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  showOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  hideOrderDetails(): void {
    this.selectedOrder = null;
  }
}
