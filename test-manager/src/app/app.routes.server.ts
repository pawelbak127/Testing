import { RenderMode, ServerRoute } from '@angular/ssr';
import { routes } from './app.routes';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'test-cases/edit/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'test-cases/view/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'test-runs/details/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'test-runs/execute/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
