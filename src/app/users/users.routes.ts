import type { Routes } from '@angular/router';
import { UsersPage } from './pages/users-page/users-page';

export const ROUTES: Routes = [
  {
    path: '',
    component: UsersPage,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];
