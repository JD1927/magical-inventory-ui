import { inject } from '@angular/core';
import { type IInventoryRecord } from '@inventory/models/inventory.model';
import { InventoryService } from '@inventory/services';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import { getAllInventoryRecordsApiEvents } from './events/inventory-api-events';
import type { HttpErrorResponse } from '@angular/common/http';
import type { IError } from '@app/common/models';

interface InventoryState {
  inventoryRecords: IInventoryRecord[];
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: InventoryState = {
  inventoryRecords: [],
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
    on(getAllInventoryRecordsApiEvents.loadedSuccess, ({ payload }, state) => ({
      ...state,
      inventoryRecords: [...payload],
      loading: false,
      errorMessage: null,
      successMessage: 'Inventory records loaded successfully',
    })),
    on(getAllInventoryRecordsApiEvents.loadedFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
      successMessage: null,
    })),
  ),
  withEffects((_, events = inject(Events), service = inject(InventoryService)) => ({
    loadInventoryRecords$: events.on(getAllInventoryRecordsApiEvents.load).pipe(
      switchMap(() => {
        return service.getAllInventoryRecords().pipe(
          mapResponse({
            next: (result) => getAllInventoryRecordsApiEvents.loadedSuccess(result),
            error: (error: HttpErrorResponse) => {
              const errorMessage: string =
                (error.error as IError)?.message || 'Failed to load inventory records';
              return getAllInventoryRecordsApiEvents.loadedFailure(errorMessage);
            },
          }),
        );
      }),
    ),
  })),
);
