import type { Routes } from '@angular/router';
import { SuppliersPage } from './pages/suppliers-page/suppliers-page';

export const ROUTES: Routes = [
  {
    path: '',
    component: SuppliersPage,
    children: [
      {
        path: 'list',
        data: { label: 'List' },
        loadComponent: () =>
          import('./pages/supplier-list-page/supplier-list-page').then((m) => m.SupplierListPage),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard/suppliers/list',
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/dashboard/suppliers/list',
  },
];
