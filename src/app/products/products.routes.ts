import type { Routes } from '@angular/router';
import { ProductsPage } from './products-page/products-page';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    component: ProductsPage,
    children: [
      {
        path: 'list',
        data: { label: 'List' },
        loadComponent: () =>
          import('./pages/product-list-page/product-list-page').then((m) => m.ProductListPage),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard/products/list',
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/dashboard/products/list',
  },
];
