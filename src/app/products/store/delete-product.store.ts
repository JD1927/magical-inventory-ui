import { inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { ProductService } from '@products/services';
import { switchMap } from 'rxjs';
import { deleteProductApiEvents } from './events/product-api-events';

interface DeleteProductState {
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: DeleteProductState = {
  loading: false,
  successMessage: null,
  errorMessage: null,
};

export const DeleteProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(deleteProductApiEvents.delete, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
      successMessage: null,
    })),
    on(deleteProductApiEvents.deletedSuccess, (_, state) => ({
      ...state,
      loading: false,
      errorMessage: null,
      successMessage: 'Product deleted successfully!',
    })),
    on(deleteProductApiEvents.deletedFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
      successMessage: null,
    })),
  ),
  withEffects((state, events = inject(Events), service = inject(ProductService)) => ({
    delete$: events.on(deleteProductApiEvents.delete).pipe(
      switchMap(({ payload: id }) => {
        return service.delete(id).pipe(
          mapResponse({
            next: () => deleteProductApiEvents.deletedSuccess(),
            error: () => deleteProductApiEvents.deletedFailure('Could not delete product'),
          }),
        );
      }),
    ),
  })),
);
