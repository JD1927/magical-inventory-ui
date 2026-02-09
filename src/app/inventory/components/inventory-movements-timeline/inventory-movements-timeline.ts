import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { ColorSchemeService } from '@common/utils';
import type { IInventoryMovementsResponse } from '@inventory/models/inventory.model';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { Menu, MenuModule } from 'primeng/menu';
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
    MenuModule,
  ],
  templateUrl: './inventory-movements-timeline.html',
  styleUrl: './inventory-movements-timeline.css',
})
export class InventoryMovementsTimeline {
  colorSchemeService = inject(ColorSchemeService);
  undoMovement = output<{ movementId: string; event: Event }>();
  currentProductId = input<string | null>(null);
  inventoryMovementsResponse = input.required<IInventoryMovementsResponse>();

  selectedMovementId = signal<string | null>(null);
  lastClickEvent = signal<Event | null>(null);

  menuItems: MenuItem[] = [
    {
      label: 'Undo Movement',
      icon: 'pi pi-undo',
      command: () => {
        const movementId = this.selectedMovementId();
        const event = this.lastClickEvent();
        if (!movementId || !event) return;
        this.undoMovement.emit({ movementId, event });
      },
    },
  ];

  onMovementAction(event: Event, movementId: string, menu: Menu) {
    this.selectedMovementId.set(movementId);
    this.lastClickEvent.set(event);
    menu.toggle(event);
  }
}
