import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryDialogService } from '@app/inventory/services';
import { InventoryTable } from '@inventory/components';
import { getAllInventoryRecordsApiEvents, InventoryStore } from '@inventory/store';
import { Dispatcher, Events } from '@ngrx/signals/events';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-category-list-page',
  imports: [CommonModule, InventoryTable, ButtonModule],
  providers: [InventoryDialogService, DialogService],
  template: `
    <div class="absolute -top-23 right-0">
      <button
        type="button"
        pButton
        (click)="onAddInventoryMovement()"
        pTooltip="Add Inventory Movement"
      >
        <i class="pi pi-plus" pButtonIcon></i>
        <span class="hidden md:inline-block" pButtonLabel>Add Inventory Movement</span>
      </button>
    </div>
    <div class="page-content">
      <app-inventory-table
        [inventoryRecords]="inventoryStore.inventoryRecords()"
        (viewProductMovements)="onViewProductMovements($event)"
      />
    </div>
  `,
})
export class InventoryListPage {
  inventoryStore = inject(InventoryStore);
  dispatcher = inject(Dispatcher);
  events = inject(Events);
  router = inject(Router);
  inventoryDialogService = inject(InventoryDialogService);

  constructor() {
    this.dispatcher.dispatch(getAllInventoryRecordsApiEvents.load());
  }

  async onViewProductMovements(productId: string) {
    // Handle viewing product movements for the given inventory record ID
    await this.router.navigate(['/dashboard/inventory/movements/product/', productId]);
  }

  onAddInventoryMovement(): void {
    this.inventoryDialogService.openDialog();
  }
}
