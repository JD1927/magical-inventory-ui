import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { IUser } from '../../models/user.model';

export const userApiEvents = eventGroup({
  source: 'User API',
  events: {
    load: type<void>(),
    loadedSuccess: type<IUser[]>(),
    loadedFailure: type<string>(),
    toggleActive: type<string>(), // userId
    toggledSuccess: type<IUser>(),
    toggledFailure: type<string>(),
    delete: type<string>(), // userId
    deletedSuccess: type<string>(), // userId
    deletedFailure: type<string>(),
  },
});
