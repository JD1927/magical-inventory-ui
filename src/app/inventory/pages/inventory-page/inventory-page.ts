import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { PageHeader } from '@common/components';
import { InventoryDialogService } from '@inventory/services/inventory-dialog-service/inventory-dialog-service';
import {
  createNewInInventoryMovementApiEvents,
  createNewOutInventoryMovementApiEvents,
  getAllInventoryRecordsApiEvents,
} from '@inventory/store';
import { Dispatcher, Events } from '@ngrx/signals/events';
import { ButtonModule } from 'primeng/button';
import { CreateInventoryMovementStore } from '@inventory/store/create-inventory-movement.store';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-inventory-page',
  imports: [CommonModule, RouterOutlet, PageHeader, ButtonModule],
  template: `
    <app-page-header title="Inventory" description="Manage your inventory records" />
    <div class="card relative">
      <router-outlet />
    </div>
  `,
})
export class InventoryPage {
  inventoryDialogService = inject(InventoryDialogService);
  events = inject(Events);
  dispatcher = inject(Dispatcher);
  messageService = inject(MessageService);
  createInventoryMovementStore = inject(CreateInventoryMovementStore);

  constructor() {
    this.listenToInventoryEvents();
  }

  private listenToInventoryEvents() {
    this.events
      .on(
        createNewInInventoryMovementApiEvents.createdSuccess,
        createNewOutInventoryMovementApiEvents.createdSuccess,
      )
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        // Refresh inventory records list
        this.dispatcher.dispatch(getAllInventoryRecordsApiEvents.load());
        // Show success toast
        this.messageService.add({
          severity: 'success',
          summary: 'Inventory Movement',
          detail: this.createInventoryMovementStore.successMessage() ?? 'Operation successful',
        });
        // Close dialog if form was opened that way
        this.inventoryDialogService.closeDialog();
      });

    this.events
      .on(
        createNewInInventoryMovementApiEvents.createdFailure,
        createNewOutInventoryMovementApiEvents.createdFailure,
      )
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload }) => {
        // Show error toast
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: payload || 'Failed to create inventory movement',
        });
        console.error(payload);
      });
  }
}
