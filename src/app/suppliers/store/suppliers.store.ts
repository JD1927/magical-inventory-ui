import { inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import type { ISupplier } from '../models/supplier.model';
import { getAllSuppliersApiEvents } from './events/supplier-api-events';
import { SupplierService } from '../services/supplier-service/supplier-service';

interface SuppliersState {
  suppliers: ISupplier[];
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: SuppliersState = {
  suppliers: [],
  loading: false,
  successMessage: null,
  errorMessage: null,
};

export const SuppliersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(getAllSuppliersApiEvents.load, (_, state) => ({
      ...state,
      suppliers: [],
      loading: true,
      errorMessage: null,
      successMessage: null,
    })),
    on(getAllSuppliersApiEvents.loadedSuccess, ({ payload: suppliers }, state) => ({
      ...state,
      suppliers: [...suppliers],
      loading: false,
      errorMessage: null,
      successMessage: 'Suppliers loaded successfully',
    })),
    on(getAllSuppliersApiEvents.loadedFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
      successMessage: null,
    })),
  ),
  withEffects((_, events = inject(Events), service = inject(SupplierService)) => ({
    loadSuppliers$: events.on(getAllSuppliersApiEvents.load).pipe(
      switchMap(() => {
        return service.getAllSuppliers().pipe(
          mapResponse({
            next: (result) => getAllSuppliersApiEvents.loadedSuccess(result),
            error: (error: { message: string; statusCode: number }) =>
              getAllSuppliersApiEvents.loadedFailure(error.message ?? 'Could not load suppliers'),
          }),
        );
      }),
    ),
  })),
);
