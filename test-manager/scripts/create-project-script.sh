#!/bin/bash

# Skrypt automatycznie tworzy kompletny projekt Angular do zarządzania testami
# Autor: Claude
# Data: 12 marca 2025

set -e  # Zatrzymaj wykonywanie skryptu w przypadku błędu

echo "=== Tworzenie projektu Test Manager w Angular ==="
echo "Skrypt utworzy nowy projekt i uzupełni wszystkie niezbędne pliki"

# 1. Sprawdzenie wymagań
command -v node >/dev/null 2>&1 || { echo "Node.js jest wymagany. Zainstaluj go przed kontynuacją."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm jest wymagany. Zainstaluj go przed kontynuacją."; exit 1; }

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 2. Instalacja/aktualizacja Angular CLI
echo -e "\n=== Instalacja Angular CLI ==="
npm install -g @angular/cli

# 3. Tworzenie nowego projektu
echo -e "\n=== Tworzenie nowego projektu Angular ==="
ng new test-manager --standalone --routing --style=scss --skip-git --skip-tests

# Przejście do katalogu projektu
cd test-manager

# 4. Instalacja Angular Material
echo -e "\n=== Instalacja Angular Material ==="
ng add @angular/material

# 5. Tworzenie struktury folderów
echo -e "\n=== Tworzenie struktury katalogów ==="
mkdir -p src/app/core/models
mkdir -p src/app/core/services
mkdir -p src/app/features/dashboard/components/test-status-chart
mkdir -p src/app/features/test-cases
mkdir -p src/app/features/test-runs
mkdir -p src/app/features/reports
mkdir -p src/app/shared/components/navigation
mkdir -p src/app/shared/components/sidebar
mkdir -p src/app/shared/ui/status-chip
mkdir -p src/app/shared/ui/metric-card
mkdir -p src/app/shared/ui/page-header

# 6. Tworzenie plików modeli danych
echo -e "\n=== Tworzenie modeli danych ==="

cat > src/app/core/models/test-case.model.ts << 'EOF'
export interface TestCase {
  id: string;
  name: string;
  project: { name: string; color: string };
  priority: { level: string; color: string };
  author: string;
  creationDate: string;
  status: { name: string; color: string };
}
EOF

cat > src/app/core/models/test-run.model.ts << 'EOF'
export interface TestRun {
  id: string;
  name: string;
  project: string;
  progress?: { current: number, total: number, percentage: number };
  results?: { success: number, errors: number };
  date?: string;
}
EOF

cat > src/app/core/models/report.model.ts << 'EOF'
export interface Report {
  title: string;
  project: string;
  date: string;
  icon: string;
  color: string;
}
EOF

# 7. Tworzenie serwisów
echo -e "\n=== Tworzenie serwisów ==="

cat > src/app/core/services/theme.service.ts << 'EOF'
import { Injectable, signal } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _darkMode = signal(false);
  darkMode = this._darkMode.asReadonly();
  
  constructor(private overlayContainer: OverlayContainer) {}
  
  toggleDarkMode() {
    const newValue = !this._darkMode();
    this._darkMode.set(newValue);
    
    if (newValue) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      this.overlayContainer.getContainerElement().classList.add('dark-theme');
      this.overlayContainer.getContainerElement().classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      this.overlayContainer.getContainerElement().classList.add('light-theme');
      this.overlayContainer.getContainerElement().classList.remove('dark-theme');
    }
  }
}
EOF

cat > src/app/core/services/api.service.ts << 'EOF'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TestCase } from '../models/test-case.model';
import { TestRun } from '../models/test-run.model';
import { Report } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.example.com'; // Placeholder dla prawdziwego API
  
  // Mock data dla celów demonstracyjnych
  private testCasesMock: TestCase[] = [
    {
      id: 'TC-001',
      name: 'Logowanie użytkownika z poprawnymi danymi',
      project: { name: 'Portal klienta', color: 'green' },
      priority: { level: 'Wysoki', color: 'warn' },
      author: 'Jan Kowalski',
      creationDate: '10 mar 2025',
      status: { name: 'Aktywny', color: 'success' }
    },
    {
      id: 'TC-002',
      name: 'Rejestracja nowego użytkownika',
      project: { name: 'Portal klienta', color: 'green' },
      priority: { level: 'Średni', color: 'accent' },
      author: 'Anna Nowak',
      creationDate: '8 mar 2025',
      status: { name: 'Aktywny', color: 'success' }
    },
    {
      id: 'TC-003',
      name: 'Wyszukiwanie produktów według kategorii',
      project: { name: 'Aplikacja mobilna', color: 'purple' },
      priority: { level: 'Średni', color: 'accent' },
      author: 'Piotr Wiśniewski',
      creationDate: '7 mar 2025',
      status: { name: 'W przeglądzie', color: 'default' }
    },
    {
      id: 'TC-004',
      name: 'Realizacja płatności kartą kredytową',
      project: { name: 'Portal klienta', color: 'green' },
      priority: { level: 'Wysoki', color: 'warn' },
      author: 'Jan Kowalski',
      creationDate: '5 mar 2025',
      status: { name: 'Aktywny', color: 'success' }
    },
    {
      id: 'TC-005',
      name: 'Synchronizacja danych między aplikacjami',
      project: { name: 'Backend API', color: 'blue' },
      priority: { level: 'Niski', color: 'primary' },
      author: 'Tomasz Kowalczyk',
      creationDate: '2 mar 2025',
      status: { name: 'Nieaktywny', color: 'warn' }
    }
  ];
  
  constructor(private http: HttpClient) {}
  
  // Metody do obsługi TestCase
  getTestCases(): Observable<TestCase[]> {
    // W prawdziwej aplikacji: return this.http.get<TestCase[]>(`${this.apiUrl}/test-cases`);
    return of(this.testCasesMock).pipe(delay(300)); // Symulacja opóźnienia sieciowego
  }
  
  getTestCaseById(id: string): Observable<TestCase> {
    // W prawdziwej aplikacji: return this.http.get<TestCase>(`${this.apiUrl}/test-cases/${id}`);
    const testCase = this.testCasesMock.find(tc => tc.id === id);
    return of(testCase as TestCase).pipe(delay(300));
  }
  
  createTestCase(testCase: Partial<TestCase>): Observable<TestCase> {
    // W prawdziwej aplikacji: return this.http.post<TestCase>(`${this.apiUrl}/test-cases`, testCase);
    const newTestCase = {
      ...testCase,
      id: `TC-${Math.floor(Math.random() * 1000)}`,
      creationDate: new Date().toLocaleDateString()
    } as TestCase;
    this.testCasesMock.push(newTestCase);
    return of(newTestCase).pipe(delay(300));
  }
  
  updateTestCase(id: string, testCase: Partial<TestCase>): Observable<TestCase> {
    // W prawdziwej aplikacji: return this.http.put<TestCase>(`${this.apiUrl}/test-cases/${id}`, testCase);
    let index = this.testCasesMock.findIndex(tc => tc.id === id);
    if (index !== -1) {
      this.testCasesMock[index] = { ...this.testCasesMock[index], ...testCase };
      return of(this.testCasesMock[index]).pipe(delay(300));
    }
    return of({} as TestCase);
  }
  
  deleteTestCase(id: string): Observable<void> {
    // W prawdziwej aplikacji: return this.http.delete<void>(`${this.apiUrl}/test-cases/${id}`);
    this.testCasesMock = this.testCasesMock.filter(tc => tc.id !== id);
    return of(void 0).pipe(delay(300));
  }
}
EOF

cat > src/app/core/services/project.service.ts << 'EOF'
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Project {
  id: string;
  name: string;
  color: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [
    { id: 'proj-1', name: 'Portal klienta', color: 'green', description: 'Aplikacja internetowa dla klientów' },
    { id: 'proj-2', name: 'Aplikacja mobilna', color: 'purple', description: 'Aplikacja na iOS i Android' },
    { id: 'proj-3', name: 'Backend API', color: 'blue', description: 'REST API dla wszystkich aplikacji' }
  ];
  
  private projectsSubject = new BehaviorSubject<Project[]>(this.projects);
  private selectedProjectSubject = new BehaviorSubject<Project | null>(this.projects[0]);
  
  get projects$(): Observable<Project[]> {
    return this.projectsSubject.asObservable();
  }
  
  get selectedProject$(): Observable<Project | null> {
    return this.selectedProjectSubject.asObservable();
  }
  
  selectProject(projectId: string): void {
    const project = this.projects.find(p => p.id === projectId) || null;
    this.selectedProjectSubject.next(project);
  }
  
  addProject(project: Omit<Project, 'id'>): void {
    const newProject = {
      ...project,
      id: `proj-${this.projects.length + 1}`
    };
    this.projects = [...this.projects, newProject];
    this.projectsSubject.next(this.projects);
  }
  
  updateProject(id: string, project: Partial<Project>): void {
    this.projects = this.projects.map(p => 
      p.id === id ? { ...p, ...project } : p
    );
    this.projectsSubject.next(this.projects);
    
    // Jeśli aktualizujemy aktualnie wybrany projekt, aktualizujemy też selectedProject
    const currentSelected = this.selectedProjectSubject.value;
    if (currentSelected && currentSelected.id === id) {
      this.selectedProjectSubject.next({ ...currentSelected, ...project });
    }
  }
  
  deleteProject(id: string): void {
    this.projects = this.projects.filter(p => p.id !== id);
    this.projectsSubject.next(this.projects);
    
    // Jeśli usuwamy aktualnie wybrany projekt, resetujemy wybór
    const currentSelected = this.selectedProjectSubject.value;
    if (currentSelected && currentSelected.id === id) {
      this.selectedProjectSubject.next(this.projects[0] || null);
    }
  }
}
EOF

# 8. Tworzenie komponentów UI
echo -e "\n=== Tworzenie komponentów UI ==="

cat > src/app/shared/ui/status-chip/status-chip.component.ts << 'EOF'
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="status-chip" [ngClass]="color">
      {{ text }}
    </div>
  `,
  styles: [`
    .status-chip {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      
      &.primary {
        background-color: rgba(33, 150, 243, 0.1);
        color: #2196f3;
      }
      
      &.accent {
        background-color: rgba(255, 152, 0, 0.1);
        color: #ff9800;
      }
      
      &.warn {
        background-color: rgba(244, 67, 54, 0.1);
        color: #f44336;
      }
      
      &.success {
        background-color: rgba(76, 175, 80, 0.1);
        color: #4caf50;
      }
      
      &.default {
        background-color: rgba(158, 158, 158, 0.1);
        color: #9e9e9e;
      }
    }
  `]
})
export class StatusChipComponent {
  @Input() text = '';
  @Input() color: 'primary' | 'accent' | 'warn' | 'success' | 'default' = 'default';
}
EOF

cat > src/app/shared/ui/metric-card/metric-card.component.ts << 'EOF'
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

cat > src/app/shared/ui/page-header/page-header.component.ts << 'EOF'
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="page-header">
      <h1 class="page-title">{{ title }}</h1>
      
      <div class="page-actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      
      .page-title {
        font-size: 24px;
        font-weight: 500;
        margin: 0;
      }
      
      .page-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  `]
})
export class PageHeaderComponent {
  @Input() title = '';
}
EOF

# 9. Tworzenie komponentów Nawigacji i Sidebara
echo -e "\n=== Tworzenie komponentów Nawigacji i Sidebara ==="

cat > src/app/shared/components/navigation/navigation.component.ts << 'EOF'
import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button mat-icon-button (click)="sidebarToggled.emit()">
        <mat-icon>menu</mat-icon>
      </button>
      
      <div class="logo">
        <span class="primary-text">Test</span>
        <span>Manager</span>
      </div>
      
      <div class="main-nav">
        <a mat-button routerLink="/dashboard" routerLinkActive="active-link">Dashboard</a>
        <a mat-button routerLink="/test-cases" routerLinkActive="active-link">Przypadki testowe</a>
        <a mat-button routerLink="/test-runs" routerLinkActive="active-link">Wykonania testów</a>
        <a mat-button routerLink="/reports" routerLinkActive="active-link">Raporty</a>
      </div>
      
      <span class="spacer"></span>
      
      <div class="search-container">
        <mat-icon>search</mat-icon>
        <input type="text" placeholder="Szukaj..." class="search-input">
      </div>
      
      <button mat-icon-button matBadge="3" matBadgeColor="accent" class="notification-button">
        <mat-icon>notifications</mat-icon>
      </button>
      
      <button mat-icon-button (click)="themeService.toggleDarkMode()">
        <mat-icon>{{ themeService.darkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>
      
      <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
        <div class="avatar">JK</div>
        <span class="username">Jan Kowalski</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </button>
      
      <mat-menu #userMenu="matMenu">
        <button mat-menu-item>
          <mat-icon>person</mat-icon>
          <span>Mój profil</span>
        </button>
        <button mat-menu-item>
          <mat-icon>settings</mat-icon>
          <span>Ustawienia</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item>
          <mat-icon>exit_to_app</mat-icon>
          <span>Wyloguj</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .app-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 999;
    }

    .logo {
      font-size: 20px;
      font-weight: 600;
      margin-right: 32px;
      
      .primary-text {
        color: #90caf9;
        margin-right: 4px;
      }
    }

    .main-nav {
      display: flex;
      
      a {
        margin: 0 4px;
        height: 36px;
        line-height: 36px;
        border-radius: 4px;
        
        &.active-link {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
    }

    .spacer {
      flex: 1 1 auto;
    }

    .search-container {
      display: flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      padding: 0 12px;
      margin-right: 16px;
      height: 36px;
      
      mat-icon {
        margin-right: 8px;
        opacity: 0.7;
      }
      
      .search-input {
        background: transparent;
        border: none;
        outline: none;
        color: inherit;
        width: 180px;
        
        &::placeholder {
          color: currentColor;
          opacity: 0.7;
        }
      }
    }

    .notification-button {
      margin: 0 8px;
    }

    .user-button {
      display: flex;
      align-items: center;
      padding: 0 8px;
      margin-left: 8px;
      
      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #90caf9;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        margin-right: 8px;
      }
      
      .username {
        margin-right: 4px;
      }
    }
  `]
})
export class NavigationComponent {
  themeService = inject(ThemeService);
  @Output() sidebarToggled = new EventEmitter<void>();
}
EOF

cat > src/app/shared/components/sidebar/sidebar.component.ts << 'EOF'
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <mat-sidenav [opened]="opened" mode="side" class="app-sidenav">
      <div class="sidenav-content">
        <div class="new-test-button-container">
          <button mat-flat-button color="primary" class="new-test-button">
            <mat-icon>add</mat-icon>
            <span>Nowy test</span>
          </button>
        </div>
        
        <mat-nav-list>
          <h3 mat-subheader>Projekty</h3>
          
          <a mat-list-item class="project-item active">
            <div class="project-color-indicator green"></div>
            <span>Portal klienta</span>
          </a>
          
          <a mat-list-item class="project-item">
            <div class="project-color-indicator purple"></div>
            <span>Aplikacja mobilna</span>
          </a>
          
          <a mat-list-item class="project-item">
            <div class="project-color-indicator blue"></div>
            <span>Backend API</span>
          </a>
          
          <mat-divider></mat-divider>
          
          <h3 mat-subheader>Widoki</h3>
          
          <a mat-list-item>
            <mat-icon matListItemIcon>timeline</mat-icon>
            <span>Aktywność</span>
          </a>
          
          <a mat-list-item>
            <mat-icon matListItemIcon>history</mat-icon>
            <span>Ostatnie</span>
          </a>
          
          <a mat-list-item>
            <mat-icon matListItemIcon>calendar_today</mat-icon>
            <span>Harmonogram</span>
          </a>
        </mat-nav-list>
      </div>
      
      <div class="sidenav-footer">
        <a mat-list-item>
          <mat-icon matListItemIcon>settings</mat-icon>
          <span>Ustawienia</span>
        </a>
      </div>
    </mat-sidenav>
  `,
  styles: [`
    .app-sidenav {
      width: 240px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .sidenav-content {
        flex: 1;
        overflow-y: auto;
      }
      
      .new-test-button-container {
        padding: 16px;
        
        .new-test-button {
          width: 100%;
        }
      }
      
      .project-item {
        display: flex;
        align-items: center;
        
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
        }
        
        &.active {
          background-color: rgba(0, 0, 0, 0.04);
          
          .dark-theme & {
            background-color: rgba(255, 255, 255, 0.08);
          }
        }
      }
      
      .sidenav-footer {
        border-top: 1px solid rgba(0, 0, 0, 0.12);
        
        .dark-theme & {
          border-top-color: rgba(255, 255, 255, 0.12);
        }
      }
    }
  `]
})
export class SidebarComponent {
  @Input() opened = true;
}
EOF

# 10. Tworzenie komponentów funkcjonalnych (Dashboard, Test Cases, Test Runs, Reports)
echo -e "\n=== Tworzenie komponentów funkcjonalnych ==="

# Dashboard component
cat > src/app/features/dashboard/dashboard.component.ts << 'EOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { StatusChipComponent } from '../../shared/ui/status-chip/status-chip.component';
import { MetricCardComponent } from '../../shared/ui/metric-card/metric-card.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    StatusChipComponent,
    MetricCardComponent,
    PageHeaderComponent
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

cat > src/app/features/dashboard/dashboard.component.html << 'EOF'
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
        <div class="chart-header">
          <h2 class="chart-title">Status wykonania testów</h2>
          
          <mat-form-field appearance="outline" class="time-range-selector">
            <mat-select [(value)]="selectedTimeRange">
              <mat-option *ngFor="let option of timeRangeOptions" [value]="option">
                {{ option }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        
        <div class="chart-placeholder">
          [Tutaj wykres statusu testów]
        </div>
      </mat-card-content>
    </mat-card>
    
    <mat-card class="chart-card">
      <mat-card-content>
        <div class="chart-header">
          <h2 class="chart-title">Najnowsze testy</h2>
          <a class="see-all-link" mat-button color="primary">Zobacz wszystkie</a>
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

cat > src/app/features/dashboard/dashboard.component.scss << 'EOF'
.dashboard-container {
  .page-actions {
    display: flex;
    align-items: center;
    
    .filter-button {
      margin-right: 12px;
    }
    
    .view-toggle {
      display: flex;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      overflow: hidden;
      
      .dark-theme & {
        border-color: rgba(255, 255, 255, 0.12);
      }
      
      .view-toggle-button {
        border-radius: 0;
        
        &.active {
          background-color: rgba(0, 0, 0, 0.04);
          
          .dark-theme & {
            background-color: rgba(255, 255, 255, 0.08);
          }
        }
      }
    }
  }
  
  .metrics-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .charts-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 16px;
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
    
    .chart-card {
      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        
        .chart-title {
          font-size: 16px;
          font-weight: 500;
          margin: 0;
        }
        
        .time-range-selector {
          width: 160px;
          
          ::ng-deep .mat-mdc-form-field-subscript-wrapper {
            display: none;
          }
        }
        
        .see-all-link {
          font-size: 14px;
        }
      }
      
      .chart-placeholder {
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
      }
      
      .recent-tests-list {
        .recent-test-item {
          margin-bottom: 12px;
          padding: 12px;
          
          .test-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
            
            .test-name {
              font-weight: 500;
            }
            
            .test-status {
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 12px;
              
              &.success {
                background-color: rgba(76, 175, 80, 0.1);
                color: #4caf50;
              }
              
              &.error {
                background-color: rgba(244, 67, 54, 0.1);
                color: #f44336;
              }
              
              &.in-progress {
                background-color: rgba(255, 152, 0, 0.1);
                color: #ff9800;
              }
            }
          }
          
          .test-details {
            font-size: 14px;
            color: var(--text-secondary);
          }
        }
      }
    }
  }
}
EOF

# Test Cases component
cat > src/app/features/test-cases/test-cases.component.ts << 'EOF'
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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

cat > src/app/features/test-cases/test-cases.component.html << 'EOF'
<div class="test-cases-container">
  <app-page-header title="Przypadki testowe">
    <button mat-flat-button color="primary">
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
          <td mat-cell *matCellDef="let row">{{ row.id }}</td>
        </ng-container>
        
        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nazwa</th>
          <td mat-cell *matCellDef="let row" class="name-cell">{{ row.name }}</td>
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

cat > src/app/features/test-cases/test-cases.component.scss << 'EOF'
.test-cases-container {
  .table-container {
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      
      .dark-theme & {
        border-bottom-color: rgba(255, 255, 255, 0.12);
      }
      
      .table-filters {
        display: flex;
        align-items: center;
        
        .filter-button {
          margin-right: 12px;
        }
        
        .project-selector {
          width: 180px;
          
          ::ng-deep .mat-mdc-form-field-subscript-wrapper {
            display: none;
          }
        }
      }
      
      .search-field {
        width: 300px;
        
        ::ng-deep .mat-mdc-form-field-subscript-wrapper {
          display: none;
        }
      }
    }
    
    .full-width-table {
      width: 100%;
      
      .mat-mdc-header-cell {
        font-weight: 500;
      }
      
      .mat-column-id {
        width: 80px;
      }
      
      .mat-column-name {
        min-width: 280px;
      }
      
      .mat-column-project {
        width: 160px;
      }
      
      .mat-column-priority {
        width: 120px;
      }
      
      .mat-column-author {
        width: 140px;
      }
      
      .mat-column-creationDate {
        width: 140px;
      }
      
      .mat-column-status {
        width: 120px;
      }
      
      .name-cell {
        font-weight: 500;
      }
      
      .project-indicator {
        display: flex;
        align-items: center;
        
        .color-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 8px;
          
          &.green {
            background-color: #4caf50;
          }
          
          &.purple {
            background-color: #9c27b0;
          }
          
          &.blue {
            background-color: #2196f3;
          }
        }
      }
      
      .table-row {
        &:hover {
          background-color: rgba(0, 0, 0, 0.04);
          
          .dark-theme & {
            background-color: rgba(255, 255, 255, 0.08);
          }
        }
      }
    }
  }
}
EOF

# Utworzenie Test Runs
cat > src/app/features/test-runs/test-runs.component.ts << 'EOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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

cat > src/app/features/test-runs/test-runs.component.html << 'EOF'
<div class="test-runs-container">
  <app-page-header title="Wykonania testów">
    <button mat-flat-button color="primary">
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
                <button mat-stroked-button color="primary">Kontynuuj</button>
                <button mat-button>Szczegóły</button>
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
                <button mat-stroked-button color="primary">Raport</button>
                <button mat-button>Szczegóły</button>
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
                <button mat-stroked-button color="primary">Edytuj</button>
                <button mat-button>Szczegóły</button>
              </div>
            </div>
          </mat-expansion-panel>
        </mat-accordion>
      </mat-card-content>
    </mat-card>
  </div>
</div>
EOF

cat > src/app/features/test-runs/test-runs.component.scss << 'EOF'
.test-runs-container {
  .test-runs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
    
    .test-runs-card {
      .mat-mdc-card-header {
        padding: 16px;
        display: flex;
        align-items: center;
        
        .mat-mdc-card-title {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
        }
        
        .header-badge {
          margin-left: auto;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          
          &.primary {
            background-color: rgba(33, 150, 243, 0.1);
            color: #2196f3;
          }
          
          &.accent {
            background-color: rgba(255, 152, 0, 0.1);
            color: #ff9800;
          }
          
          &.success {
            background-color: rgba(76, 175, 80, 0.1);
            color: #4caf50;
          }
        }
      }
      
      .mat-mdc-card-content {
        padding: 0 16px 16px;
        
        .mat-expansion-panel {
          margin-bottom: 12px;
          box-shadow: none;
          border: 1px solid rgba(0, 0, 0, 0.12);
          
          .dark-theme & {
            border-color: rgba(255, 255, 255, 0.12);
          }
          
          &.mat-expanded {
            background-color: rgba(0, 0, 0, 0.02);
            
            .dark-theme & {
              background-color: rgba(255, 255, 255, 0.03);
            }
          }
          
          .mat-expansion-panel-header {
            .mat-expansion-panel-header-title {
              font-weight: 500;
            }
          }
          
          .test-run-details {
            padding: 0 16px 16px;
            
            .project-name {
              margin-bottom: 12px;
              color: var(--text-secondary);
            }
            
            .progress-container {
              display: flex;
              align-items: center;
              margin-bottom: 16px;
              
              .progress-label {
                width: 60px;
                font-size: 14px;
                color: var(--text-secondary);
              }
              
              .mat-progress-bar {
                flex: 1;
              }
              
              .progress-stats {
                margin-left: 12px;
                font-size: 14px;
                color: var(--text-secondary);
              }
            }
            
            .results-container {
              display: flex;
              gap: 8px;
              margin-bottom: 16px;
            }
            
            .schedule-container {
              display: flex;
              margin-bottom: 16px;
              font-size: 14px;
              
              .schedule-label {
                width: 60px;
                color: var(--text-secondary);
              }
            }
            
            .actions {
              display: flex;
              gap: 8px;
            }
          }
        }
      }
    }
  }
}
EOF

# Utworzenie Reports
cat > src/app/features/reports/reports.component.ts << 'EOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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

cat > src/app/features/reports/reports.component.html << 'EOF'
<div class="reports-container">
  <app-page-header title="Raporty">
    <button mat-flat-button color="primary">
      <mat-icon>add</mat-icon>
      <span>Generuj raport</span>
    </button>
  </app-page-header>
  
  <div class="reports-grid">
    <mat-card *ngFor="let report of reports" class="report-card">
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

cat > src/app/features/reports/reports.component.scss << 'EOF'
.reports-container {
  .reports-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
    
    .report-card {
      cursor: pointer;
      transition: transform 0.2s;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        
        .dark-theme & {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
      }
      
      .report-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      
      .report-info {
        .report-title {
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 8px;
        }
        
        .report-project {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0 0 16px;
        }
        
        .report-date {
          font-size: 12px;
          color: var(--text-secondary);
          margin: 0;
        }
      }
      
      .report-icon {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.primary {
          background-color: rgba(33, 150, 243, 0.1);
          color: #2196f3;
        }
        
        &.accent {
          background-color: rgba(255, 152, 0, 0.1);
          color: #ff9800;
        }
        
        &.warn {
          background-color: rgba(244, 67, 54, 0.1);
          color: #f44336;
        }
        
        &.success {
          background-color: rgba(76, 175, 80, 0.1);
          color: #4caf50;
        }
        
        &.purple {
          background-color: rgba(156, 39, 176, 0.1);
          color: #9c27b0;
        }
      }
    }
  }
}
EOF

# 11. Aktualizacja głównych plików aplikacji
echo -e "\n=== Aktualizacja głównych plików aplikacji ==="

# Plik app.component.ts
cat > src/app/app.component.ts << 'EOF'
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    <div [ngClass]="{'dark-theme': themeService.darkMode(), 'light-theme': !themeService.darkMode()}" class="app-container">
      <app-navigation (sidebarToggled)="toggleSidenav()"></app-navigation>
      
      <mat-sidenav-container class="sidenav-container">
        <app-sidebar [opened]="sidenavOpened()"></app-sidebar>
        
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
  `]
})
export class AppComponent {
  sidenavOpened = signal(true);
  
  constructor(public themeService: ThemeService) {}
  
  toggleSidenav() {
    this.sidenavOpened.update(value => !value);
  }
}
EOF

# Plik app.routes.ts
cat > src/app/app.routes.ts << 'EOF'
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
EOF

# Plik app.config.ts
cat > src/app/app.config.ts << 'EOF'
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient()
  ]
};
EOF

# Aktualizacja pliku stylów globalnych
cat > src/styles.scss << 'EOF'
@use '@angular/material' as mat;

:root {
  --primary-color: #3f51b5;
  --accent-color: #ff4081;
  --warn-color: #f44336;
  --success-color: #4caf50;
  --background-light: #f5f5f5;
  --card-background-light: #ffffff;
  --background-dark: #303030;
  --card-background-dark: #424242;
  --text-light: rgba(0, 0, 0, 0.87);
  --text-light-secondary: rgba(0, 0, 0, 0.6);
  --text-dark: rgba(255, 255, 255, 1);
  --text-dark-secondary: rgba(255, 255, 255, 0.7);
}

html, body {
  height: 100%;
  margin: 0;
  font-family: Roboto, "Helvetica Neue", sans-serif;
}

.light-theme {
  --background: var(--background-light);
  --card-background: var(--card-background-light);
  --text-color: var(--text-light);
  --text-secondary: var(--text-light-secondary);
  
  background-color: var(--background);
  color: var(--text-color);
}

.dark-theme {
  --background: var(--background-dark);
  --card-background: var(--card-background-dark);
  --text-color: var(--text-dark);
  --text-secondary: var(--text-dark-secondary);
  
  background-color: var(--background);
  color: var(--text-color);
}

// Define Material custom theme
@include mat.core();

// Define light theme
$light-primary: mat.define-palette(mat.$indigo-palette);
$light-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);
$light-warn: mat.define-palette(mat.$red-palette);

$light-theme: mat.define-light-theme((
  color: (
    primary: $light-primary,
    accent: $light-accent,
    warn: $light-warn,
  ),
  typography: mat.define-typography-config(),
  density: 0,
));

// Define dark theme
$dark-primary: mat.define-palette(mat.$blue-palette);
$dark-accent: mat.define-palette(mat.$amber-palette, A200, A100, A400);
$dark-warn: mat.define-palette(mat.$deep-orange-palette);

$dark-theme: mat.define-dark-theme((
  color: (
    primary: $dark-primary,
    accent: $dark-accent,
    warn: $dark-warn,
  ),
  typography: mat.define-typography-config(),
  density: 0,
));

// Apply the light theme by default
@include mat.all-component-themes($light-theme);

// Apply the dark theme only when the `.dark-theme` class is applied
.dark-theme {
  @include mat.all-component-colors($dark-theme);
}

// Global card styles
.mat-mdc-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
  
  .dark-theme & {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
  }
}

// Common page layout styles
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  .page-title {
    font-size: 24px;
    font-weight: 500;
    margin: 0;
  }
  
  .page-actions {
    display: flex;
    align-items: center;
  }
}
EOF

# 12. Uruchomienie aplikacji i podpowiedzi końcowe
echo -e "\n=== Projekt został utworzony pomyślnie! ==="
echo "Możesz teraz uruchomić aplikację za pomocą polecenia:"
echo "ng serve"
echo -e "\nAplikacja będzie dostępna pod adresem: http://localhost:4200"
echo -e "\nAutor skryptu: Claude [12 marca 2025]"

# Nadanie uprawnień do wykonania
chmod +x "$0"
