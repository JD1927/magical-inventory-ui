import { inject } from '@angular/core';
import type { IError } from '@app/common/models';
import { AuthService } from '@app/core/auth/auth.service';
import { mapResponse } from '@ngrx/operators';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import { registerPasskeyApiEvents } from './events/auth-api-events';

interface RegisterPasskeyState {
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: RegisterPasskeyState = {
  loading: false,
  successMessage: null,
  errorMessage: null,
};

export const RegisterPasskeyStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withReducer(
    on(registerPasskeyApiEvents.register, (_, state) => ({
      ...state,
      loading: true,
      errorMessage: null,
      successMessage: null,
    })),
    on(registerPasskeyApiEvents.registeredSuccess, (_, state) => ({
      ...state,
      loading: false,
      errorMessage: null,
      successMessage: 'Passkey registered! You can now log in.',
    })),
    on(registerPasskeyApiEvents.registeredFailure, ({ payload: errorMessage }, state) => ({
      ...state,
      loading: false,
      errorMessage,
      successMessage: null,
    })),
  ),
  withEffects((_state, events = inject(Events), authService = inject(AuthService)) => ({
    register$: events.on(registerPasskeyApiEvents.register).pipe(
      switchMap(({ payload: email }) => {
        return authService.register(email).pipe(
          mapResponse({
            next: () => registerPasskeyApiEvents.registeredSuccess(),
            error: (error: any) => {
              const errorMessage: string =
                (error?.error as IError)?.message || error?.message || 'Failed to register passkey';
              return registerPasskeyApiEvents.registeredFailure(errorMessage);
            },
          }),
        );
      }),
    ),
  })),
);
