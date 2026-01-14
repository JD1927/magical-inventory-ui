import { inject, Injectable } from '@angular/core';
import { ProductForm } from '@products/components';
import { ConfirmationService } from 'primeng/api';
import type { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductDialogService {
  dialogService: DialogService = inject(DialogService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
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

  openDeleteConfirmationDialog(event: Event): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        header: 'Confirmation',
        message: 'Are you sure you want to delete this product?',
        icon: 'pi pi-exclamation-triangle',
        closable: true,
        closeOnEscape: true,
        modal: true,
        acceptButtonProps: { severity: 'danger', label: 'Delete', icon: 'pi pi-trash' },
        rejectButtonProps: { severity: 'secondary', label: 'Cancel', icon: 'pi pi-times' },
        accept: () => {
          subscriber.next(true);
          subscriber.complete();
        },
        reject: () => {
          subscriber.next(false);
          subscriber.complete();
        },
      });
    });
  }

  closeDialog(): void {
    if (!this.dialogRef) return;

    this.dialogRef.close();
  }
}
