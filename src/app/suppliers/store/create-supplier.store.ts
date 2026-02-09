import { inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { SupplierService } from '@suppliers/services';
import { switchMap } from 'rxjs';
import { createNewSupplierApiEvents } from './events/supplier-api-events';
import type { HttpErrorResponse } from '@angular/common/http';
import type { IError } from '@app/common/models';

interface SuppliersState {
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: SuppliersState = {
  loading: false,
  successMessage: null,
  errorMessage: null,
};

export const CreateSupplierStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(createNewSupplierApiEvents.create, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
      successMessage: null,
    })),
    on(createNewSupplierApiEvents.createdSuccess, ({ payload: newSupplier }, state) => ({
      ...state,
      loading: false,
      errorMessage: null,
      successMessage: `Supplier '${newSupplier.name}' was created successfully`,
    })),
    on(createNewSupplierApiEvents.createdFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
      successMessage: null,
    })),
  ),
  withEffects((_, events = inject(Events), service = inject(SupplierService)) => ({
    create$: events.on(createNewSupplierApiEvents.create).pipe(
      switchMap(({ payload: dto }) => {
        return service.create(dto).pipe(
          mapResponse({
            next: (supplier) => createNewSupplierApiEvents.createdSuccess(supplier),
            error: (error: HttpErrorResponse) => {
              const errorMessage: string =
                (error.error as IError)?.message || 'Failed to create supplier';
              return createNewSupplierApiEvents.createdFailure(errorMessage);
            },
          }),
        );
      }),
    ),
  })),
);
