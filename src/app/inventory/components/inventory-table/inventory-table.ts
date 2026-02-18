import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import type { IInventoryRecord } from '@inventory/models/inventory.model';
import { Button } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-inventory-table',
  imports: [
    CommonModule,
    TableModule,
    TooltipModule,
    Button,
    MenuModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
  ],
  templateUrl: './inventory-table.html',
  styleUrl: './inventory-table.css',
})
export class InventoryTable {
  viewProductMovements = output<string>();
  inventoryRecords = input.required<IInventoryRecord[]>();

  searchTerm = signal<string>('');

  filteredRecords = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.inventoryRecords();

    return this.inventoryRecords().filter((record) =>
      record.product.sku.toLowerCase().includes(term),
    );
  });

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
  }

  onClearSearch(): void {
    this.searchTerm.set('');
  }
}
