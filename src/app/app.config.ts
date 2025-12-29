import { provideHttpClient } from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { APP_ROUTES } from './app.routes';
import { Noir } from './preset.prime';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(),
    // Added for PrimeNG
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: Noir,
        options: {
          darkModeSelector: '.magical-inventory-ui-dark',
          zIndex: {},
        },
      },
      zIndex: {
        modal: 1100, // dialog, sidebar
        overlay: 1000, // dropdown, overlaypanel
        menu: 1000, // overlay menus
        tooltip: 1100, // tooltip
      },
      inputVariant: 'outlined',
      ripple: false,
    }),
  ],
};
