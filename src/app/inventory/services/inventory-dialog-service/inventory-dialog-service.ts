import { inject, Injectable } from '@angular/core';
import { InventoryMovementForm } from '@inventory/components';
import type { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root',
})
export class InventoryDialogService {
  dialogService: DialogService = inject(DialogService);
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

  closeDialog(): void {
    if (!this.dialogRef) return;

    this.dialogRef.close();
  }
}
