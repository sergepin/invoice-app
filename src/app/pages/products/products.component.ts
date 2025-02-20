import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/products.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddProductDialogComponent } from './add-product-dialog.component';
import { EditProductDialogComponent } from './edit-product-dialog.component';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Product } from '../../interfaces/product';
import {MatGridListModule} from '@angular/material/grid-list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatGridListModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private router = inject(Router);


  products: any[] = [];
  isAdmin = this.authService.getUser()?.role === 'admin';
  cart: any[] = [];

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data.map((product: Product) => ({
          ...product,
          quantity: 1, // Agregamos la propiedad para selección de cantidad
        }));
      },
      error: (error) => console.error('Error al obtener productos', error),
    });
  }

  openAddProductDialog() {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.addProduct(result).subscribe({
          next: () => this.loadProducts(),
          error: (error) => console.error('Error al añadir producto', error),
        });
      }
    });
  }

  openEditProductDialog(product: any) {
    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      width: '400px',
      data: product,
    });

    dialogRef.afterClosed().subscribe((updatedProduct) => {
      if (updatedProduct) {
        this.productService.updateProduct(product._id, updatedProduct).subscribe({
          next: () => this.loadProducts(),
          error: (error) => console.error('Error al editar producto', error),
        });
      }
    });
  }

  addToCart(product: any) {
    const quantity = product.quantity;

    if (quantity < 1 || quantity > product.stock) {
      alert('Cantidad no válida.');
      return;
    }

    // Buscar si el producto ya está en el carrito
    const existingItem = this.cart.find(item => item._id === product._id);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        alert('No puedes agregar más de lo que hay en stock.');
        return;
      }

      existingItem.quantity = newQuantity;
    } else {
      this.cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity
      });
    }

    console.log('Cart:', this.cart);
  }

  goToCheckout() {
    this.router.navigate(['/checkout'], { state: { cart: this.cart } });
  }
}
