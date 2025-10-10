import { inject, Injectable } from '@angular/core';
import { ProductForm } from '@products/components';
import type { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root',
})
export class ProductDialogService {
  dialogService: DialogService = inject(DialogService);
  productDialogRef: DynamicDialogRef | undefined;

  openProductDialog(productId?: string): DynamicDialogRef {
    this.productDialogRef = this.dialogService.open(ProductForm, {
      modal: true,
      header: productId ? 'Edit Product' : 'Create Product',
      width: '50%',
      inputValues: { productId },
      baseZIndex: 10000,
      breakpoints: { '960px': '70%', '640px': '100%' },
    });

    return this.productDialogRef;
  }

  closeProductDialog(): void {
    if (!this.productDialogRef) return;

    this.productDialogRef.close();
  }
}
