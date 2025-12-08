import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { InventoryTable } from '@inventory/components';
import { getAllInventoryRecordsApiEvents, InventoryStore } from '@inventory/store';
import { Dispatcher, Events } from '@ngrx/signals/events';

@Component({
  selector: 'app-category-list-page',
  imports: [CommonModule, InventoryTable],
  templateUrl: './inventory-list-page.html',
  styleUrl: './inventory-list-page.css',
})
export class InventoryListPage {
  inventoryStore = inject(InventoryStore);
  dispatcher = inject(Dispatcher);
  events = inject(Events);

  constructor() {
    this.dispatcher.dispatch(getAllInventoryRecordsApiEvents.load());
  }
}
