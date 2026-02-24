import { CommonModule } from '@angular/common';
import { Component, inject, input, model, output } from '@angular/core';
import type { IInventoryMovement } from '@inventory/models/inventory.model';
import { EPurchaseOrderStatus } from '@inventory/models/inventory.model';
import { updateInventoryMovementStatusApiEvents } from '@inventory/store';
import { Dispatcher } from '@ngrx/signals/events';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory-movement-detail',
  imports: [
    CommonModule,
    ButtonModule,
    DividerModule,
    DrawerModule,
    TagModule,
    SelectModule,
    FormsModule,
  ],
  templateUrl: './inventory-movement-detail.html',
  styleUrl: './inventory-movement-detail.css',
})
export class InventoryMovementDetail {
  private dispatcher = inject(Dispatcher);

  visible = model.required<boolean>();
  movement = input.required<IInventoryMovement | null>();

  undoMovement = output<{ movementId: string; event: Event }>();

  purchaseOrderStatusOptions = [
    {
      label: EPurchaseOrderStatus.PENDING,
      value: EPurchaseOrderStatus.PENDING,
      icon: 'pi pi-clock',
      severity: 'warn',
    },
    {
      label: EPurchaseOrderStatus.COMPLETED,
      value: EPurchaseOrderStatus.COMPLETED,
      icon: 'pi pi-check-circle',
      severity: 'success',
    },
  ];

  onStatusChange(newStatus: EPurchaseOrderStatus): void {
    const movement = this.movement();
    if (!movement) return;

    this.dispatcher.dispatch(
      updateInventoryMovementStatusApiEvents.update({
        id: movement.id,
        dto: { purchaseOrderStatus: newStatus },
      }),
    );
  }

  onUndoMovement(movementId: string, event: Event): void {
    this.visible.set(false);
    this.undoMovement.emit({ movementId, event });
  }
}
