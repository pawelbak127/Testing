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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  date: string;
  project: string;
}

interface Notification {
  id: string;
  type: string;
  message: string;
  date: string;
  read: boolean;
}

@Component({
  selector: 'app-user-profile',
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
    MatSlideToggleModule,
    MatDividerModule,
    MatTableModule,
    MatSnackBarModule,
    PageHeaderComponent
  ],
  template: `
    <div class="user-profile-container">
      <app-page-header title="Profil użytkownika"></app-page-header>

      <div class="profile-content">
        <div class="profile-sidebar">
          <mat-card class="user-card">
            <mat-card-content>
              <div class="user-avatar">
                <div class="avatar-circle">JK</div>
                <button mat-icon-button class="edit-avatar">
                  <mat-icon>edit</mat-icon>
                </button>
              </div>

              <div class="user-name">Jan Kowalski</div>
              <div class="user-email">jan.kowalski&#64;example.com</div>

              <div class="user-role">
                <span class="role-badge">Administrator</span>
              </div>

              <mat-divider class="divider"></mat-divider>

              <div class="user-stats">
                <div class="stat-item">
                  <div class="stat-value">124</div>
                  <div class="stat-label">Wykonane testy</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">3</div>
                  <div class="stat-label">Projekty</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="projects-card">
            <mat-card-content>
              <h3>Moje projekty</h3>

              <div class="projects-list">
                <div class="project-item">
                  <div class="project-color green"></div>
                  <div class="project-info">
                    <div class="project-name">Portal klienta</div>
                    <div class="project-role">Administrator</div>
                  </div>
                </div>

                <div class="project-item">
                  <div class="project-color blue"></div>
                  <div class="project-info">
                    <div class="project-name">Backend API</div>
                    <div class="project-role">Tester</div>
                  </div>
                </div>

                <div class="project-item">
                  <div class="project-color purple"></div>
                  <div class="project-info">
                    <div class="project-name">Aplikacja mobilna</div>
                    <div class="project-role">Obserwator</div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="profile-main">
          <mat-tab-group>
            <mat-tab label="Edycja profilu">
              <form [formGroup]="profileForm" class="form-container">
                <mat-card class="profile-card">
                  <mat-card-content>
                    <h3>Dane osobowe</h3>

                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Imię</mat-label>
                        <input matInput formControlName="firstName">
                        <mat-error *ngIf="profileForm.get('firstName')?.hasError('required')">
                          Imię jest wymagane
                        </mat-error>
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Nazwisko</mat-label>
                        <input matInput formControlName="lastName">
                        <mat-error *ngIf="profileForm.get('lastName')?.hasError('required')">
                          Nazwisko jest wymagane
                        </mat-error>
                      </mat-form-field>
                    </div>

                    <div class="form-row">
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Email</mat-label>
                        <input matInput formControlName="email" type="email">
                        <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
                          Email jest wymagany
                        </mat-error>
                        <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
                          Podaj poprawny adres email
                        </mat-error>
                      </mat-form-field>
                    </div>

                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Stanowisko</mat-label>
                        <input matInput formControlName="position">
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Dział</mat-label>
                        <input matInput formControlName="department">
                      </mat-form-field>
                    </div>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Opis</mat-label>
                      <textarea matInput formControlName="bio" rows="3"></textarea>
                    </mat-form-field>
                  </mat-card-content>
                </mat-card>

                <mat-card class="profile-card">
                  <mat-card-content>
                    <h3>Zmiana hasła</h3>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Aktualne hasło</mat-label>
                      <input matInput formControlName="currentPassword" type="password">
                    </mat-form-field>

                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Nowe hasło</mat-label>
                        <input matInput formControlName="newPassword" type="password">
                        <mat-error *ngIf="profileForm.get('newPassword')?.hasError('minlength')">
                          Hasło musi mieć co najmniej 8 znaków
                        </mat-error>
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Powtórz nowe hasło</mat-label>
                        <input matInput formControlName="confirmPassword" type="password">
                        <mat-error *ngIf="profileForm.get('confirmPassword')?.hasError('passwordMismatch')">
                          Hasła nie są zgodne
                        </mat-error>
                      </mat-form-field>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="profile-card">
                  <mat-card-content>
                    <h3>Preferencje</h3>

                    <div class="settings-toggles">
                      <div class="setting-row">
                        <div class="setting-description">
                          <div class="setting-name">Powiadomienia email</div>
                          <div class="setting-details">Otrzymuj powiadomienia na adres email</div>
                        </div>
                        <mat-slide-toggle formControlName="emailNotifications" color="primary"></mat-slide-toggle>
                      </div>

                      <div class="setting-row">
                        <div class="setting-description">
                          <div class="setting-name">Powiadomienia o wykonaniach testów</div>
                          <div class="setting-details">Otrzymuj powiadomienia o zakończonych wykonaniach testów</div>
                        </div>
                        <mat-slide-toggle formControlName="testRunNotifications" color="primary"></mat-slide-toggle>
                      </div>

                      <div class="setting-row">
                        <div class="setting-description">
                          <div class="setting-name">Powiadomienia o błędach</div>
                          <div class="setting-details">Otrzymuj powiadomienia o nowych błędach</div>
                        </div>
                        <mat-slide-toggle formControlName="defectNotifications" color="primary"></mat-slide-toggle>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <div class="form-actions">
                  <button mat-button (click)="resetForm()">Anuluj zmiany</button>
                  <button mat-flat-button color="primary" [disabled]="profileForm.invalid || !profileForm.dirty" (click)="saveProfile()">
                    Zapisz zmiany
                  </button>
                </div>
              </form>
            </mat-tab>

            <mat-tab label="Aktywność">
              <mat-card class="profile-card">
                <mat-card-content>
                  <h3>Historia aktywności</h3>

                  <div class="activity-list">
                    <div class="activity-item" *ngFor="let activity of activityItems">
                      <div class="activity-icon" [ngClass]="activity.type">
                        <mat-icon>{{ getActivityIcon(activity.type) }}</mat-icon>
                      </div>
                      <div class="activity-content">
                        <div class="activity-description">{{ activity.description }}</div>
                        <div class="activity-meta">
                          <div class="activity-project">{{ activity.project }}</div>
                          <div class="activity-date">{{ activity.date }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </mat-tab>

            <mat-tab label="Powiadomienia">
              <mat-card class="profile-card">
                <mat-card-content>
                  <div class="notifications-header">
                    <h3>Powiadomienia</h3>
                    <button mat-button color="primary" (click)="markAllAsRead()">
                      Oznacz wszystkie jako przeczytane
                    </button>
                  </div>

                  <div class="notifications-list">
                    <div class="notification-item" *ngFor="let notification of notifications" [ngClass]="{'unread': !notification.read}">
                      <div class="notification-icon" [ngClass]="notification.type">
                        <mat-icon>{{ getNotificationIcon(notification.type) }}</mat-icon>
                      </div>
                      <div class="notification-content">
                        <div class="notification-message">{{ notification.message }}</div>
                        <div class="notification-date">{{ notification.date }}</div>
                      </div>
                      <button mat-icon-button (click)="markAsRead(notification)" *ngIf="!notification.read">
                        <mat-icon>check_circle</mat-icon>
                      </button>
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
    .user-profile-container {
      .profile-content {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 16px;
        margin-top: 16px;

        @media (max-width: 992px) {
          grid-template-columns: 1fr;
        }
      }

      .profile-sidebar {
        display: flex;
        flex-direction: column;
        gap: 16px;

        @media (max-width: 992px) {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }
      }

      .user-card {
        text-align: center;
        padding: 16px 0;

        .user-avatar {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 16px;

          .avatar-circle {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #3f51b5;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
          }

          .edit-avatar {
            position: absolute;
            bottom: 0;
            right: 0;
            background-color: var(--card-background);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        }

        .user-name {
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .user-email {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }

        .user-role {
          margin-bottom: 16px;

          .role-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            background-color: rgba(63, 81, 181, 0.1);
            color: #3f51b5;
            font-size: 12px;
            font-weight: 500;
          }
        }

        .divider {
          margin: 0 16px 16px;
        }

        .user-stats {
          display: flex;
          justify-content: space-around;

          .stat-item {
            .stat-value {
              font-size: 24px;
              font-weight: 500;
              margin-bottom: 4px;
            }

            .stat-label {
              font-size: 12px;
              color: var(--text-secondary);
            }
          }
        }
      }

      .projects-card {
        h3 {
          font-size: 16px;
          font-weight: 500;
          margin-top: 0;
          margin-bottom: 16px;
        }

        .projects-list {
          .project-item {
            display: flex;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.12);

            .dark-theme & {
              border-bottom-color: rgba(255, 255, 255, 0.12);
            }

            &:last-child {
              border-bottom: none;
            }

            .project-color {
              width: 12px;
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

            .project-info {
              flex: 1;

              .project-name {
                font-weight: 500;
                margin-bottom: 4px;
              }

              .project-role {
                font-size: 12px;
                color: var(--text-secondary);
              }
            }
          }
        }
      }

      .profile-main {
        mat-tab-group {
          ::ng-deep .mat-mdc-tab-body-wrapper {
            padding: 16px 0;
          }
        }

        .form-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .profile-card {
          h3 {
            font-size: 16px;
            font-weight: 500;
            margin-top: 0;
            margin-bottom: 16px;
          }

          .form-row {
            display: flex;
            gap: 16px;

            mat-form-field {
              flex: 1;
            }

            @media (max-width: 600px) {
              flex-direction: column;
              gap: 0;
            }
          }

          .full-width {
            width: 100%;
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
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 8px;
        }

        .activity-list {
          .activity-item {
            display: flex;
            padding: 12px 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.12);

            .dark-theme & {
              border-bottom-color: rgba(255, 255, 255, 0.12);
            }

            &:last-child {
              border-bottom: none;
            }

            .activity-icon {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 16px;

              &.test-run {
                background-color: rgba(33, 150, 243, 0.1);
                color: #2196f3;
              }

              &.test-case {
                background-color: rgba(76, 175, 80, 0.1);
                color: #4caf50;
              }

              &.defect {
                background-color: rgba(244, 67, 54, 0.1);
                color: #f44336;
              }

              &.report {
                background-color: rgba(156, 39, 176, 0.1);
                color: #9c27b0;
              }
            }

            .activity-content {
              flex: 1;

              .activity-description {
                margin-bottom: 4px;
              }

              .activity-meta {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: var(--text-secondary);
              }
            }
          }
        }

        .notifications-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .notifications-list {
          .notification-item {
            display: flex;
            align-items: center;
            padding: 12px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.12);

            .dark-theme & {
              border-bottom-color: rgba(255, 255, 255, 0.12);
            }

            &:last-child {
              border-bottom: none;
            }

            &.unread {
              background-color: rgba(63, 81, 181, 0.05);

              .dark-theme & {
                background-color: rgba(63, 81, 181, 0.1);
              }
            }

            .notification-icon {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 16px;

              &.test-run {
                background-color: rgba(33, 150, 243, 0.1);
                color: #2196f3;
              }

              &.test-case {
                background-color: rgba(76, 175, 80, 0.1);
                color: #4caf50;
              }

              &.defect {
                background-color: rgba(244, 67, 54, 0.1);
                color: #f44336;
              }

              &.report {
                background-color: rgba(156, 39, 176, 0.1);
                color: #9c27b0;
              }

              &.system {
                background-color: rgba(255, 152, 0, 0.1);
                color: #ff9800;
              }
            }

            .notification-content {
              flex: 1;

              .notification-message {
                margin-bottom: 4px;
              }

              .notification-date {
                font-size: 12px;
                color: var(--text-secondary);
              }
            }
          }
        }
      }
    }
  `]
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;

  activityItems: ActivityItem[] = [
    { id: '1', type: 'test-run', description: 'Wykonanie testu "Testy modułu płatności"', date: '12 mar 2025, 11:30', project: 'Portal klienta' },
    { id: '2', type: 'test-case', description: 'Utworzenie przypadku testowego "Rejestracja nowego użytkownika"', date: '10 mar 2025, 14:15', project: 'Portal klienta' },
    { id: '3', type: 'defect', description: 'Zgłoszenie błędu "Błąd podczas przetwarzania płatności kartą"', date: '10 mar 2025, 11:05', project: 'Portal klienta' },
    { id: '4', type: 'report', description: 'Wygenerowanie raportu "Raport wydajności tygodniowy"', date: '8 mar 2025, 16:30', project: 'Backend API' },
    { id: '5', type: 'test-run', description: 'Wykonanie testu "Testy wydajnościowe API"', date: '5 mar 2025, 10:45', project: 'Backend API' }
  ];

  notifications: Notification[] = [
    { id: '1', type: 'test-run', message: 'Wykonanie testu "Testy modułu płatności" zostało zakończone', date: '12 mar 2025, 11:30', read: false },
    { id: '2', type: 'defect', message: 'Nowy błąd: "Błąd podczas przetwarzania płatności kartą"', date: '10 mar 2025, 11:05', read: false },
    { id: '3', type: 'system', message: 'Zaplanowany przegląd techniczny systemu w dniu 15 marca', date: '9 mar 2025, 09:15', read: true },
    { id: '4', type: 'test-case', message: 'Anna Nowak zaktualizowała przypadek testowy "Rejestracja nowego użytkownika"', date: '8 mar 2025, 14:50', read: true },
    { id: '5', type: 'report', message: 'Nowy raport: "Raport wydajności tygodniowy" jest dostępny', date: '8 mar 2025, 16:30', read: true }
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.createProfileForm();
  }

  ngOnInit() {
    // In a real application, you would fetch user data
    this.populateForm();
  }

  createProfileForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: [''],
      department: [''],
      bio: [''],
      currentPassword: [''],
      newPassword: ['', Validators.minLength(8)],
      confirmPassword: [''],
      emailNotifications: [true],
      testRunNotifications: [true],
      defectNotifications: [true]
    });
  }

  populateForm() {
    // In a real application, you would fetch this data from an API
    this.profileForm.patchValue({
      firstName: 'Jan',
      lastName: 'Kowalski',
      email: 'jan.kowalski@example.com',
      position: 'QA Engineer',
      department: 'Quality Assurance',
      bio: 'Doświadczony tester oprogramowania z ponad 5-letnim doświadczeniem w testowaniu aplikacji internetowych i mobilnych.',
      emailNotifications: true,
      testRunNotifications: true,
      defectNotifications: true
    });

    // Mark the form as pristine to prevent saving without changes
    this.profileForm.markAsPristine();
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'test-run': return 'play_circle';
      case 'test-case': return 'assignment';
      case 'defect': return 'bug_report';
      case 'report': return 'assessment';
      default: return 'info';
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'test-run': return 'play_circle';
      case 'test-case': return 'assignment';
      case 'defect': return 'bug_report';
      case 'report': return 'assessment';
      case 'system': return 'settings';
      default: return 'notifications';
    }
  }

  resetForm() {
    this.populateForm();
    this.snackBar.open('Formularz został zresetowany', 'OK', { duration: 3000 });
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.snackBar.open('Proszę poprawić błędy w formularzu', 'OK', { duration: 3000 });
      return;
    }

    // In a real application, you would send the form data to an API
    this.snackBar.open('Profil został zaktualizowany', 'OK', { duration: 3000 });
    this.profileForm.markAsPristine();
  }

  markAsRead(notification: Notification) {
    notification.read = true;
    this.snackBar.open('Powiadomienie oznaczone jako przeczytane', 'OK', { duration: 3000 });
  }

  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.snackBar.open('Wszystkie powiadomienia oznaczone jako przeczytane', 'OK', { duration: 3000 });
  }
}
