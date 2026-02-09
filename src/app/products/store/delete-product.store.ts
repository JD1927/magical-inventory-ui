import { inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { ProductService } from '@products/services';
import { switchMap } from 'rxjs';
import { deleteProductApiEvents } from './events/product-api-events';
import type { HttpErrorResponse } from '@angular/common/http';
import type { IError } from '@app/common/models';

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
    on(deleteProductApiEvents.deletedSuccess, ({ payload: successMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage: null,
      successMessage,
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
            next: ({ message }) => deleteProductApiEvents.deletedSuccess(message),
            error: (error: HttpErrorResponse) => {
              const errorMessage: string =
                (error.error as IError)?.message || 'Failed to delete product';
              return deleteProductApiEvents.deletedFailure(errorMessage);
            },
          }),
        );
      }),
    ),
  })),
);
