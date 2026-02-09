import { inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import type { ISupplier } from '@suppliers/models/supplier.model';
import { SupplierService } from '@suppliers/services';
import { switchMap } from 'rxjs';
import { getSupplierByApiEvents } from './events/supplier-api-events';
import type { HttpErrorResponse } from '@angular/common/http';
import type { IError } from '@app/common/models';

interface GetSupplierByState {
  selectedSupplier: ISupplier | null;
  loading: boolean;
  errorMessage: string | null;
}

const initialState: GetSupplierByState = {
  selectedSupplier: null,
  loading: false,
  errorMessage: null,
};

export const GetSupplierByStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(getSupplierByApiEvents.getBy, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
    })),
    on(getSupplierByApiEvents.gottenBySuccess, ({ payload }, state) => ({
      ...state,
      selectedSupplier: payload,
      loading: false,
      errorMessage: null,
    })),
    on(getSupplierByApiEvents.gottenByFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
    })),
  ),
  withEffects((_, events = inject(Events), service = inject(SupplierService)) => ({
    getBy$: events.on(getSupplierByApiEvents.getBy).pipe(
      switchMap(({ payload: supplierId }) => {
        return service.getById(supplierId).pipe(
          mapResponse({
            next: (product: ISupplier) => getSupplierByApiEvents.gottenBySuccess(product),
            error: (error: HttpErrorResponse) => {
              const errorMessage: string =
                (error.error as IError)?.message || 'Failed to get supplier';
              return getSupplierByApiEvents.gottenByFailure(errorMessage);
            },
          }),
        );
      }),
    ),
  })),
);
