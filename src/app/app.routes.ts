import type { Routes } from '@angular/router';
import { PrimeIcons } from 'primeng/api';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard',
  },
  {
    path: 'dashboard',
    data: { icon: PrimeIcons.HOME },
    loadChildren: () => import('./dashboard/dashboard.routes').then((r) => r.DASHBOARD_ROUTES),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/dashboard',
  },
];
