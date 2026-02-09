import { inject, Injectable } from '@angular/core';
import { InventoryMovementForm } from '@inventory/components';
import { ConfirmationService } from 'primeng/api';
import type { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventoryDialogService {
  dialogService: DialogService = inject(DialogService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  dialogRef: DynamicDialogRef<InventoryMovementForm> | null = null;

  openDialog(): DynamicDialogRef<InventoryMovementForm> | null {
    this.dialogRef = this.dialogService.open(InventoryMovementForm, {
      modal: true,
      draggable: false,
      header: 'Add Inventory Movement',
      inputValues: { isCalledFromDialog: true },
      width: '50%',
      baseZIndex: 10000,
      breakpoints: { '960px': '70%', '640px': '100%' },
    });

    return this.dialogRef;
  }

  openUndoConfirmationDialog(event: Event): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        header: 'Confirm Undo',
        message:
          'Are you sure you want to undo this inventory movement? This action cannot be revoked.',
        icon: 'pi pi-exclamation-triangle',
        closable: true,
        closeOnEscape: true,
        modal: true,
        acceptButtonProps: { severity: 'danger', label: 'Undo', icon: 'pi pi-undo' },
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
