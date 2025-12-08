import { inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import type { IInventoryMovement, IInventoryRecord } from '@inventory/models/inventory.model';
import {
  getAllInventoryMovementsApiEvents,
  getAllInventoryRecordsApiEvents,
} from './events/inventory-api-events';
import { InventoryService } from '../services/inventory-service/inventory-service';

interface InventoryState {
  inventoryRecords: IInventoryRecord[];
  inventoryMovements: IInventoryMovement[];
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: InventoryState = {
  inventoryRecords: [],
  inventoryMovements: [],
  loading: false,
  successMessage: null,
  errorMessage: null,
};

export const InventoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(
      getAllInventoryRecordsApiEvents.load,
      getAllInventoryMovementsApiEvents.load,
      (_, state) => ({
        ...state,
        loading: true,
        errorMessage: null,
        successMessage: null,
      }),
    ),
    on(getAllInventoryRecordsApiEvents.loadedSuccess, ({ payload }, state) => ({
      ...state,
      inventoryRecords: payload,
      loading: false,
      errorMessage: null,
      successMessage: 'Inventory records loaded successfully',
    })),
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
      switchMap(() => {
        return service.getAllInventoryMovements().pipe(
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
