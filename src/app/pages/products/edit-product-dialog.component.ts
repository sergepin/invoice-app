import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  template: `<div class="p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold mb-4">Edit Product</h2>
    <form [formGroup]="productForm" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          formControlName="name"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          formControlName="description"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          formControlName="price"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          formControlName="stock"
          min="0"
          step="1"
          (keypress)="preventFloat($event)"
          (change)="correctStockInput()"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        />
        <p
          *ngIf="productForm.get('stock')?.invalid"
          class="text-red-500 text-sm mt-1"
        >
          Stock must be a whole number and cannot be negative
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Status</label>
        <div class="flex items-center gap-4">
          <label class="inline-flex items-center">
            <input
              type="radio"
              formControlName="status"
              value="active"
              class="form-radio text-blue-600"
            />
            <span class="ml-2">Active</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="radio"
              formControlName="status"
              value="inactive"
              class="form-radio text-gray-500"
            />
            <span class="ml-2">Inactive</span>
          </label>
        </div>
        <p
          *ngIf="productForm.get('status')?.invalid"
          class="text-red-500 text-sm mt-1"
        >
          Please select a status
        </p>
      </div>

      <div class="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          (click)="cancel()"
          class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          (click)="updateProduct()"
          [disabled]="productForm.invalid"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          Update
        </button>
      </div>
    </form>
  </div>`,
  styles: [],
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

  preventFloat(event: KeyboardEvent) {
    if (event.key === '.' || event.key === ',' || event.key === 'e') {
      event.preventDefault();
    }
  }

  correctStockInput() {
    let stockControl = this.productForm.get('stock');
    if (stockControl) {
      stockControl.setValue(Math.floor(stockControl.value || 0));
    }
  }
}
