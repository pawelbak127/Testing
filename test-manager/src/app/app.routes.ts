import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'test-cases', 
    loadComponent: () => import('./features/test-cases/test-cases.component').then(m => m.TestCasesComponent) 
  },
  { 
    path: 'test-runs', 
    loadComponent: () => import('./features/test-runs/test-runs.component').then(m => m.TestRunsComponent) 
  },
  { 
    path: 'reports', 
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent) 
  }
];
