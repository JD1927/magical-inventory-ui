import { inject } from '@angular/core';
import type { IPaginationDto } from '@common/models/pagination.model';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import type { IProductListResponse } from '@products/models/product.model';
import { PAGE_LIMIT, ProductService } from '@products/services';
import { switchMap } from 'rxjs';
import { getAllProductsApiEvents } from './events/product-api-events';

interface ProductsState {
  productListResponse: IProductListResponse;
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  pagination: IPaginationDto;
}

const initialState: ProductsState = {
  productListResponse: {
    limit: 0,
    offset: 0,
    products: [],
    totalRecords: 0,
  },
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
    on(getAllProductsApiEvents.loadedSuccess, ({ payload: response }, state) => ({
      ...state,
      productListResponse: {
        limit: response.limit,
        offset: response.offset,
        products: response.products,
        totalRecords: response.totalRecords,
      },
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
    loadProducts$: events.on(getAllProductsApiEvents.load).pipe(
      switchMap(() => {
        const pagination = state.pagination();
        const limit = pagination?.limit ?? PAGE_LIMIT;
        const offset = pagination?.offset ?? 0;
        return service.getAllWithParams(limit, offset).pipe(
          mapResponse({
            next: (products) => getAllProductsApiEvents.loadedSuccess(products),
            error: (error: { message: string; statusCode: number }) =>
              getAllProductsApiEvents.loadedFailure(
                error.message ?? 'Could not perform product loading',
              ),
          }),
        );
      }),
    ),
  })),
);
