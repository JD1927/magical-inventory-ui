import { inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { ProductService } from '@products/services';
import { switchMap } from 'rxjs';
import { createNewProductApiEvents } from './events/product-api-events';

interface CreateProductState {
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: CreateProductState = {
  loading: false,
  successMessage: null,
  errorMessage: null,
};

export const CreateProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(createNewProductApiEvents.create, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
      successMessage: null,
    })),
    on(createNewProductApiEvents.createdSuccess, ({ payload: newProduct }, state) => ({
      ...state,
      loading: false,
      errorMessage: null,
      successMessage: `Product '${newProduct.name}' was created successfully`,
    })),
    on(createNewProductApiEvents.createdFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
      successMessage: null,
    })),
  ),
  withEffects((state, events = inject(Events), productService = inject(ProductService)) => ({
    createProduct$: events.on(createNewProductApiEvents.create).pipe(
      switchMap(({ payload: dto }) => {
        return productService.create(dto).pipe(
          mapResponse({
            next: (product) => createNewProductApiEvents.createdSuccess(product),
            error: () => createNewProductApiEvents.createdFailure('Could not create product'),
          }),
        );
      }),
    ),
  })),
);
