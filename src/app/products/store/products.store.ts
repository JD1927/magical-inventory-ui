import { inject } from '@angular/core';
import type { IPaginationDto } from '@common/models/pagination.model';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import type { IProduct } from '@products/models/product.model';
import { PAGE_LIMIT, ProductService } from '@products/services';
import { switchMap } from 'rxjs';
import { getAllProductsApiEvents } from './events/product-api-events';

interface ProductsState {
  products: IProduct[];
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  pagination: IPaginationDto;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  successMessage: null,
  errorMessage: null,
  pagination: { limit: PAGE_LIMIT, offset: 0 },
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(getAllProductsApiEvents.load, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
      successMessage: null,
    })),
    on(getAllProductsApiEvents.loadedSuccess, ({ payload: products }, state) => ({
      ...state,
      products,
      loading: false,
      errorMessage: null,
      successMessage: 'Products loaded successfully',
    })),
    on(getAllProductsApiEvents.loadedFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
      successMessage: null,
    })),
  ),
  withEffects((state, events = inject(Events), service = inject(ProductService)) => ({
    load$: events.on(getAllProductsApiEvents.load).pipe(
      switchMap(() => {
        const pagination = state.pagination();
        const limit = pagination?.limit ?? PAGE_LIMIT;
        const offset = pagination?.offset ?? 0;
        return service.getAll(limit, offset).pipe(
          mapResponse({
            next: (products) => getAllProductsApiEvents.loadedSuccess(products),
            error: (error: { message: string; statusCode: number }) =>
              getAllProductsApiEvents.loadedFailure(
                error.message ?? 'Could not perform product deletion',
              ),
          }),
        );
      }),
    ),
  })),
);
