import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { IError } from '@common/models';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import { IUser } from '../models/user.model';
import { UsersService } from '../services/users.service';
import { userApiEvents } from './events/user-api-events';

interface UsersState {
  users: IUser[];
  loading: boolean;
  errorMessage: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  errorMessage: null,
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(userApiEvents.load, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
    })),
    on(userApiEvents.loadedSuccess, ({ payload: users }, state) => ({
      ...state,
      users,
      loading: false,
    })),
    on(userApiEvents.loadedFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
    })),
    on(userApiEvents.toggleActive, (_, state) => ({
      ...state,
      loading: true,
    })),
    on(userApiEvents.toggledSuccess, ({ payload: updatedUser }, state) => ({
      ...state,
      users: state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
      loading: false,
    })),
    on(userApiEvents.toggledFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
    })),
    on(userApiEvents.delete, (_, state) => ({
      ...state,
      loading: true,
    })),
    on(userApiEvents.deletedSuccess, ({ payload: userId }, state) => ({
      ...state,
      users: state.users.filter((u) => u.id !== userId),
      loading: false,
    })),
    on(userApiEvents.deletedFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
    })),
  ),
  withEffects((_state, events = inject(Events), service = inject(UsersService)) => ({
    loadUsers$: events.on(userApiEvents.load).pipe(
      switchMap(() =>
        service.getUsers().pipe(
          mapResponse({
            next: (users) => userApiEvents.loadedSuccess(users),
            error: (error: HttpErrorResponse) => {
              const errorMessage = (error.error as IError)?.message || 'Failed to load users';
              return userApiEvents.loadedFailure(errorMessage);
            },
          }),
        ),
      ),
    ),
    toggleActive$: events.on(userApiEvents.toggleActive).pipe(
      switchMap(({ payload: userId }) =>
        service.toggleActive(userId).pipe(
          mapResponse({
            next: (user) => userApiEvents.toggledSuccess(user),
            error: (error: HttpErrorResponse) => {
              const errorMessage =
                (error.error as IError)?.message || 'Failed to toggle user status';
              return userApiEvents.toggledFailure(errorMessage);
            },
          }),
        ),
      ),
    ),
    deleteUser$: events.on(userApiEvents.delete).pipe(
      switchMap(({ payload: userId }) =>
        service.deleteUser(userId).pipe(
          mapResponse({
            next: () => userApiEvents.deletedSuccess(userId),
            error: (error: HttpErrorResponse) => {
              const errorMessage = (error.error as IError)?.message || 'Failed to delete user';
              return userApiEvents.deletedFailure(errorMessage);
            },
          }),
        ),
      ),
    ),
  })),
);
