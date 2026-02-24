import { inject } from '@angular/core';
import type { IError } from '@app/common/models';
import { AuthService } from '@app/core/auth/auth.service';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import { loginPasskeyApiEvents } from './events/auth-api-events';

interface LoginPasskeyState {
  loading: boolean;
  errorMessage: string | null;
}

const initialState: LoginPasskeyState = {
  loading: false,
  errorMessage: null,
};

export const LoginPasskeyStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(loginPasskeyApiEvents.login, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
    })),
    on(loginPasskeyApiEvents.loggedInSuccess, (_, state) => ({
      ...state,
      loading: false,
      errorMessage: null,
    })),
    on(loginPasskeyApiEvents.loggedInFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
    })),
  ),
  withEffects((_state, events = inject(Events), authService = inject(AuthService)) => ({
    login$: events.on(loginPasskeyApiEvents.login).pipe(
      switchMap(({ payload: email }) => {
        return authService.login(email).pipe(
          mapResponse({
            next: () => {
              return loginPasskeyApiEvents.loggedInSuccess({
                accessToken: authService.token!,
              });
            },
            error: (error: any) => {
              const errorMessage: string =
                (error?.error as IError)?.message || error?.message || 'Failed to authenticate';
              return loginPasskeyApiEvents.loggedInFailure(errorMessage);
            },
          }),
        );
      }),
    ),
  })),
);
