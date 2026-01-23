import type {
  ICategory,
  ICreateCategoryDto,
  IUpdateCategoryDto,
} from '@categories/models/category.model';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const getAllCategoriesApiEvents = eventGroup({
  source: 'Get All Categories API',
  events: {
    load: type<void>(),
    loadedSuccess: type<ICategory[]>(),
    loadedFailure: type<string>(),
  },
});

export const createNewCategoryApiEvents = eventGroup({
  source: 'Create New Category API',
  events: {
    create: type<ICreateCategoryDto>(),
    createdSuccess: type<ICategory>(),
    createdFailure: type<string>(),
  },
});

export const getCategoryByApiEvents = eventGroup({
  source: 'Get Category By API',
  events: {
    getBy: type<string>(),
    gottenBySuccess: type<ICategory>(),
    gottenByFailure: type<string>(),
    clearSelected: type<void>(),
  },
});

export const updateCategoryApiEvents = eventGroup({
  source: 'Update Category API',
  events: {
    update: type<{ id: string; dto: IUpdateCategoryDto }>(),
    updatedSuccess: type<ICategory>(),
    updatedFailure: type<string>(),
  },
});

export const deleteCategoryApiEvents = eventGroup({
  source: 'Delete Category API',
  events: {
    delete: type<string>(),
    deletedSuccess: type<string>(),
    deletedFailure: type<string>(),
  },
});
