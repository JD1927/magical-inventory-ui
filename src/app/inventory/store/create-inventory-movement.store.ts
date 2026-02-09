import { inject } from '@angular/core';
import { InventoryService } from '@inventory/services';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import {
  createNewInInventoryMovementApiEvents,
  createNewOutInventoryMovementApiEvents,
} from './events/inventory-api-events';
import type { HttpErrorResponse } from '@angular/common/http';
import type { IError } from '@app/common/models';

interface InventoryMovementState {
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: InventoryMovementState = {
  loading: false,
  successMessage: null,
  errorMessage: null,
};

export const CreateInventoryMovementStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(
      createNewInInventoryMovementApiEvents.createIn,
      createNewOutInventoryMovementApiEvents.createOut,
      (_, state) => ({
        ...state,
        loading: true,
        errorMessage: null,
        successMessage: null,
      }),
    ),
    on(createNewInInventoryMovementApiEvents.createdSuccess, ({ payload }, state) => ({
      ...state,
      loading: false,
      errorMessage: null,
      successMessage: `Inventory movement IN for '${payload.inventoryRecord.product.name}' was created successfully`,
    })),
    on(createNewOutInventoryMovementApiEvents.createdSuccess, ({ payload }, state) => ({
      ...state,
      loading: false,
      errorMessage: null,
      successMessage: `Inventory movement OUT for '${payload.inventoryRecord.product.name}' was created successfully`,
    })),
    on(
      createNewInInventoryMovementApiEvents.createdFailure,
      createNewOutInventoryMovementApiEvents.createdFailure,
      ({ payload: errorMessage }, state) => ({
        ...state,
        loading: false,
        errorMessage,
        successMessage: null,
      }),
    ),
  ),
  withEffects((_, events = inject(Events), service = inject(InventoryService)) => ({
    createIn$: events.on(createNewInInventoryMovementApiEvents.createIn).pipe(
      switchMap(({ payload: dto }) => {
        return service.createInMovement(dto).pipe(
          mapResponse({
            next: (result) => createNewInInventoryMovementApiEvents.createdSuccess(result),
            error: (error: HttpErrorResponse) => {
              const errorMessage: string =
                (error.error as IError)?.message || 'Failed to create inventory movement';
              return createNewInInventoryMovementApiEvents.createdFailure(errorMessage);
            },
          }),
        );
      }),
    ),
    createOut$: events.on(createNewOutInventoryMovementApiEvents.createOut).pipe(
      switchMap(({ payload: dto }) => {
        return service.createOutMovement(dto).pipe(
          mapResponse({
            next: (result) => createNewOutInventoryMovementApiEvents.createdSuccess(result),
            error: (error: HttpErrorResponse) => {
              const errorMessage: string =
                (error.error as IError)?.message || 'Failed to create inventory movement';
              return createNewOutInventoryMovementApiEvents.createdFailure(errorMessage);
            },
          }),
        );
      }),
    ),
  })),
);
