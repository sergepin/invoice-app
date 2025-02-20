import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-product-dialog',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  template: `
    <h2>Editar Producto</h2>
    <form [formGroup]="productForm">
      <mat-form-field appearance="outline">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="name" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Descripción</mat-label>
        <textarea matInput formControlName="description"></textarea>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Precio</mat-label>
        <input matInput type="number" formControlName="price" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Stock</mat-label>
        <input matInput type="number" formControlName="stock" />
        <mat-error *ngIf="productForm.get('stock')?.invalid">El stock no puede ser negativo</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Estado</mat-label>
        <input matInput formControlName="status" />
      </mat-form-field>

      <div class="actions">
        <button mat-button (click)="cancel()">Cancelar</button>
        <button mat-raised-button color="primary" (click)="updateProduct()" [disabled]="productForm.invalid">
          Actualizar
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
    `,
  ],
})
export class EditProductDialogComponent {
  private dialogRef = inject(MatDialogRef<EditProductDialogComponent>);
  private formBuilder = inject(FormBuilder);

  productForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.productForm = this.formBuilder.group({
      name: [data?.name || '', Validators.required],
      description: [data?.description || '', Validators.required],
      price: [data?.price ?? 0, [Validators.required, Validators.min(0)]],
      stock: [data?.stock ?? 0, [Validators.required, Validators.min(0)]],
      status: [data?.status || 'active', Validators.required],
    });
  }

  updateProduct() {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
