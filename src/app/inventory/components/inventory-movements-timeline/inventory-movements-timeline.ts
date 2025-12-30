import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import type { IInventoryMovementsResponse } from '@inventory/models/inventory.model';
import type { IProduct } from '@products/models/product.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-inventory-movements-timeline',
  imports: [CommonModule, TimelineModule, CardModule, ButtonModule, TagModule, TooltipModule],
  templateUrl: './inventory-movements-timeline.html',
  styleUrl: './inventory-movements-timeline.css',
})
export class InventoryMovementsTimeline {
  currentProduct = input<IProduct | null>(null);
  inventoryMovementsResponse = input.required<IInventoryMovementsResponse>();
}
