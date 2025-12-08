import type { Routes } from '@angular/router';
import { InventoryPage } from './pages/inventory-page/inventory-page';

export const ROUTES: Routes = [
  {
    path: '',
    component: InventoryPage,
    children: [
      {
        path: 'list',
        data: { label: 'List' },
        loadComponent: () =>
          import('./pages/inventory-list-page/inventory-list-page').then(
            (m) => m.InventoryListPage,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard/inventory/list',
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/dashboard/inventory/list',
  },
];
