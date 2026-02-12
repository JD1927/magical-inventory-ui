import { inject } from '@angular/core';
import {
  type IInventoryMovement,
  type IInventoryMovementsResponse,
} from '@inventory/models/inventory.model';
import { InventoryService } from '@inventory/services';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import {
  getAllInventoryMovementsApiEvents,
  updateInventoryMovementStatusApiEvents,
} from './events/inventory-api-events';
import type { HttpErrorResponse } from '@angular/common/http';
import type { IError } from '@app/common/models';

interface InventoryMovementState {
  inventoryMovementsResponse: IInventoryMovementsResponse;
  selectedProductId: string | null;
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: InventoryMovementState = {
  inventoryMovementsResponse: {
    productId: '',
    movements: [],
    totalRecords: 0,
    startDate: null,
    endDate: null,
    limit: 10,
    offset: 0,
  },
  selectedProductId: null,
  loading: false,
  successMessage: null,
  errorMessage: null,
};

export const InventoryMovementStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(getAllInventoryMovementsApiEvents.load, ({ payload: query }, state) => {
      const isLoadMore: boolean = query.loadMore;
      const inventoryMovementsResponse = isLoadMore
        ? {
            ...state.inventoryMovementsResponse,
            movements: [...state.inventoryMovementsResponse.movements],
          }
        : { ...state.inventoryMovementsResponse, movements: [] };
      return {
        ...state,
        inventoryMovementsResponse,
        loading: true,
        errorMessage: null,
        successMessage: null,
      };
    }),
    on(getAllInventoryMovementsApiEvents.loadedSuccess, ({ payload }, state) => {
      const currentProductId: string = state.inventoryMovementsResponse.productId;
      const newProductId: string = payload.productId;
      const movements: IInventoryMovement[] =
        currentProductId === newProductId
          ? [...state.inventoryMovementsResponse.movements, ...payload.movements]
          : payload.movements;
      return {
        ...state,
        inventoryMovementsResponse: {
          ...payload,
          movements,
        },
        loading: false,
        errorMessage: null,
        successMessage: 'Inventory movements loaded successfully',
      };
    }),
    on(getAllInventoryMovementsApiEvents.loadedFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
      successMessage: null,
    })),
    on(
      getAllInventoryMovementsApiEvents.selectedProductId,
      ({ payload: selectedProductId }, state) => ({
        ...state,
        selectedProductId,
      }),
    ),
    on(updateInventoryMovementStatusApiEvents.update, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
      successMessage: null,
    })),
    on(
      updateInventoryMovementStatusApiEvents.updatedSuccess,
      ({ payload: updatedMovement }, state) => {
        const movements = state.inventoryMovementsResponse.movements.map((movement) =>
          movement.id === updatedMovement.id ? updatedMovement : movement,
        );
        return {
          ...state,
          inventoryMovementsResponse: {
            ...state.inventoryMovementsResponse,
            movements,
          },
          loading: false,
          errorMessage: null,
          successMessage: 'Inventory movement status updated successfully',
        };
      },
    ),
    on(
      updateInventoryMovementStatusApiEvents.updatedFailure,
      ({ payload: errorMessage }, state) => ({
        ...state,
        loading: false,
        errorMessage,
        successMessage: null,
      }),
    ),
  ),
  withEffects((_, events = inject(Events), service = inject(InventoryService)) => ({
    loadInventoryMovements$: events.on(getAllInventoryMovementsApiEvents.load).pipe(
      switchMap(({ payload: dto }) => {
        return service.getAllInventoryMovements(dto).pipe(
          mapResponse({
            next: (result) => getAllInventoryMovementsApiEvents.loadedSuccess(result),
            error: (error: HttpErrorResponse) => {
              const errorMessage: string =
                (error.error as IError)?.message || 'Failed to load inventory movements';
              return getAllInventoryMovementsApiEvents.loadedFailure(errorMessage);
            },
          }),
        );
      }),
    ),
    updateStatus$: events.on(updateInventoryMovementStatusApiEvents.update).pipe(
      switchMap(({ payload }) => {
        return service.updateMovementStatus(payload.id, payload.dto).pipe(
          mapResponse({
            next: (result) => updateInventoryMovementStatusApiEvents.updatedSuccess(result),
            error: (error: HttpErrorResponse) => {
              const errorMessage: string =
                (error.error as IError)?.message || 'Failed to update inventory movement status';
              return updateInventoryMovementStatusApiEvents.updatedFailure(errorMessage);
            },
          }),
        );
      }),
    ),
  })),
);
