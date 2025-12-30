import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import type { IInventoryRecord } from '@inventory/models/inventory.model';
import { Button } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-inventory-table',
  imports: [CommonModule, TableModule, TooltipModule, Button, MenuModule],
  templateUrl: './inventory-table.html',
  styleUrl: './inventory-table.css',
})
export class InventoryTable {
  viewProductMovements = output<string>();
  inventoryRecords = input.required<IInventoryRecord[]>();
}
