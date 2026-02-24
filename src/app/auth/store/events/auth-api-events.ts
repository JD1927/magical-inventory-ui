import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const registerPasskeyApiEvents = eventGroup({
  source: 'Register Passkey API',
  events: {
    register: type<string>(), // email
    registeredSuccess: type<void>(),
    registeredFailure: type<string>(),
  },
});

export const loginPasskeyApiEvents = eventGroup({
  source: 'Login Passkey API',
  events: {
    login: type<string>(), // email
    loggedInSuccess: type<{ accessToken: string }>(),
    loggedInFailure: type<string>(),
  },
});
