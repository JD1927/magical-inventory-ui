import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TruncatePipe } from '@common/pipes';
import type { IInventoryRecord } from '@inventory/models/inventory.model';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-inventory-table',
  imports: [CommonModule, TableModule, TruncatePipe, TooltipModule],
  templateUrl: './inventory-table.html',
  styleUrl: './inventory-table.css',
})
export class InventoryTable {
  inventoryRecords = input.required<IInventoryRecord[]>();
}
