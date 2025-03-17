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
    path: 'test-cases/create',
    loadComponent: () => import('./features/test-cases/test-case-form.component').then(m => m.TestCaseFormComponent)
  },
  {
    path: 'test-cases/edit/:id',
    loadComponent: () => import('./features/test-cases/test-case-form.component').then(m => m.TestCaseFormComponent)
  },
  {
    path: 'test-cases/view/:id',
    loadComponent: () => import('./features/test-cases/test-case-detail.component').then(m => m.TestCaseDetailComponent)
  },
  {
    path: 'test-runs',
    loadComponent: () => import('./features/test-runs/test-runs.component').then(m => m.TestRunsComponent)
  },
  {
    path: 'test-runs/create',
    loadComponent: () => import('./features/test-runs/test-run-create.component').then(m => m.TestRunCreateComponent)
  },
  {
    path: 'test-runs/details/:id',
    loadComponent: () => import('./features/test-runs/test-run-detail.component').then(m => m.TestRunDetailComponent)
  },
  {
    path: 'test-runs/execute/:id',
    loadComponent: () => import('./features/test-runs/test-execution.component').then(m => m.TestExecutionComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
  },
  {
    path: 'reports/generate',
    loadComponent: () => import('./features/reports/report-generator.component').then(m => m.ReportGeneratorComponent)
  },
  {
    path: 'analytics',
    loadComponent: () => import('./features/analytics/test-analytics.component').then(m => m.TestAnalyticsComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/user-profile.component').then(m => m.UserProfileComponent)
  },
  {
    path: 'settings/project',
    loadComponent: () => import('./features/settings/project-settings.component').then(m => m.ProjectSettingsComponent)
  },
  // Trasa fallback dla niedopasowanych ścieżek
  { path: '**', redirectTo: '/dashboard' }
];
