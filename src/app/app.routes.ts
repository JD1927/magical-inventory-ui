import type { Routes } from '@angular/router';
import { PrimeIcons } from 'primeng/api';
import { authGuard } from './core/guards/auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard',
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then((c) => c.Login),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    data: { icon: PrimeIcons.HOME },
    loadChildren: () => import('./dashboard/dashboard.routes').then((r) => r.DASHBOARD_ROUTES),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/dashboard',
  },
];
