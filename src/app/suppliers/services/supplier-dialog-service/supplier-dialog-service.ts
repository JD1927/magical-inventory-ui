import { inject, Injectable } from '@angular/core';
import { SupplierForm } from '@suppliers/components';
import type { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root',
})
export class SupplierDialogService {
  dialogService: DialogService = inject(DialogService);
  dialogRef: DynamicDialogRef<SupplierForm> | null = null;

  openDialog(supplierId?: string): DynamicDialogRef<SupplierForm> | null {
    this.dialogRef = this.dialogService.open(SupplierForm, {
      modal: true,
      draggable: false,
      header: supplierId ? 'Edit Supplier' : 'Create Supplier',
      width: '50%',
      inputValues: { supplierId },
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
