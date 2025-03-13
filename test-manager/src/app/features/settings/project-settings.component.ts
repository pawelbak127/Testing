import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { ProjectService, Project } from '../../core/services/project.service';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-project-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatSnackBarModule,
    PageHeaderComponent
  ],
  template: `
    <div class="project-settings-container">
      <app-page-header title="Ustawienia projektu">
        <button mat-flat-button color="primary" (click)="saveSettings()" [disabled]="projectForm.invalid">
          <mat-icon>save</mat-icon>
          <span>Zapisz zmiany</span>
        </button>
      </app-page-header>

      <div class="settings-content">
        <mat-card class="project-selection-card">
          <mat-card-content>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Wybierz projekt</mat-label>
              <mat-select [(value)]="selectedProjectId" (selectionChange)="onProjectChange()">
                <mat-option *ngFor="let project of projects" [value]="project.id">
                  <div class="project-option">
                    <div class="color-dot" [ngClass]="project.color"></div>
                    <span>{{ project.name }}</span>
                  </div>
                </mat-option>
              </mat-select>
            </mat-form-field>
          </mat-card-content>
        </mat-card>

        <div class="settings-tabs" *ngIf="selectedProject">
          <mat-tab-group>
            <mat-tab label="Informacje ogólne">
              <form [formGroup]="projectForm" class="form-container">
                <mat-card class="settings-card">
                  <mat-card-content>
                    <h3>Podstawowe informacje</h3>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Nazwa projektu</mat-label>
                      <input matInput formControlName="name">
                      <mat-error *ngIf="projectForm.get('name')?.hasError('required')">
                        Nazwa jest wymagana
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Opis</mat-label>
                      <textarea matInput formControlName="description" rows="3"></textarea>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Kolor projektu</mat-label>
                      <mat-select formControlName="color">
                        <mat-option value="green">
                          <div class="color-option">
                            <div class="color-preview green"></div>
                            <span>Zielony</span>
                          </div>
                        </mat-option>
                        <mat-option value="blue">
                          <div class="color-option">
                            <div class="color-preview blue"></div>
                            <span>Niebieski</span>
                          </div>
                        </mat-option>
                        <mat-option value="purple">
                          <div class="color-option">
                            <div class="color-preview purple"></div>
                            <span>Fioletowy</span>
                          </div>
                        </mat-option>
                        <mat-option value="orange">
                          <div class="color-option">
                            <div class="color-preview orange"></div>
                            <span>Pomarańczowy</span>
                          </div>
                        </mat-option>
                        <mat-option value="red">
                          <div class="color-option">
                            <div class="color-preview red"></div>
                            <span>Czerwony</span>
                          </div>
                        </mat-option>
                      </mat-select>
                    </mat-form-field>
                  </mat-card-content>
                </mat-card>

                <mat-card class="settings-card">
                  <mat-card-content>
                    <h3>Ustawienia wykonywania testów</h3>

                    <div class="settings-toggles">
                      <div class="setting-row">
                        <div class="setting-description">
                          <div class="setting-name">Automatycznie oznacz testy jako nieaktualne po 30 dniach</div>
                          <div class="setting-details">Testy, które nie były aktualizowane przez 30 dni, zostaną oznaczone jako wymagające przeglądu</div>
                        </div>
                        <mat-slide-toggle formControlName="autoFlagTests" color="primary"></mat-slide-toggle>
                      </div>

                      <div class="setting-row">
                        <div class="setting-description">
                          <div class="setting-name">Wymagaj komentarza dla nieudanych testów</div>
                          <div class="setting-details">Użytkownicy będą musieli podać komentarz, gdy oznaczą test jako nieudany</div>
                        </div>
                        <mat-slide-toggle formControlName="requireFailComments" color="primary"></mat-slide-toggle>
                      </div>

                      <div class="setting-row">
                        <div class="setting-description">
                          <div class="setting-name">Automatycznie generuj raporty testów</div>
                          <div class="setting-details">Raporty będą automatycznie generowane po zakończeniu wykonania testów</div>
                        </div>
                        <mat-slide-toggle formControlName="autoGenerateReports" color="primary"></mat-slide-toggle>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </form>
            </mat-tab>

            <mat-tab label="Użytkownicy">
              <mat-card class="settings-card">
                <mat-card-content>
                  <div class="users-header">
                    <h3>Zarządzanie użytkownikami</h3>
                    <button mat-flat-button color="primary" (click)="addUser()">
                      <mat-icon>person_add</mat-icon>
                      <span>Dodaj użytkownika</span>
                    </button>
                  </div>

                  <table class="users-table">
                    <thead>
                      <tr>
                        <th>Imię i nazwisko</th>
                        <th>Email</th>
                        <th>Rola</th>
                        <th>Akcje</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let user of users">
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                          <mat-form-field appearance="outline">
                            <mat-select [(value)]="user.role">
                              <mat-option value="admin">Administrator</mat-option>
                              <mat-option value="tester">Tester</mat-option>
                              <mat-option value="viewer">Obserwator</mat-option>
                            </mat-select>
                          </mat-form-field>
                        </td>
                        <td class="actions-cell">
                          <button mat-icon-button color="warn" (click)="removeUser(user)">
                            <mat-icon>delete</mat-icon>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </mat-card-content>
              </mat-card>
            </mat-tab>

            <mat-tab label="Integracje">
              <mat-card class="settings-card">
                <mat-card-content>
                  <h3>Integracje z innymi systemami</h3>

                  <div class="integrations-list">
                    <div class="integration-item">
                      <div class="integration-info">
                        <div class="integration-icon jira">
                          <mat-icon>integration_instructions</mat-icon>
                        </div>
                        <div class="integration-details">
                          <h4>Jira</h4>
                          <p>Integracja z systemem zarządzania zadaniami Jira</p>
                        </div>
                      </div>
                      <div class="integration-status">
                        <div class="status-badge connected">Połączono</div>
                        <button mat-button color="primary">Konfiguruj</button>
                      </div>
                    </div>

                    <div class="integration-item">
                      <div class="integration-info">
                        <div class="integration-icon gitlab">
                          <mat-icon>integration_instructions</mat-icon>
                        </div>
                        <div class="integration-details">
                          <h4>GitLab</h4>
                          <p>Integracja z systemem kontroli wersji GitLab</p>
                        </div>
                      </div>
                      <div class="integration-status">
                        <div class="status-badge">Niepołączono</div>
                        <button mat-button color="primary">Połącz</button>
                      </div>
                    </div>

                    <div class="integration-item">
                      <div class="integration-info">
                        <div class="integration-icon slack">
                          <mat-icon>integration_instructions</mat-icon>
                        </div>
                        <div class="integration-details">
                          <h4>Slack</h4>
                          <p>Integracja z komunikatorem Slack</p>
                        </div>
                      </div>
                      <div class="integration-status">
                        <div class="status-badge">Niepołączono</div>
                        <button mat-button color="primary">Połącz</button>
                      </div>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </mat-tab>
          </mat-tab-group>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .project-settings-container {
      .settings-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .full-width {
        width: 100%;
      }

      .project-selection-card {
        .project-option {
          display: flex;
          align-items: center;

          .color-dot {
            width: 12px;
            height: 12px;
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

            &.orange {
              background-color: #ff9800;
            }

            &.red {
              background-color: #f44336;
            }
          }
        }
      }

      .settings-tabs {
        .form-container {
          padding: 16px 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .settings-card {
          h3 {
            font-size: 16px;
            font-weight: 500;
            margin-top: 0;
            margin-bottom: 16px;
          }

          .color-option {
            display: flex;
            align-items: center;

            .color-preview {
              width: 16px;
              height: 16px;
              border-radius: 4px;
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

              &.orange {
                background-color: #ff9800;
              }

              &.red {
                background-color: #f44336;
              }
            }
          }

          .settings-toggles {
            .setting-row {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding: 12px 0;
              border-bottom: 1px solid rgba(0, 0, 0, 0.12);

              .dark-theme & {
                border-bottom-color: rgba(255, 255, 255, 0.12);
              }

              &:last-child {
                border-bottom: none;
              }

              .setting-description {
                flex: 1;
                padding-right: 24px;

                .setting-name {
                  font-weight: 500;
                  margin-bottom: 4px;
                }

                .setting-details {
                  font-size: 14px;
                  color: var(--text-secondary);
                }
              }
            }
          }

          .users-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }

          .users-table {
            width: 100%;
            border-collapse: collapse;

            th, td {
              padding: 12px 16px;
              text-align: left;
              border-bottom: 1px solid rgba(0, 0, 0, 0.12);

              .dark-theme & {
                border-bottom-color: rgba(255, 255, 255, 0.12);
              }
            }

            th {
              font-weight: 500;
              color: var(--text-secondary);
            }

            td.actions-cell {
              width: 60px;
              text-align: right;
            }

            mat-form-field {
              width: 100%;

              ::ng-deep .mat-mdc-form-field-subscript-wrapper {
                display: none;
              }
            }
          }

          .integrations-list {
            .integration-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 16px 0;
              border-bottom: 1px solid rgba(0, 0, 0, 0.12);

              .dark-theme & {
                border-bottom-color: rgba(255, 255, 255, 0.12);
              }

              &:last-child {
                border-bottom: none;
              }

              .integration-info {
                display: flex;
                align-items: center;

                .integration-icon {
                  width: 40px;
                  height: 40px;
                  border-radius: 4px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-right: 16px;

                  &.jira {
                    background-color: rgba(0, 82, 204, 0.1);
                    color: #0052cc;
                  }

                  &.gitlab {
                    background-color: rgba(226, 67, 41, 0.1);
                    color: #e24329;
                  }

                  &.slack {
                    background-color: rgba(74, 21, 75, 0.1);
                    color: #4a154b;
                  }
                }

                .integration-details {
                  h4 {
                    font-size: 16px;
                    font-weight: 500;
                    margin: 0 0 4px;
                  }

                  p {
                    font-size: 14px;
                    color: var(--text-secondary);
                    margin: 0;
                  }
                }
              }

              .integration-status {
                display: flex;
                align-items: center;

                .status-badge {
                  font-size: 12px;
                  padding: 4px 8px;
                  border-radius: 12px;
                  background-color: rgba(0, 0, 0, 0.08);
                  color: var(--text-secondary);
                  margin-right: 12px;

                  .dark-theme & {
                    background-color: rgba(255, 255, 255, 0.08);
                  }

                  &.connected {
                    background-color: rgba(76, 175, 80, 0.1);
                    color: #4caf50;
                  }
                }
              }
            }
          }
        }
      }
    }
  `]
})
export class ProjectSettingsComponent implements OnInit {
  projects: Project[] = [];
  selectedProjectId: string = '';
  selectedProject: Project | null = null;
  projectForm: FormGroup;

  users: User[] = [
    { id: 'user1', name: 'Jan Kowalski', email: 'jan.kowalski@example.com', role: 'admin' },
    { id: 'user2', name: 'Anna Nowak', email: 'anna.nowak@example.com', role: 'tester' },
    { id: 'user3', name: 'Tomasz Kowalczyk', email: 'tomasz.kowalczyk@example.com', role: 'viewer' }
  ];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.projectForm = this.createProjectForm();
  }

  ngOnInit() {
    this.projectService.projects$.subscribe(projects => {
      this.projects = projects;
      if (projects.length > 0 && !this.selectedProjectId) {
        this.selectedProjectId = projects[0].id;
        this.onProjectChange();
      }
    });
  }

  createProjectForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: [''],
      color: ['blue'],
      autoFlagTests: [false],
      requireFailComments: [true],
      autoGenerateReports: [false]
    });
  }

  onProjectChange() {
    this.selectedProject = this.projects.find(p => p.id === this.selectedProjectId) || null;

    if (this.selectedProject) {
      // In a real application, you would fetch the project settings
      // This is a simplified example
      this.projectForm.patchValue({
        name: this.selectedProject.name,
        description: this.selectedProject.description || '',
        color: this.selectedProject.color,
        autoFlagTests: false,
        requireFailComments: true,
        autoGenerateReports: false
      });
    }
  }

  saveSettings() {
    if (this.projectForm.invalid) {
      this.snackBar.open('Proszę poprawić błędy w formularzu', 'OK', { duration: 3000 });
      return;
    }

    if (this.selectedProject) {
      const formValue = this.projectForm.value;
      this.projectService.updateProject(this.selectedProject.id, {
        name: formValue.name,
        description: formValue.description,
        color: formValue.color
      });

      // In a real application, you would also update the project settings
      this.snackBar.open('Ustawienia projektu zostały zapisane', 'OK', { duration: 3000 });
    }
  }

  addUser() {
    // In a real application, you would open a dialog to add a user
    this.snackBar.open('Funkcja dodawania użytkownika nie jest zaimplementowana', 'OK', { duration: 3000 });
  }

  removeUser(user: User) {
    // In a real application, you would ask for confirmation
    this.snackBar.open(`Usunięto użytkownika: ${user.name}`, 'OK', { duration: 3000 });
    this.users = this.users.filter(u => u.id !== user.id);
  }
}
