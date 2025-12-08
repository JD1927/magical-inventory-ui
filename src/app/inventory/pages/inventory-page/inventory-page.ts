import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import {
  createNewInInventoryMovementApiEvents,
  createNewOutInventoryMovementApiEvents,
} from '@app/inventory/store';
import { getAllSuppliersApiEvents } from '@app/suppliers/store';
import { PageHeader } from '@common/components';
import { InventoryDialogService } from '@inventory/services/inventory-dialog-service/inventory-dialog-service';
import { Dispatcher, Events } from '@ngrx/signals/events';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-inventory-page',
  imports: [CommonModule, RouterOutlet, PageHeader, Button],
  providers: [InventoryDialogService, DialogService],
  template: `
    <app-page-header title="Inventory" description="Manage your inventory records">
      <div class="ml-auto flex gap-2">
        <p-button
          label="Add Inventory Movement"
          icon="pi pi-plus"
          (onClick)="onAddInventoryMovement()"
        />
      </div>
    </app-page-header>
    <div class="card">
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

  onAddInventoryMovement(): void {
    this.inventoryDialogService.openDialog();
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
        this.dispatcher.dispatch(getAllSuppliersApiEvents.load());
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
