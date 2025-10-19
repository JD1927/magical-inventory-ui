import type { ICategory, ICreateCategoryDto } from '@categories/models/category.model';
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

export const deleteCategoryApiEvents = eventGroup({
  source: 'Delete Category API',
  events: {
    delete: type<string>(),
    deletedSuccess: type<void>(),
    deletedFailure: type<string>(),
  },
});
