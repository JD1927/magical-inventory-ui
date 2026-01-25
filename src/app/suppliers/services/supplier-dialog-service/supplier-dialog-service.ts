import { inject, Injectable } from '@angular/core';
import { SupplierForm } from '@suppliers/components';
import { ConfirmationService } from 'primeng/api';
import type { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupplierDialogService {
  dialogService: DialogService = inject(DialogService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
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

  openDeleteConfirmationDialog(event: Event): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        header: 'Confirmation',
        message: 'Are you sure you want to delete this supplier?',
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
