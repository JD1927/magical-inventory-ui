import type { ICreateSupplierDto, ISupplier } from '@suppliers/models/supplier.model';
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

export const deleteSupplierApiEvents = eventGroup({
  source: 'Delete Supplier API',
  events: {
    delete: type<string>(),
    deletedSuccess: type<void>(),
    deletedFailure: type<string>(),
  },
});
