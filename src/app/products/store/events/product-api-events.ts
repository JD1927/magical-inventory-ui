import type {
  ICreateProductDto,
  IProduct,
  IProductListResponse,
  IUpdateProductDto,
} from '@products/models/product.model';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const getAllProductsApiEvents = eventGroup({
  source: 'Get All Products API',
  events: {
    load: type<void>(),
    loadedSuccess: type<IProductListResponse>(),
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

export const getProductByApiEvents = eventGroup({
  source: 'Get Product By API',
  events: {
    getBy: type<string>(),
    gottenBySuccess: type<IProduct>(),
    gottenByFailure: type<string>(),
    clearSelected: type<void>(),
  },
});

export const updateProductApiEvents = eventGroup({
  source: 'Update Product API',
  events: {
    update: type<{ id: string; dto: IUpdateProductDto }>(),
    updatedSuccess: type<IProduct>(),
    updatedFailure: type<string>(),
  },
});

export const deleteProductApiEvents = eventGroup({
  source: 'Delete Product API',
  events: {
    delete: type<string>(),
    deletedSuccess: type<string>(),
    deletedFailure: type<string>(),
  },
});
