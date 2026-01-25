import type {
  ICreateSupplierDto,
  ISupplier,
  IUpdateSupplierDto,
} from '@suppliers/models/supplier.model';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const getAllSuppliersApiEvents = eventGroup({
  source: 'Get All Suppliers API',
  events: {
    load: type<void>(),
    loadedSuccess: type<ISupplier[]>(),
    loadedFailure: type<string>(),
  },
});

export const createNewSupplierApiEvents = eventGroup({
  source: 'Create New Supplier API',
  events: {
    create: type<ICreateSupplierDto>(),
    createdSuccess: type<ISupplier>(),
    createdFailure: type<string>(),
  },
});

export const getSupplierByApiEvents = eventGroup({
  source: 'Get Supplier By API',
  events: {
    getBy: type<string>(),
    gottenBySuccess: type<ISupplier>(),
    gottenByFailure: type<string>(),
    clearSelected: type<void>(),
  },
});

export const updateSupplierApiEvents = eventGroup({
  source: 'Update Supplier API',
  events: {
    update: type<{ id: string; dto: IUpdateSupplierDto }>(),
    updatedSuccess: type<ISupplier>(),
    updatedFailure: type<string>(),
  },
});

export const deleteSupplierApiEvents = eventGroup({
  source: 'Delete Supplier API',
  events: {
    delete: type<string>(),
    deletedSuccess: type<string>(),
    deletedFailure: type<string>(),
  },
});
