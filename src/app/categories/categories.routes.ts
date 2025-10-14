import type { Routes } from '@angular/router';
import { CategoriesPage } from './pages/categories-page/categories-page';

export const ROUTES: Routes = [
  {
    path: '',
    component: CategoriesPage,
    children: [
      {
        path: 'list',
        data: { label: 'List' },
        loadComponent: () =>
          import('./pages/category-list-page/category-list-page').then((m) => m.CategoryListPage),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard/categories/list',
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/dashboard/categories/list',
  },
];
