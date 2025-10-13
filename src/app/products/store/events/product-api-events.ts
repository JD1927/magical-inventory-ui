import type { ICreateProductDto, IProduct } from '@products/models/product.model';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const getAllProductsApiEvents = eventGroup({
  source: 'Get All Products API',
  events: {
    load: type<void>(),
    loadedSuccess: type<IProduct[]>(),
    loadedFailure: type<string>(),
  },
});

export const createNewProductApiEvents = eventGroup({
  source: 'Create New Product API',
  events: {
    create: type<ICreateProductDto>(),
    createdSuccess: type<IProduct>(),
    createdFailure: type<string>(),
  },
});

export const deleteProductApiEvents = eventGroup({
  source: 'Delete Product API',
  events: {
    delete: type<string>(),
    deletedSuccess: type<void>(),
    deletedFailure: type<string>(),
  },
});
