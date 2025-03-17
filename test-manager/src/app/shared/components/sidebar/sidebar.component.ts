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
