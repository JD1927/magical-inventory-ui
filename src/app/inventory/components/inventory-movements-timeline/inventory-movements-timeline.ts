import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ColorSchemeService } from '@common/utils';
import type { IInventoryMovementsResponse } from '@inventory/models/inventory.model';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-inventory-movements-timeline',
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    DividerModule,
    TagModule,
    TimelineModule,
    TooltipModule,
    AvatarModule,
  ],
  templateUrl: './inventory-movements-timeline.html',
  styleUrl: './inventory-movements-timeline.css',
})
export class InventoryMovementsTimeline {
  colorSchemeService = inject(ColorSchemeService);
  currentProductId = input<string | null>(null);
  inventoryMovementsResponse = input.required<IInventoryMovementsResponse>();
}
