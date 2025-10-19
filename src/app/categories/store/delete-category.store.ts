import { inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { CategoryService } from '@categories/services';
import { switchMap } from 'rxjs';
import { deleteCategoryApiEvents } from './events/category-api-events';

interface DeleteCategoryState {
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: DeleteCategoryState = {
  loading: false,
  successMessage: null,
  errorMessage: null,
};

export const DeleteCategoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(deleteCategoryApiEvents.delete, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
      successMessage: null,
    })),
    on(deleteCategoryApiEvents.deletedSuccess, (_, state) => ({
      ...state,
      loading: false,
      errorMessage: null,
      successMessage: 'Category deleted successfully!',
    })),
    on(deleteCategoryApiEvents.deletedFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
      successMessage: null,
    })),
  ),
  withEffects((state, events = inject(Events), productService = inject(CategoryService)) => ({
    deleteProduct$: events.on(deleteCategoryApiEvents.delete).pipe(
      switchMap(({ payload: categoryId }) => {
        return productService.delete(categoryId).pipe(
          mapResponse({
            next: () => deleteCategoryApiEvents.deletedSuccess(),
            error: () => deleteCategoryApiEvents.deletedFailure('Could not delete product'),
          }),
        );
      }),
    ),
  })),
);
