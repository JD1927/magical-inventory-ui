import { inject, Injectable } from '@angular/core';
import { ProductForm } from '@products/components';
import type { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root',
})
export class ProductDialogService {
  dialogService: DialogService = inject(DialogService);
  dialogRef: DynamicDialogRef<ProductForm> | null = null;

  openDialog(productId?: string): DynamicDialogRef<ProductForm> | null {
    this.dialogRef = this.dialogService.open(ProductForm, {
      modal: true,
      draggable: false,
      header: productId ? 'Edit Product' : 'Create Product',
      width: '50%',
      inputValues: { productId },
      baseZIndex: 10000,
      breakpoints: { '960px': '70%', '640px': '100%' },
    });

    return this.dialogRef;
  }

  closeDialog(): void {
    if (!this.dialogRef) return;

    this.dialogRef.close();
  }
}
