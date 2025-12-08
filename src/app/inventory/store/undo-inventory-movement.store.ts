import { inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import { InventoryService } from '../services/inventory-service/inventory-service';
import { undoMovementApiEvents } from './events/inventory-api-events';

interface UndoInventoryMovementState {
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: UndoInventoryMovementState = {
  loading: false,
  successMessage: null,
  errorMessage: null,
};

export const UndoInventoryMovementStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(undoMovementApiEvents.undo, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
      successMessage: null,
    })),
    on(undoMovementApiEvents.undoneSuccess, (_, state) => ({
      ...state,
      loading: false,
      errorMessage: null,
      successMessage: 'Undone inventory movement successfully!',
    })),
    on(undoMovementApiEvents.undoneFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
      successMessage: null,
    })),
  ),
  withEffects((state, events = inject(Events), service = inject(InventoryService)) => ({
    undo$: events.on(undoMovementApiEvents.undo).pipe(
      switchMap(({ payload: id }) => {
        return service.undoMovementById(id).pipe(
          mapResponse({
            next: () => undoMovementApiEvents.undoneSuccess(),
            error: () => undoMovementApiEvents.undoneFailure('Could not undo inventory movement'),
          }),
        );
      }),
    ),
  })),
);
