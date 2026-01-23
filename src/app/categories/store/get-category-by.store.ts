import { inject } from '@angular/core';
import type { ICategory } from '@categories/models/category.model';
import { CategoryService } from '@categories/services';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import { getCategoryByApiEvents } from './events/category-api-events';

interface GetCategoryByState {
  selectedCategory: ICategory | null;
  loading: boolean;
  errorMessage: string | null;
}

const initialState: GetCategoryByState = {
  selectedCategory: null,
  loading: false,
  errorMessage: null,
};

export const GetCategoryByStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(getCategoryByApiEvents.getBy, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
    })),
    on(getCategoryByApiEvents.gottenBySuccess, ({ payload }, state) => ({
      ...state,
      selectedCategory: payload,
      loading: false,
      errorMessage: null,
    })),
    on(getCategoryByApiEvents.gottenByFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
    })),
  ),
  withEffects((_, events = inject(Events), service = inject(CategoryService)) => ({
    getBy$: events.on(getCategoryByApiEvents.getBy).pipe(
      switchMap(({ payload: categoryId }) => {
        return service.getById(categoryId).pipe(
          mapResponse({
            next: (category: ICategory) => getCategoryByApiEvents.gottenBySuccess(category),
            error: () => getCategoryByApiEvents.gottenByFailure('Could not get category'),
          }),
        );
      }),
    ),
  })),
);
