import { inject } from '@angular/core';
import { CategoryService } from '@categories/services';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import { createNewCategoryApiEvents } from './events/category-api-events';

interface CategoriesState {
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: CategoriesState = {
  loading: false,
  successMessage: null,
  errorMessage: null,
};

export const CreateCategoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(createNewCategoryApiEvents.create, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
      successMessage: null,
    })),
    on(createNewCategoryApiEvents.createdSuccess, ({ payload: newCategory }, state) => ({
      ...state,
      loading: false,
      errorMessage: null,
      successMessage: `Category '${newCategory.name}' was created successfully`,
    })),
    on(createNewCategoryApiEvents.createdFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
      successMessage: null,
    })),
  ),
  withEffects((_, events = inject(Events), categoryService = inject(CategoryService)) => ({
    createCategory$: events.on(createNewCategoryApiEvents.create).pipe(
      switchMap(({ payload: dto }) => {
        return categoryService.create(dto).pipe(
          mapResponse({
            next: (category) => createNewCategoryApiEvents.createdSuccess(category),
            error: (error: { message: string; statusCode: number }) =>
              createNewCategoryApiEvents.createdFailure(
                error.message ?? 'Could not perform category creation',
              ),
          }),
        );
      }),
    ),
  })),
);
