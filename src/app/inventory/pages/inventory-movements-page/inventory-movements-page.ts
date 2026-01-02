import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ELimitSettings } from '@app/common/models/pagination.model';
import { InventoryMovementForm, InventoryMovementsTimeline } from '@inventory/components';
import type {
  IInventoryMovement,
  IInventoryMovementsResponse,
} from '@inventory/models/inventory.model';
import { EMovementType, type IInventoryMovementQueryDto } from '@inventory/models/inventory.model';
import {
  createNewInInventoryMovementApiEvents,
  createNewOutInventoryMovementApiEvents,
  getAllInventoryMovementsApiEvents,
  InventoryStore,
} from '@inventory/store';
import { Dispatcher, Events } from '@ngrx/signals/events';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-inventory-movements-page',
  imports: [
    CommonModule,
    InventoryMovementsTimeline,
    CardModule,
    InventoryMovementForm,
    ButtonModule,
  ],
  templateUrl: './inventory-movements-page.html',
  styles: `
    .inventory-movements-timeline {
      height: calc(100dvh - 390px);
      overflow: auto;
    }
    .load-more {
      position: absolute;
      bottom: 0;
      left: calc(50% - 75px);
    }
  `,
})
export class InventoryMovementsPage {
  // Dependencies
  inventoryStore = inject(InventoryStore);
  dispatcher = inject(Dispatcher);
  events = inject(Events);
  // Signals
  movementQueryDto = signal<IInventoryMovementQueryDto>(INITIAL_MOVEMENT_QUERY_DTO);
  // Computed signals
  currentProductId = computed<string | null>(() => this.inventoryStore.selectedProductId());
  inventoryMovementsResponse = computed<IInventoryMovementsResponse>(() =>
    this.inventoryStore.inventoryMovementsResponse(),
  );

  constructor() {
    this.listenToInventoryEvents();
    effect(() => {
      const productId: string | null = this.currentProductId();
      if (!productId || this.movementQueryDto().productId === productId) return;
      this.movementQueryDto.set({ ...INITIAL_MOVEMENT_QUERY_DTO, productId });
      this.loadMovementsByQuery();
    });
  }

  listenToInventoryEvents() {
    this.listenToCreateMovementEvents();
  }

  private listenToCreateMovementEvents() {
    this.events
      .on(
        createNewInInventoryMovementApiEvents.createdSuccess,
        createNewOutInventoryMovementApiEvents.createdSuccess,
      )
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        // Refresh inventory movements AFTER a new movement is created
        this.movementQueryDto.update((state) => ({
          ...INITIAL_MOVEMENT_QUERY_DTO,
          productId: state.productId,
        }));
        this.loadMovementsByQuery();
      });
  }

  loadMovementsByQuery() {
    this.dispatcher.dispatch(getAllInventoryMovementsApiEvents.load(this.movementQueryDto()));
  }

  onLoadMore() {
    const totalRecords: number = this.inventoryStore.inventoryMovementsResponse().totalRecords;
    const currentMovements: IInventoryMovement[] =
      this.inventoryStore.inventoryMovementsResponse().movements;
    if (currentMovements.length >= totalRecords) return;
    this.movementQueryDto.update((state) => ({
      ...state,
      offset: (state.offset || 0) + (state.limit || ELimitSettings.DEFAULT),
      loadMore: true,
    }));
    this.loadMovementsByQuery();
  }

  onProductSelectionChange(productId: string): void {
    this.dispatcher.dispatch(getAllInventoryMovementsApiEvents.selectedProductId(productId));
  }
}

export const INITIAL_MOVEMENT_QUERY_DTO: IInventoryMovementQueryDto = {
  productId: '',
  startDate: undefined,
  endDate: undefined,
  type: EMovementType.ALL,
  limit: ELimitSettings.DEFAULT,
  offset: 0,
  orderBy: undefined,
  loadMore: false,
};
