import type {
  ICreateInInventoryMovementDto,
  ICreateInventoryMovementResult,
  ICreateOutInventoryMovementDto,
  IInventoryMovementQueryDto,
  IInventoryMovementsResponse,
  IInventoryRecord,
} from '@inventory/models/inventory.model';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const getAllInventoryRecordsApiEvents = eventGroup({
  source: 'Get All Inventory Records API',
  events: {
    load: type<void>(),
    loadedSuccess: type<IInventoryRecord[]>(),
    loadedFailure: type<string>(),
  },
});

export const getAllInventoryMovementsApiEvents = eventGroup({
  source: 'Get All Inventory Movements API',
  events: {
    load: type<IInventoryMovementQueryDto>(),
    loadedSuccess: type<IInventoryMovementsResponse>(),
    loadedFailure: type<string>(),
  },
});

export const createNewInInventoryMovementApiEvents = eventGroup({
  source: 'Create New In Inventory Movement API',
  events: {
    createIn: type<ICreateInInventoryMovementDto>(),
    createdSuccess: type<ICreateInventoryMovementResult>(),
    createdFailure: type<string>(),
  },
});

export const createNewOutInventoryMovementApiEvents = eventGroup({
  source: 'Create New Out Inventory Movement API',
  events: {
    createOut: type<ICreateOutInventoryMovementDto>(),
    createdSuccess: type<ICreateInventoryMovementResult>(),
    createdFailure: type<string>(),
  },
});

export const undoMovementApiEvents = eventGroup({
  source: 'Undo Movement API',
  events: {
    undo: type<string>(),
    undoneSuccess: type<void>(),
    undoneFailure: type<string>(),
  },
});
