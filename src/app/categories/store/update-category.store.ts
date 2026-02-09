import { inject } from '@angular/core';
import type { ICategory } from '@categories/models/category.model';
import { CategoryService } from '@categories/services';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import { updateCategoryApiEvents } from './events/category-api-events';
import type { HttpErrorResponse } from '@angular/common/http';
import type { IError } from '@app/common/models';

interface UpdateCategoryState {
  updatedCategory: ICategory | null;
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: UpdateCategoryState = {
  updatedCategory: null,
  loading: false,
  successMessage: null,
  errorMessage: null,
};

export const UpdateCategoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(updateCategoryApiEvents.update, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
      successMessage: null,
    })),
    on(updateCategoryApiEvents.updatedSuccess, ({ payload }, state) => ({
      ...state,
      updatedCategory: payload,
      loading: false,
      errorMessage: null,
      successMessage: 'Category updated successfully!',
    })),
    on(updateCategoryApiEvents.updatedFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
      successMessage: null,
    })),
  ),
  withEffects((_, events = inject(Events), service = inject(CategoryService)) => ({
    update$: events.on(updateCategoryApiEvents.update).pipe(
      switchMap(({ payload }) => {
        return service.update(payload.id, payload.dto).pipe(
          mapResponse({
            next: () =>
              updateCategoryApiEvents.updatedSuccess({
                ...payload.dto,
                id: payload.id,
              } as ICategory),
            error: (error: HttpErrorResponse) => {
              const errorMessage: string =
                (error.error as IError)?.message || 'Failed to update category';
              return updateCategoryApiEvents.updatedFailure(errorMessage);
            },
          }),
        );
      }),
    ),
  })),
);
