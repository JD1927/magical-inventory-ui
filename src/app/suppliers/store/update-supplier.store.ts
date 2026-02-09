import { inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import type { ISupplier } from '@suppliers/models/supplier.model';
import { SupplierService } from '@suppliers/services';
import { switchMap } from 'rxjs';
import { updateSupplierApiEvents } from './events/supplier-api-events';
import type { HttpErrorResponse } from '@angular/common/http';
import type { IError } from '@app/common/models';

interface UpdateSupplierState {
  updatedSupplier: ISupplier | null;
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: UpdateSupplierState = {
  updatedSupplier: null,
  loading: false,
  successMessage: null,
  errorMessage: null,
};

export const UpdateSupplierStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(updateSupplierApiEvents.update, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
      successMessage: null,
    })),
    on(updateSupplierApiEvents.updatedSuccess, ({ payload }, state) => ({
      ...state,
      updatedSupplier: payload,
      loading: false,
      errorMessage: null,
      successMessage: 'Supplier updated successfully!',
    })),
    on(updateSupplierApiEvents.updatedFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
      successMessage: null,
    })),
  ),
  withEffects((_, events = inject(Events), service = inject(SupplierService)) => ({
    update$: events.on(updateSupplierApiEvents.update).pipe(
      switchMap(({ payload }) => {
        return service.update(payload.id, payload.dto).pipe(
          mapResponse({
            next: () =>
              updateSupplierApiEvents.updatedSuccess({
                ...payload.dto,
                id: payload.id,
              } as ISupplier),
            error: (error: HttpErrorResponse) => {
              const errorMessage: string =
                (error.error as IError)?.message || 'Failed to update supplier';
              return updateSupplierApiEvents.updatedFailure(errorMessage);
            },
          }),
        );
      }),
    ),
  })),
);
