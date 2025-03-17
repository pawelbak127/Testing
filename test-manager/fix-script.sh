#!/bin/bash

# Skrypt naprawczy dla aplikacji Test Manager
# Autor: Claude
# Data: 17.03.2025

echo "Rozpoczynam naprawę aplikacji Test Manager..."

# Tworzymy katalog na backupy
mkdir -p ./backups

# 1. Naprawa komponentu AppComponent
echo "Naprawianie app.component.ts..."
cat > ./backups/app.component.ts.bak << EOF
$(cat ./src/app/app.component.ts)
EOF

cat > ./src/app/app.component.ts << 'EOF'
import { Component, signal, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    NavigationComponent,
    SidebarComponent
  ],
  template: `
    <div class="app-container">
      <app-navigation (sidebarToggled)="toggleSidenav()"></app-navigation>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav [opened]="sidenavOpened()" mode="side" class="app-sidenav">
          <app-sidebar></app-sidebar>
        </mat-sidenav>

        <mat-sidenav-content class="sidenav-content-container">
          <div class="main-content">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .sidenav-container {
      flex: 1;
      margin-top: 64px; // Height of toolbar
    }

    .main-content {
      padding: 24px;
    }

    .app-sidenav {
      width: 240px;
    }
  `]
})
export class AppComponent implements OnInit {
  sidenavOpened = signal(true);

  constructor(
    public themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Responsive sidenav behavior
      this.handleResponsiveSidenav();
    }
  }

  toggleSidenav() {
    this.sidenavOpened.update(value => !value);
  }

  private handleResponsiveSidenav() {
    // Close sidenav on small screens by default
    const checkWidth = () => {
      if (window.innerWidth < 768 && this.sidenavOpened()) {
        this.sidenavOpened.set(false);
      } else if (window.innerWidth >= 768 && !this.sidenavOpened()) {
        this.sidenavOpened.set(true);
      }
    };

    // Check on init
    checkWidth();

    // Listen for resize events
    window.addEventListener('resize', checkWidth);
  }
}
EOF

# 2. Naprawa komponentu SidebarComponent
echo "Naprawianie sidebar.component.ts..."
cat > ./backups/sidebar.component.ts.bak << EOF
$(cat ./src/app/shared/components/sidebar/sidebar.component.ts)
EOF

cat > ./src/app/shared/components/sidebar/sidebar.component.ts << 'EOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProjectService, Project } from '../../../core/services/project.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatExpansionModule,
    MatTooltipModule,
    MatMenuModule
  ],
  template: `
    <div class="sidenav-content">
      <div class="action-buttons">
        <button mat-flat-button color="primary" class="create-test-button" [matMenuTriggerFor]="createMenu">
          <mat-icon>add</mat-icon>
          <span>Utwórz</span>
        </button>

        <mat-menu #createMenu="matMenu">
          <button mat-menu-item routerLink="/test-cases/create">
            <mat-icon>note_add</mat-icon>
            <span>Nowy przypadek testowy</span>
          </button>
          <button mat-menu-item routerLink="/test-runs/create">
            <mat-icon>play_circle</mat-icon>
            <span>Nowe wykonanie testów</span>
          </button>
          <button mat-menu-item routerLink="/reports/generate">
            <mat-icon>assessment</mat-icon>
            <span>Nowy raport</span>
          </button>
        </mat-menu>
      </div>

      <mat-nav-list>
        <h3 mat-subheader>Główne widoki</h3>

        <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
          <mat-icon matListItemIcon>dashboard</mat-icon>
          <span>Dashboard</span>
        </a>

        <a mat-list-item routerLink="/test-cases" routerLinkActive="active-link">
          <mat-icon matListItemIcon>fact_check</mat-icon>
          <span>Przypadki testowe</span>
        </a>

        <a mat-list-item routerLink="/test-runs" routerLinkActive="active-link">
          <mat-icon matListItemIcon>play_circle</mat-icon>
          <span>Wykonania testów</span>
        </a>

        <a mat-list-item routerLink="/reports" routerLinkActive="active-link">
          <mat-icon matListItemIcon>assessment</mat-icon>
          <span>Raporty</span>
        </a>

        <a mat-list-item routerLink="/analytics" routerLinkActive="active-link">
          <mat-icon matListItemIcon>insights</mat-icon>
          <span>Analityka</span>
        </a>

        <mat-divider></mat-divider>

        <h3 mat-subheader>Projekty</h3>

        <mat-accordion class="projects-accordion">
          <mat-expansion-panel [expanded]="true">
            <mat-expansion-panel-header>
              <mat-panel-title>
                <div class="panel-title-content">
                  <mat-icon>folder</mat-icon>
                  <span>Moje projekty</span>
                </div>
              </mat-panel-title>
            </mat-expansion-panel-header>

            <div class="project-list">
              <a mat-list-item *ngFor="let project of projects" class="project-item"
                 [ngClass]="{'active': project.id === activeProject}"
                 (click)="selectProject(project.id)">
                <div class="project-color-indicator" [ngClass]="project.color"></div>
                <span>{{ project.name }}</span>
              </a>

              <a mat-list-item routerLink="/settings/project" class="add-project-link">
                <mat-icon>add</mat-icon>
                <span>Dodaj projekt</span>
              </a>
            </div>
          </mat-expansion-panel>
        </mat-accordion>

        <mat-divider></mat-divider>

        <h3 mat-subheader>Widoki</h3>

        <a mat-list-item>
          <mat-icon matListItemIcon>schedule</mat-icon>
          <span>Ostatnio aktywne</span>
        </a>

        <a mat-list-item>
          <mat-icon matListItemIcon>favorite</mat-icon>
          <span>Ulubione</span>
        </a>

        <a mat-list-item>
          <mat-icon matListItemIcon>star</mat-icon>
          <span>Ważne</span>
        </a>

        <a mat-list-item>
          <mat-icon matListItemIcon>assignment_late</mat-icon>
          <span>Do zrobienia</span>
          <div class="badge accent">5</div>
        </a>

        <a mat-list-item>
          <mat-icon matListItemIcon>delete</mat-icon>
          <span>Kosz</span>
        </a>
      </mat-nav-list>
    </div>

    <div class="sidenav-footer">
      <a mat-list-item routerLink="/profile">
        <mat-icon matListItemIcon>person</mat-icon>
        <span>Profil</span>
      </a>

      <a mat-list-item routerLink="/settings/project">
        <mat-icon matListItemIcon>settings</mat-icon>
        <span>Ustawienia</span>
      </a>

      <a mat-list-item matTooltip="Pomoc i wsparcie">
        <mat-icon matListItemIcon>help</mat-icon>
        <span>Pomoc</span>
      </a>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .sidenav-content {
      flex: 1;
      overflow-y: auto;
    }

    .action-buttons {
      padding: 16px;

      .create-test-button {
        width: 100%;
      }
    }

    .projects-accordion {
      ::ng-deep .mat-expansion-panel {
        box-shadow: none;
        background: transparent;

        .mat-expansion-panel-header {
          padding: 0 16px;

          .panel-title-content {
            display: flex;
            align-items: center;

            mat-icon {
              margin-right: 16px;
            }
          }
        }

        .mat-expansion-panel-body {
          padding: 0;
        }
      }

      .project-list {
        .project-item {
          display: flex;
          align-items: center;
          padding-left: 48px;

          .project-color-indicator {
            width: 4px;
            height: 24px;
            border-radius: 4px;
            margin-right: 12px;

            &.green {
              background-color: #4caf50;
            }

            &.purple {
              background-color: #9c27b0;
            }

            &.blue {
              background-color: #2196f3;
            }

            &.orange {
              background-color: #ff9800;
            }

            &.red {
              background-color: #f44336;
            }
          }

          &.active {
            background-color: rgba(0, 0, 0, 0.04);

            .dark-theme & {
              background-color: rgba(255, 255, 255, 0.08);
            }
          }
        }

        .add-project-link {
          color: var(--text-secondary);
          font-style: italic;
          padding-left: 48px;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
            margin-right: 12px;
          }
        }
      }
    }

    .badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 10px;
      font-size: 12px;
      margin-left: 8px;

      &.primary {
        background-color: #3f51b5;
        color: white;
      }

      &.accent {
        background-color: #ff4081;
        color: white;
      }

      &.warn {
        background-color: #f44336;
        color: white;
      }
    }

    a.active-link {
      background-color: rgba(0, 0, 0, 0.04);

      .dark-theme & {
        background-color: rgba(255, 255, 255, 0.08);
      }
    }

    .sidenav-footer {
      border-top: 1px solid rgba(0, 0, 0, 0.12);

      .dark-theme & {
        border-top-color: rgba(255, 255, 255, 0.12);
      }
    }
  `]
})
export class SidebarComponent {
  projects: Project[] = [];
  activeProject: string | null = null;

  constructor(private projectService: ProjectService) {
    this.projectService.projects$.subscribe(projects => {
      this.projects = projects;
    });

    this.projectService.selectedProject$.subscribe(project => {
      this.activeProject = project?.id || null;
    });
  }

  selectProject(projectId: string) {
    this.projectService.selectProject(projectId);
  }
}
EOF

# 3. Naprawa komponentu StatusChipComponent
echo "Naprawianie status-chip.component.ts..."
cat > ./backups/status-chip.component.ts.bak << EOF
$(cat ./src/app/shared/ui/status-chip/status-chip.component.ts)
EOF

cat > ./src/app/shared/ui/status-chip/status-chip.component.ts << 'EOF'
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="status-chip" [ngClass]="colorClass">
      {{ text }}
    </div>
  `,
  styles: [`
    .status-chip {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .status-chip.primary {
      background-color: rgba(63, 81, 181, 0.1);
      color: var(--primary);
    }
    
    .status-chip.accent {
      background-color: rgba(255, 152, 0, 0.1);
      color: var(--warning);
    }
    
    .status-chip.warn {
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--warn);
    }
    
    .status-chip.success {
      background-color: rgba(76, 175, 80, 0.1);
      color: var(--success);
    }
    
    .status-chip.default {
      background-color: rgba(0, 0, 0, 0.1);
      color: var(--text-secondary);
    }
  `]
})
export class StatusChipComponent {
  @Input() text = '';
  @Input() color: string = 'default';

  get colorClass(): string {
    // Allowed color classes
    const allowedColors = ['primary', 'accent', 'warn', 'success', 'default'];
    return allowedColors.includes(this.color) ? this.color : 'default';
  }
}
EOF

# 4. Naprawa komponentu MetricCardComponent
echo "Naprawianie metric-card.component.ts..."
cat > ./backups/metric-card.component.ts.bak << EOF
$(cat ./src/app/shared/ui/metric-card/metric-card.component.ts)
EOF

cat > ./src/app/shared/ui/metric-card/metric-card.component.ts << 'EOF'
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <mat-card class="metric-card">
      <mat-card-content>
        <div class="metric-content">
          <div class="metric-info">
            <div class="metric-label">{{ label }}</div>
            <div class="metric-value">{{ value }}</div>
            <div class="metric-change" [ngClass]="changeType">
              <span>{{ change }}</span> {{ changeLabel }}
            </div>
          </div>
          <div class="metric-icon" [ngClass]="color">
            <mat-icon>{{ icon }}</mat-icon>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .metric-card {
      .metric-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      
      .metric-info {
        .metric-label {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        
        .metric-value {
          font-size: 28px;
          font-weight: 500;
          margin-bottom: 8px;
        }
        
        .metric-change {
          font-size: 14px;
          color: var(--text-secondary);
          
          span {
            font-weight: 500;
          }
          
          &.positive span {
            color: var(--success-color);
          }
          
          &.negative span {
            color: var(--warn-color);
          }
        }
      }
      
      .metric-icon {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.blue {
          background-color: rgba(63, 81, 181, 0.1);
          color: #3f51b5;
        }
        
        &.red {
          background-color: rgba(244, 67, 54, 0.1);
          color: #f44336;
        }
        
        &.purple {
          background-color: rgba(156, 39, 176, 0.1);
          color: #9c27b0;
        }
        
        &.green {
          background-color: rgba(76, 175, 80, 0.1);
          color: #4caf50;
        }
      }
    }
  `]
})
export class MetricCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() change = '';
  @Input() changeLabel = '';
  @Input() changeType: 'positive' | 'negative' | 'neutral' = 'neutral';
  @Input() icon = 'insights';
  @Input() color: 'blue' | 'red' | 'purple' | 'green' = 'blue';
}
EOF

# 5. Naprawa routingu
echo "Naprawianie app.routes.ts..."
cat > ./backups/app.routes.ts.bak << EOF
$(cat ./src/app/app.routes.ts)
EOF

cat > ./src/app/app.routes.ts << 'EOF'
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
  // Fallback route for unmatched paths
  { path: '**', redirectTo: '/dashboard' }
];
EOF

# 6. Naprawa routingu dla routera serwerowego
echo "Naprawianie app.routes.server.ts..."
cat > ./backups/app.routes.server.ts.bak << EOF
$(cat ./src/app/app.routes.server.ts)
EOF

cat > ./src/app/app.routes.server.ts << 'EOF'
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
EOF

# 7. Naprawa komponentu DashboardComponent
echo "Naprawianie dashboard.component.ts..."
cat > ./backups/dashboard.component.ts.bak << EOF
$(cat ./src/app/features/dashboard/dashboard.component.ts)
EOF

cat > ./src/app/features/dashboard/dashboard.component.ts << 'EOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MetricCardComponent } from '../../shared/ui/metric-card/metric-card.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { TestStatusChartComponent } from './components/test-status-chart/test-status-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MetricCardComponent,
    PageHeaderComponent,
    TestStatusChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  timeRangeOptions = ['Ostatnie 7 dni', 'Ostatnie 30 dni', 'Ten kwartał'];
  selectedTimeRange = 'Ostatnie 7 dni';
  
  recentTests = [
    { 
      name: 'Logowanie użytkownika', 
      status: 'success', 
      project: 'Portal klienta', 
      time: '2 godz. temu' 
    },
    { 
      name: 'Rejestracja konta', 
      status: 'error', 
      project: 'Portal klienta', 
      time: '3 godz. temu' 
    },
    { 
      name: 'Wyszukiwanie produktów', 
      status: 'success', 
      project: 'Aplikacja mobilna', 
      time: '4 godz. temu' 
    },
    { 
      name: 'Realizacja zamówienia', 
      status: 'in-progress', 
      project: 'Portal klienta', 
      time: '6 godz. temu' 
    }
  ];
}
EOF

# 8. Naprawa komponentu DashboardComponent HTML
echo "Naprawianie dashboard.component.html..."
cat > ./backups/dashboard.component.html.bak << EOF
$(cat ./src/app/features/dashboard/dashboard.component.html)
EOF

cat > ./src/app/features/dashboard/dashboard.component.html << 'EOF'
<div class="dashboard-container">
  <app-page-header title="Dashboard">
    <button mat-stroked-button class="filter-button">
      <mat-icon>filter_list</mat-icon>
      <span>Filtry</span>
    </button>

    <div class="view-toggle">
      <button mat-icon-button class="view-toggle-button active">
        <mat-icon>grid_view</mat-icon>
      </button>
      <button mat-icon-button class="view-toggle-button">
        <mat-icon>view_list</mat-icon>
      </button>
    </div>
  </app-page-header>

  <div class="metrics-cards">
    <app-metric-card
      label="Wykonane testy"
      value="1,234"
      change="+12%"
      changeLabel="od zeszłego tygodnia"
      changeType="positive"
      icon="check_circle"
      color="blue">
    </app-metric-card>

    <app-metric-card
      label="Błędy"
      value="45"
      change="+5%"
      changeLabel="od zeszłego tygodnia"
      changeType="negative"
      icon="error"
      color="red">
    </app-metric-card>

    <app-metric-card
      label="Czas testowania"
      value="87.5h"
      change="-3%"
      changeLabel="od zeszłego tygodnia"
      changeType="positive"
      icon="schedule"
      color="purple">
    </app-metric-card>

    <app-metric-card
      label="Skuteczność"
      value="92.3%"
      change="+2.3%"
      changeLabel="od zeszłego tygodnia"
      changeType="positive"
      icon="bar_chart"
      color="green">
    </app-metric-card>
  </div>

  <div class="charts-container">
    <mat-card class="chart-card large">
      <mat-card-content>
        <app-test-status-chart></app-test-status-chart>
      </mat-card-content>
    </mat-card>

    <mat-card class="chart-card">
      <mat-card-content>
        <div class="chart-header">
          <h2 class="chart-title">Najnowsze testy</h2>
          <a class="see-all-link" mat-button routerLink="/test-runs">Zobacz wszystkie</a>
        </div>

        <div class="recent-tests-list">
          <mat-card *ngFor="let test of recentTests" class="recent-test-item">
            <div class="test-header">
              <span class="test-name">{{ test.name }}</span>
              <span class="test-status" [ngClass]="test.status">
                {{ test.status === 'success' ? 'Sukces' : 
                   test.status === 'error' ? 'Błąd' : 'W toku' }}
              </span>
            </div>
            <div class="test-details">
              {{ test.project }} • {{ test.time }}
            </div>
          </mat-card>
        </div>
      </mat-card-content>
    </mat-card>
  </div>
</div>
EOF

# 9. Naprawa routingu komponentów
echo "Naprawianie TestRunsComponent..."
cat > ./backups/test-runs.component.html.bak << EOF
$(cat ./src/app/features/test-runs/test-runs.component.html)
EOF

cat > ./src/app/features/test-runs/test-runs.component.html << 'EOF'
<div class="test-runs-container">
  <app-page-header title="Wykonania testów">
    <button mat-flat-button color="primary" routerLink="/test-runs/create">
      <mat-icon>add</mat-icon>
      <span>Nowe wykonanie</span>
    </button>
  </app-page-header>
  
  <div class="test-runs-grid">
    <mat-card class="test-runs-card">
      <mat-card-header>
        <mat-card-title>Testy w toku</mat-card-title>
        <div class="header-badge accent">{{ activeRuns.length }} aktywne</div>
      </mat-card-header>
      
      <mat-card-content>
        <mat-accordion>
          <mat-expansion-panel *ngFor="let run of activeRuns" [expanded]="run.id === 'TR-007'">
            <mat-expansion-panel-header>
              <mat-panel-title>
                {{ run.id }}: {{ run.name }}
              </mat-panel-title>
            </mat-expansion-panel-header>
            
            <div class="test-run-details">
              <div class="project-name">{{ run.project }}</div>
              
              <div class="progress-container">
                <div class="progress-label">Postęp:</div>
                <mat-progress-bar mode="determinate" [value]="run.progress?.percentage"></mat-progress-bar>
                <div class="progress-stats">{{ run.progress?.current }}/{{ run.progress?.total }}</div>
              </div>
              
              <div class="actions">
                <button mat-stroked-button color="primary" [routerLink]="['/test-runs/execute', run.id]">Kontynuuj</button>
                <button mat-button [routerLink]="['/test-runs/details', run.id]">Szczegóły</button>
              </div>
            </div>
          </mat-expansion-panel>
        </mat-accordion>
      </mat-card-content>
    </mat-card>
    
    <mat-card class="test-runs-card">
      <mat-card-header>
        <mat-card-title>Ukończone testy</mat-card-title>
        <div class="header-badge success">{{ completedRuns.length }} ukończone</div>
      </mat-card-header>
      
      <mat-card-content>
        <mat-accordion>
          <mat-expansion-panel *ngFor="let run of completedRuns">
            <mat-expansion-panel-header>
              <mat-panel-title>
                {{ run.id }}: {{ run.name }}
              </mat-panel-title>
            </mat-expansion-panel-header>
            
            <div class="test-run-details">
              <div class="project-name">{{ run.project }}</div>
              
              <div class="results-container">
                <app-status-chip 
                  [text]="run.results?.success + ' sukcesów'" 
                  color="success">
                </app-status-chip>
                
                <app-status-chip 
                  [text]="run.results?.errors + ' błędów'" 
                  color="warn">
                </app-status-chip>
              </div>
              
              <div class="actions">
                <button mat-stroked-button color="primary" [routerLink]="['/reports/generate']" [queryParams]="{testRunId: run.id}">Raport</button>
                <button mat-button [routerLink]="['/test-runs/details', run.id]">Szczegóły</button>
              </div>
            </div>
          </mat-expansion-panel>
        </mat-accordion>
      </mat-card-content>
    </mat-card>
    
    <mat-card class="test-runs-card">
      <mat-card-header>
        <mat-card-title>Zaplanowane testy</mat-card-title>
        <div class="header-badge primary">{{ scheduledRuns.length }} zaplanowane</div>
      </mat-card-header>
      
      <mat-card-content>
        <mat-accordion>
          <mat-expansion-panel *ngFor="let run of scheduledRuns">
            <mat-expansion-panel-header>
              <mat-panel-title>
                {{ run.id }}: {{ run.name }}
              </mat-panel-title>
            </mat-expansion-panel-header>
            
            <div class="test-run-details">
              <div class="project-name">{{ run.project }}</div>
              
              <div class="schedule-container">
                <div class="schedule-label">Start:</div>
                <div>{{ run.date }}</div>
              </div>
              
              <div class="actions">
                <button mat-stroked-button color="primary" [routerLink]="['/test-runs/edit', run.id]">Edytuj</button>
                <button mat-button [routerLink]="['/test-runs/details', run.id]">Szczegóły</button>
              </div>
            </div>
          </mat-expansion-panel>
        </mat-accordion>
      </mat-card-content>
    </mat-card>
  </div>
</div>
EOF

# 10. Dodawanie RouterModule do TestRunsComponent
echo "Dodawanie RouterModule do TestRunsComponent..."
cat > ./backups/test-runs.component.ts.bak << EOF
$(cat ./src/app/features/test-runs/test-runs.component.ts)
EOF

cat > ./src/app/features/test-runs/test-runs.component.ts << 'EOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatusChipComponent } from '../../shared/ui/status-chip/status-chip.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { TestRun } from '../../core/models/test-run.model';

@Component({
  selector: 'app-test-runs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    StatusChipComponent,
    PageHeaderComponent
  ],
  templateUrl: './test-runs.component.html',
  styleUrls: ['./test-runs.component.scss']
})
export class TestRunsComponent {
  activeRuns: TestRun[] = [
    {
      id: 'TR-007',
      name: 'Testy modułu płatności',
      project: 'Portal klienta',
      progress: { current: 15, total: 20, percentage: 75 }
    },
    {
      id: 'TR-008',
      name: 'Testy wydajnościowe API',
      project: 'Backend API',
      progress: { current: 6, total: 20, percentage: 30 }
    }
  ];
  
  completedRuns: TestRun[] = [
    {
      id: 'TR-006',
      name: 'Testy interfejsu użytkownika',
      project: 'Portal klienta',
      results: { success: 18, errors: 2 }
    },
    {
      id: 'TR-005',
      name: 'Testy funkcjonalności wyszukiwania',
      project: 'Aplikacja mobilna',
      results: { success: 15, errors: 0 }
    },
    {
      id: 'TR-004',
      name: 'Testy bezpieczeństwa',
      project: 'Backend API',
      results: { success: 12, errors: 3 }
    }
  ];
  
  scheduledRuns: TestRun[] = [
    {
      id: 'TR-009',
      name: 'Testy integracji z API płatności',
      project: 'Portal klienta',
      date: '15 mar 2025'
    },
    {
      id: 'TR-010',
      name: 'Testy kompatybilności mobilnej',
      project: 'Aplikacja mobilna',
      date: '18 mar 2025'
    }
  ];
}
EOF

# 11. Naprawianie komponentu ReportsComponent
echo "Dodawanie RouterModule do ReportsComponent..."
cat > ./backups/reports.component.ts.bak << EOF
$(cat ./src/app/features/reports/reports.component.ts)
EOF

cat > ./src/app/features/reports/reports.component.ts << 'EOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { Report } from '../../core/models/report.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  reports: Report[] = [
    {
      title: 'Raport wydajności tygodniowy',
      project: 'Wszystkie projekty',
      date: '10 mar 2025',
      icon: 'bar_chart',
      color: 'primary'
    },
    {
      title: 'Raport defektów',
      project: 'Portal klienta',
      date: '9 mar 2025',
      icon: 'error',
      color: 'warn'
    },
    {
      title: 'Raport pokrycia testami',
      project: 'Backend API',
      date: '8 mar 2025',
      icon: 'check_circle',
      color: 'success'
    },
    {
      title: 'Raport wydajności miesięczny',
      project: 'Wszystkie projekty',
      date: '5 mar 2025',
      icon: 'bar_chart',
      color: 'primary'
    },
    {
      title: 'Raport czasu wykonania testów',
      project: 'Aplikacja mobilna',
      date: '3 mar 2025',
      icon: 'schedule',
      color: 'purple'
    },
    {
      title: 'Raport regresji',
      project: 'Portal klienta',
      date: '1 mar 2025',
      icon: 'trending_up',
      color: 'accent'
    }
  ];
}
EOF

# 12. Naprawianie komponentu ReportsComponent HTML
echo "Naprawianie ReportsComponent HTML..."
cat > ./backups/reports.component.html.bak << EOF
$(cat ./src/app/features/reports/reports.component.html)
EOF

cat > ./src/app/features/reports/reports.component.html << 'EOF'
<div class="reports-container">
  <app-page-header title="Raporty">
    <button mat-flat-button color="primary" routerLink="/reports/generate">
      <mat-icon>add</mat-icon>
      <span>Generuj raport</span>
    </button>
  </app-page-header>
  
  <div class="reports-grid">
    <mat-card *ngFor="let report of reports" class="report-card" [routerLink]="['/reports', 'view']">
      <mat-card-content>
        <div class="report-content">
          <div class="report-info">
            <h3 class="report-title">{{ report.title }}</h3>
            <p class="report-project">{{ report.project }}</p>
            <p class="report-date">Wygenerowany: {{ report.date }}</p>
          </div>
          
          <div class="report-icon" [ngClass]="report.color">
            <mat-icon>{{ report.icon }}</mat-icon>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  </div>
</div>
EOF

# 13. Naprawianie komponentu TestCasesComponent
echo "Dodawanie RouterModule do TestCasesComponent..."
cat > ./backups/test-cases.component.ts.bak << EOF
$(cat ./src/app/features/test-cases/test-cases.component.ts)
EOF

cat > ./src/app/features/test-cases/test-cases.component.ts << 'EOF'
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatusChipComponent } from '../../shared/ui/status-chip/status-chip.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { TestCase } from '../../core/models/test-case.model';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-test-cases',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    StatusChipComponent,
    PageHeaderComponent
  ],
  templateUrl: './test-cases.component.html',
  styleUrls: ['./test-cases.component.scss']
})
export class TestCasesComponent {
  displayedColumns: string[] = ['id', 'name', 'project', 'priority', 'author', 'creationDate', 'status'];
  dataSource = new MatTableDataSource<TestCase>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  projects = ['Wszystkie projekty', 'Portal klienta', 'Aplikacja mobilna', 'Backend API'];
  selectedProject = 'Wszystkie projekty';
  
  constructor(private apiService: ApiService) {}
  
  ngOnInit() {
    this.apiService.getTestCases().subscribe(testCases => {
      this.dataSource.data = testCases;
    });
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
EOF

# 14. Naprawianie TestCasesComponent HTML
echo "Naprawianie TestCasesComponent HTML..."
cat > ./backups/test-cases.component.html.bak << EOF
$(cat ./src/app/features/test-cases/test-cases.component.html)
EOF

cat > ./src/app/features/test-cases/test-cases.component.html << 'EOF'
<div class="test-cases-container">
  <app-page-header title="Przypadki testowe">
    <button mat-flat-button color="primary" routerLink="/test-cases/create">
      <mat-icon>add</mat-icon>
      <span>Dodaj przypadek</span>
    </button>
  </app-page-header>
  
  <mat-card class="table-container">
    <div class="table-header">
      <div class="table-filters">
        <button mat-stroked-button class="filter-button">
          <mat-icon>filter_list</mat-icon>
          <span>Filtry</span>
        </button>
        
        <mat-form-field appearance="outline" class="project-selector">
          <mat-select [(value)]="selectedProject">
            <mat-option *ngFor="let project of projects" [value]="project">
              {{ project }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      
      <mat-form-field appearance="outline" class="search-field">
        <mat-icon matPrefix>search</mat-icon>
        <input matInput placeholder="Szukaj przypadków testowych..." (keyup)="applyFilter($event)">
      </mat-form-field>
    </div>
    
    <div class="mat-elevation-z0">
      <table mat-table [dataSource]="dataSource" class="full-width-table">
        <!-- ID Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let row" [routerLink]="['/test-cases/view', row.id]" style="cursor: pointer">{{ row.id }}</td>
        </ng-container>
        
        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nazwa</th>
          <td mat-cell *matCellDef="let row" class="name-cell" [routerLink]="['/test-cases/view', row.id]" style="cursor: pointer">{{ row.name }}</td>
        </ng-container>
        
        <!-- Project Column -->
        <ng-container matColumnDef="project">
          <th mat-header-cell *matHeaderCellDef>Projekt</th>
          <td mat-cell *matCellDef="let row">
            <div class="project-indicator">
              <div class="color-dot" [ngClass]="row.project.color"></div>
              <span>{{ row.project.name }}</span>
            </div>
          </td>
        </ng-container>
        
        <!-- Priority Column -->
        <ng-container matColumnDef="priority">
          <th mat-header-cell *matHeaderCellDef>Priorytet</th>
          <td mat-cell *matCellDef="let row">
            <app-status-chip [text]="row.priority.level" [color]="row.priority.color"></app-status-chip>
          </td>
        </ng-container>
        
        <!-- Author Column -->
        <ng-container matColumnDef="author">
          <th mat-header-cell *matHeaderCellDef>Autor</th>
          <td mat-cell *matCellDef="let row">{{ row.author }}</td>
        </ng-container>
        
        <!-- Creation Date Column -->
        <ng-container matColumnDef="creationDate">
          <th mat-header-cell *matHeaderCellDef>Data utworzenia</th>
          <td mat-cell *matCellDef="let row">{{ row.creationDate }}</td>
        </ng-container>
        
        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let row">
            <app-status-chip [text]="row.status.name" [color]="row.status.color"></app-status-chip>
          </td>
        </ng-container>
        
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
      </table>
      
      <mat-paginator [pageSize]="5" [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
    </div>
  </mat-card>
</div>
EOF

# 15. Naprawianie pliku karma.conf.js 
echo "Dodawanie pliku karma.conf.js (jeśli nie istnieje)..."
if [ ! -f ./karma.conf.js ]; then
  cat > ./karma.conf.js << 'EOF'
// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/test-manager'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    restartOnFileChange: true
  });
};
EOF
fi

# 16. Aktualizacja pliku package.json (dodajmy skrypt dla tego repozytorium)
echo "Aktualizacja pliku package.json..."
cat > ./backups/package.json.bak << EOF
$(cat ./package.json)
EOF

jq '.scripts.fix = "bash ./fix-script.sh"' ./package.json > ./package.json.tmp && mv ./package.json.tmp ./package.json

# Tworzenie pliku ze skryptem naprawczym w głównym katalogu
echo "Zapisuję skrypt naprawczy do pliku ./fix-script.sh..."
chmod +x ./fix-script.sh

echo "Naprawa zakończona. Aby uruchomić skrypt naprawczy, wykonaj polecenie: bash ./fix-script.sh"
echo "Albo uruchom: npm run fix"
EOF

echo "Przygotowałem skrypt naprawczy dla aplikacji Test Manager. Skrypt rozwiązuje następujące problemy:"

echo "1. Naprawia problem z app.component.ts, który miał nieprawidłową implementację dla komponentu SidebarComponent"
echo "2. Aktualizuje SidebarComponent, aby poprawnie działał w aplikacji"
echo "3. Rozwiązuje problem ze stylami w StatusChipComponent i MetricCardComponent"
echo "4. Naprawia routing w aplikacji, dodając routerLink do odpowiednich komponentów"
echo "5. Poprawia integrację TestStatusChartComponent w DashboardComponent"
echo "6. Dodaje brakujące importy RouterModule do różnych komponentów"
echo "7. Tworzy plik karma.conf.js, jeśli nie istnieje"
echo "8. Aktualizuje package.json o skrypt do uruchomienia naprawy"

echo "Skrypt tworzy również kopie zapasowe wszystkich modyfikowanych plików w katalogu ./backups, co pozwala na łatwe przywrócenie poprzedniego stanu jeśli potrzeba."

echo "Można go użyć wykonując polecenie: bash ./fix-script.sh"
echo "Lub dodając do package.json: npm run fix"