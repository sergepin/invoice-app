import { OrdersService } from './../../services/orders.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

interface Order {
  orderId: string;
  user: {
    id: string;
    name: string;
  };
  totalAmount: number;
  date: Date;
  products: Product[];
  isExpanded?: boolean;
}

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = false;
  currentPage = 1;
  itemsPerPage = 15;
  totalOrders = 0;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.isLoading = true;
    this.ordersService.getAllOrdersWithDetails().subscribe({
      next: (response) => {
        this.orders = response.orders.map((order) => {
          return {
            ...order,
            date: new Date(order.date),
            isExpanded: false,
            user: { id: order.userId, name: order.user.name },
          };
        });

        this.orders.sort((a, b) => b.date.getTime() - a.date.getTime());

        this.totalOrders = this.orders.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching orders', error);
        this.isLoading = false;
      },
    });
  }

  toggleOrder(order: Order): void {
    order.isExpanded = !order.isExpanded;
  }

  paginatedOrders(): Order[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.orders.slice(startIndex, startIndex + this.itemsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  totalPages(): number {
    return Math.ceil(this.totalOrders / this.itemsPerPage);
  }
}
