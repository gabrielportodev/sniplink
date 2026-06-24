import { Routes } from '@angular/router';

import { authGuard } from 'src/app/core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('src/app/features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('src/app/features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('src/app/features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'analytics/:shortCode',
    canActivate: [authGuard],
    loadComponent: () =>
      import('src/app/features/analytics/analytics.component').then((m) => m.AnalyticsComponent),
  },
  { path: '**', redirectTo: '' },
];
