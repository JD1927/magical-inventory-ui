import { inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { SupplierService } from '@suppliers/services';
import { switchMap } from 'rxjs';
import { deleteSupplierApiEvents } from './events/supplier-api-events';
import type { HttpErrorResponse } from '@angular/common/http';
import type { IError } from '@app/common/models';

interface DeleteSupplierState {
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: DeleteSupplierState = {
  loading: false,
  successMessage: null,
  errorMessage: null,
};

export const DeleteSupplierStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(deleteSupplierApiEvents.delete, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
      successMessage: null,
    })),
    on(deleteSupplierApiEvents.deletedSuccess, (_, state) => ({
      ...state,
      loading: false,
      errorMessage: null,
      successMessage: 'Supplier deleted successfully!',
    })),
    on(deleteSupplierApiEvents.deletedFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
      successMessage: null,
    })),
  ),
  withEffects((state, events = inject(Events), service = inject(SupplierService)) => ({
    delete$: events.on(deleteSupplierApiEvents.delete).pipe(
      switchMap(({ payload: id }) => {
        return service.delete(id).pipe(
          mapResponse({
            next: ({ message }) => deleteSupplierApiEvents.deletedSuccess(message),
            error: (error: HttpErrorResponse) => {
              const errorMessage: string =
                (error.error as IError)?.message || 'Failed to delete supplier';
              return deleteSupplierApiEvents.deletedFailure(errorMessage);
            },
          }),
        );
      }),
    ),
  })),
);
