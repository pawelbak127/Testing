import { RenderMode, ServerRoute } from '@angular/ssr';
import { routes } from './app.routes';

// Zdefiniuj dokładnie takie same ścieżki jak w app.routes.ts, ale z odpowiednim RenderMode
export const serverRoutes: ServerRoute[] = [
  // Dynamiczne trasy z parametrami - renderowane po stronie klienta
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
    path: 'reports/generate',
    renderMode: RenderMode.Client
  },
  
  // Dla wszystkich innych tras używamy Prerender
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
