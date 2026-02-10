import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { ColorSchemeService } from '@common/utils';
import type {
  IInventoryMovement,
  IInventoryMovementsResponse,
} from '@inventory/models/inventory.model';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
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
    DrawerModule,
  ],
  templateUrl: './inventory-movements-timeline.html',
  styleUrl: './inventory-movements-timeline.css',
})
export class InventoryMovementsTimeline {
  colorSchemeService = inject(ColorSchemeService);
  undoMovement = output<{ movementId: string; event: Event }>();
  currentProductId = input<string | null>(null);
  inventoryMovementsResponse = input.required<IInventoryMovementsResponse>();

  selectedMovement = signal<IInventoryMovement | null>(null);
  drawerVisible = signal(false);
  lastClickEvent = signal<Event | null>(null);

  menuItems: MenuItem[] = [
    {
      label: 'View Details',
      icon: 'pi pi-info-circle',
      command: () => {
        if (this.selectedMovement()) {
          this.drawerVisible.set(true);
        }
      },
    },
    {
      label: 'Undo Movement',
      icon: 'pi pi-undo',
      command: () => {
        const movement = this.selectedMovement();
        const event = this.lastClickEvent();
        if (!movement || !event) return;
        this.onUndoMovement(movement.id, event);
      },
    },
  ];

  onMovementAction(event: Event, movement: IInventoryMovement, menu: Menu): void {
    this.selectedMovement.set(movement);
    this.lastClickEvent.set(event);
    menu.toggle(event);
  }

  onUndoMovement(movementId: string, event: Event): void {
    event.stopPropagation();
    this.drawerVisible.set(false);
    this.undoMovement.emit({ movementId, event });
  }
}
