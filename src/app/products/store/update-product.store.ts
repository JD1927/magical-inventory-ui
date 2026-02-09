import { inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import type { IProduct } from '@products/models/product.model';
import { ProductService } from '@products/services';
import { switchMap } from 'rxjs';
import { updateProductApiEvents } from './events/product-api-events';
import type { HttpErrorResponse } from '@angular/common/http';
import type { IError } from '@app/common/models';

interface UpdateProductState {
  updatedProduct: IProduct | null;
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: UpdateProductState = {
  updatedProduct: null,
  loading: false,
  successMessage: null,
  errorMessage: null,
};

export const UpdateProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(updateProductApiEvents.update, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
      successMessage: null,
    })),
    on(updateProductApiEvents.updatedSuccess, ({ payload }, state) => ({
      ...state,
      updatedProduct: payload,
      loading: false,
      errorMessage: null,
      successMessage: 'Product updated successfully!',
    })),
    on(updateProductApiEvents.updatedFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
      successMessage: null,
    })),
  ),
  withEffects((_, events = inject(Events), service = inject(ProductService)) => ({
    update$: events.on(updateProductApiEvents.update).pipe(
      switchMap(({ payload }) => {
        return service.update(payload.id, payload.dto).pipe(
          mapResponse({
            next: () =>
              updateProductApiEvents.updatedSuccess({
                ...payload.dto,
                id: payload.id,
              } as IProduct),
            error: (error: HttpErrorResponse) => {
              const errorMessage: string =
                (error.error as IError)?.message || 'Failed to update product';
              return updateProductApiEvents.updatedFailure(errorMessage);
            },
          }),
        );
      }),
    ),
  })),
);
