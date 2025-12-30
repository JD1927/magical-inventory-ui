import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import type { IProduct } from '@products/models/product.model';
import { InventoryMovementsTimeline, InventoryMovementForm } from '@inventory/components';
import { EMovementType, type IInventoryMovementQueryDto } from '@inventory/models/inventory.model';
import { getAllInventoryMovementsApiEvents, InventoryStore } from '@inventory/store';
import { Dispatcher, Events } from '@ngrx/signals/events';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-inventory-movements-page',
  imports: [CommonModule, InventoryMovementsTimeline, CardModule, InventoryMovementForm],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div class="col-span-1 lg:col-span-8 page-content">
        <app-inventory-movements-timeline
          [currentProduct]="currentProduct()"
          [inventoryMovementsResponse]="inventoryStore.inventoryMovementsResponse()"
        />
      </div>
      <div class="hidden lg:block col-span-1 lg:col-span-4">
        <p-card header="Record Movement">
          <app-inventory-movement-form [isCalledFromDialog]="false" />
        </p-card>
      </div>
    </div>
  `,
})
export class InventoryMovementsPage {
  inventoryStore = inject(InventoryStore);
  dispatcher = inject(Dispatcher);
  events = inject(Events);
  activatedRoute = inject(ActivatedRoute);
  currentProduct = signal<IProduct | null>(null);
  movementQueryDto = signal<IInventoryMovementQueryDto>({
    productId: '',
    startDate: undefined,
    endDate: undefined,
    type: EMovementType.ALL,
    limit: undefined,
    offset: undefined,
    orderBy: undefined,
  });

  constructor() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const productId: string | null = params.get('productId');
      if (!productId) return;
      this.movementQueryDto.update((state) => ({ ...state, productId }));
      this.loadMovementsByQuery();
    });
    this.listenToInventoryMovementEvents();
  }

  listenToInventoryMovementEvents() {
    this.events
      .on(getAllInventoryMovementsApiEvents.loadedSuccess)
      .pipe(takeUntilDestroyed())
      .subscribe(({ payload }) => {
        const { movements } = payload;
        this.currentProduct.set(movements.length ? movements[0].product : null);
        // Handle success if needed
      });
  }

  loadMovementsByQuery() {
    this.dispatcher.dispatch(getAllInventoryMovementsApiEvents.load(this.movementQueryDto()));
  }
}
