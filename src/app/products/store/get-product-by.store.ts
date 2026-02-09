import { inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import type { IProduct } from '@products/models/product.model';
import { ProductService } from '@products/services';
import { switchMap } from 'rxjs';
import { getProductByApiEvents } from './events/product-api-events';
import type { HttpErrorResponse } from '@angular/common/http';
import type { IError } from '@app/common/models';

interface GetProductByState {
  selectedProduct: IProduct | null;
  loading: boolean;
  errorMessage: string | null;
}

const initialState: GetProductByState = {
  selectedProduct: null,
  loading: false,
  errorMessage: null,
};

export const GetProductByStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(getProductByApiEvents.getBy, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
    })),
    on(getProductByApiEvents.gottenBySuccess, ({ payload }, state) => ({
      ...state,
      selectedProduct: payload,
      loading: false,
      errorMessage: null,
    })),
    on(getProductByApiEvents.gottenByFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
    })),
  ),
  withEffects((_, events = inject(Events), service = inject(ProductService)) => ({
    getBy$: events.on(getProductByApiEvents.getBy).pipe(
      switchMap(({ payload: productId }) => {
        return service.getById(productId).pipe(
          mapResponse({
            next: (product: IProduct) => getProductByApiEvents.gottenBySuccess(product),
            error: (error: HttpErrorResponse) => {
              const errorMessage: string =
                (error.error as IError)?.message || 'Failed to get product';
              return getProductByApiEvents.gottenByFailure(errorMessage);
            },
          }),
        );
      }),
    ),
  })),
);
