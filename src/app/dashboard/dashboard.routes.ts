import type { Routes } from '@angular/router';
import { DashboardLayout } from './dashboard-layout/dashboard-layout';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardLayout,
    children: [
      {
        path: 'home',
        data: { label: 'Home' },
        loadComponent: () => import('./home-page/home-page').then((m) => m.HomePage),
      },
      {
        path: 'products',
        data: { label: 'Products' },
        loadChildren: () => import('../products/products.routes').then((m) => m.PRODUCT_ROUTES),
      },
      {
        path: 'categories',
        data: { label: 'Categories' },
        loadChildren: () => import('../categories/categories.routes').then((m) => m.ROUTES),
      },
      {
        path: 'suppliers',
        data: { label: 'Suppliers' },
        loadChildren: () => import('../suppliers/suppliers.routes').then((m) => m.ROUTES),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard/home',
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/dashboard',
  },
];
