import { inject } from '@angular/core';
import type { ICategory } from '@categories/models/category.model';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import { CategoryService } from '../services';
import { getAllCategoriesApiEvents } from './events/category-api-events';

interface CategoriesState {
  categories: ICategory[];
  mainCategories: ICategory[];
  secondaryCategories: ICategory[];
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  mainCategories: [],
  secondaryCategories: [],
  loading: false,
  successMessage: null,
  errorMessage: null,
};

export const CategoriesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(getAllCategoriesApiEvents.load, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
      successMessage: null,
    })),
    on(getAllCategoriesApiEvents.loadedSuccess, ({ payload: categories }, state) => ({
      ...state,
      categories,
      mainCategories: [...categories.filter((category) => category.isMain)],
      secondaryCategories: [...categories.filter((category) => !category.isMain)],
      loading: false,
      errorMessage: null,
      successMessage: 'Categories loaded successfully',
    })),
    on(getAllCategoriesApiEvents.loadedFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
      successMessage: null,
    })),
  ),
  withEffects((_, events = inject(Events), categoryService = inject(CategoryService)) => ({
    loadCategories$: events.on(getAllCategoriesApiEvents.load).pipe(
      switchMap(() => {
        return categoryService.getAllCategories().pipe(
          mapResponse({
            next: (categories) => getAllCategoriesApiEvents.loadedSuccess(categories),
            error: (error: { message: string; statusCode: number }) =>
              getAllCategoriesApiEvents.loadedFailure(error.message ?? 'Could not load categories'),
          }),
        );
      }),
    ),
  })),
);
