import { inject } from '@angular/core';
import {
  type IInventoryMovement,
  type IInventoryMovementsResponse,
  type IInventoryRecord,
} from '@inventory/models/inventory.model';
import { InventoryService } from '@inventory/services';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import {
  getAllInventoryMovementsApiEvents,
  getAllInventoryRecordsApiEvents,
} from './events/inventory-api-events';

interface InventoryState {
  inventoryRecords: IInventoryRecord[];
  inventoryMovementsResponse: IInventoryMovementsResponse;
  selectedProductId: string | null;
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: InventoryState = {
  inventoryRecords: [],
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

export const InventoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(getAllInventoryRecordsApiEvents.load, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
      successMessage: null,
    })),
    on(getAllInventoryMovementsApiEvents.load, ({ payload: query }, state) => {
      const isLoadMore: boolean = query.loadMore;
      console.log('🚀 ~ isLoadMore:', isLoadMore);
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
    on(getAllInventoryRecordsApiEvents.loadedSuccess, ({ payload }, state) => ({
      ...state,
      inventoryRecords: [...payload],
      loading: false,
      errorMessage: null,
      successMessage: 'Inventory records loaded successfully',
    })),
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
    on(
      getAllInventoryRecordsApiEvents.loadedFailure,
      getAllInventoryMovementsApiEvents.loadedFailure,
      ({ payload: errorMessage }, state) => ({
        ...state,
        loading: false,
        errorMessage,
        successMessage: null,
      }),
    ),
    on(
      getAllInventoryMovementsApiEvents.selectedProductId,
      ({ payload: selectedProductId }, state) => ({
        ...state,
        selectedProductId,
      }),
    ),
  ),
  withEffects((_, events = inject(Events), service = inject(InventoryService)) => ({
    loadInventoryRecords$: events.on(getAllInventoryRecordsApiEvents.load).pipe(
      switchMap(() => {
        return service.getAllInventoryRecords().pipe(
          mapResponse({
            next: (result) => getAllInventoryRecordsApiEvents.loadedSuccess(result),
            error: (error: { message: string; statusCode: number }) =>
              getAllInventoryRecordsApiEvents.loadedFailure(
                error.message ?? 'Could not load inventory records',
              ),
          }),
        );
      }),
    ),
    loadInventoryMovements$: events.on(getAllInventoryMovementsApiEvents.load).pipe(
      switchMap(({ payload: dto }) => {
        return service.getAllInventoryMovements(dto).pipe(
          mapResponse({
            next: (result) => getAllInventoryMovementsApiEvents.loadedSuccess(result),
            error: (error: { message: string; statusCode: number }) =>
              getAllInventoryMovementsApiEvents.loadedFailure(
                error.message ?? 'Could not load inventory movements',
              ),
          }),
        );
      }),
    ),
  })),
);
