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
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-inventory-page',
  imports: [CommonModule, RouterOutlet, PageHeader, ButtonModule],
  providers: [InventoryDialogService, DialogService],
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
        // Refresh supplier list
        this.dispatcher.dispatch(getAllInventoryRecordsApiEvents.load());
        this.inventoryDialogService.closeDialog();
      });

    this.events
      .on(
        createNewInInventoryMovementApiEvents.createdFailure,
        createNewOutInventoryMovementApiEvents.createdFailure,
      )
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload }) => {
        console.error(payload);
      });
  }
}
