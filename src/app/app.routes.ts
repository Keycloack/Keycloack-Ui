import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { Dashboard } from './features/dashboard/dashboard';

export const routes: Routes = [
  {
    path: 'login',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];