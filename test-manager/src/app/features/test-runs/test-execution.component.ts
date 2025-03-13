import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StatusChipComponent } from '../../shared/ui/status-chip/status-chip.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { ApiService } from '../../core/services/api.service';
import { TestCase } from '../../core/models/test-case.model';
import { TestRun } from '../../core/models/test-run.model';

interface TestStep {
  action: string;
  expected: string;
  status: 'not-started' | 'passed' | 'failed' | 'blocked';
  comment: string;
  evidence?: string;
}

@Component({
  selector: 'app-test-execution',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatTooltipModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    StatusChipComponent,
    PageHeaderComponent
  ],
  template: `
    <div class="test-execution-container" *ngIf="testCase && testRun">
      <app-page-header [title]="'Wykonanie testu: ' + testCase.name">
        <button mat-stroked-button color="primary" (click)="pauseExecution()">
          <mat-icon>pause</mat-icon>
          <span>Wstrzymaj</span>
        </button>
        <button mat-flat-button color="primary" (click)="completeExecution()" [disabled]="!canComplete()">
          <mat-icon>done_all</mat-icon>
          <span>Zakończ</span>
        </button>
      </app-page-header>

      <div class="execution-info">
        <mat-card class="info-card">
          <mat-card-content>
            <div class="info-row">
              <div class="info-label">Projekt:</div>
              <div class="project-indicator">
                <div class="color-dot" [ngClass]="testCase.project.color"></div>
                <span>{{ testCase.project.name }}</span>
              </div>
            </div>

            <div class="info-row">
              <div class="info-label">Wykonanie:</div>
              <div>{{ testRun.name }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">Postęp:</div>
              <div class="progress-indicator">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="getProgressPercentage()"></div>
                </div>
                <div class="progress-text">{{ getCompletedSteps() }}/{{ testSteps.length }}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-results">
              <div class="result-item passed">
                <div class="result-count">{{ getPassed() }}</div>
                <div class="result-label">Zaliczone</div>
              </div>

              <div class="result-item failed">
                <div class="result-count">{{ getFailed() }}</div>
                <div class="result-label">Niezaliczone</div>
              </div>

              <div class="result-item blocked">
                <div class="result-count">{{ getBlocked() }}</div>
                <div class="result-label">Zablokowane</div>
              </div>

              <div class="result-item not-started">
                <div class="result-count">{{ getNotStarted() }}</div>
                <div class="result-label">Nierozpoczęte</div>
              </div>
            </div>

            <mat-divider class="summary-divider"></mat-divider>

            <div class="execution-duration">
              <div class="duration-label">Czas wykonania:</div>
              <div class="duration-time">00:15:42</div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="steps-card">
        <mat-card-content>
          <h3>Kroki testowe</h3>

          <mat-stepper #stepper linear>
            <mat-step *ngFor="let step of testSteps; let i = index" [completed]="step.status !== 'not-started'">
              <ng-template matStepLabel>Krok {{ i + 1 }}</ng-template>

              <div class="step-container">
                <div class="step-details">
                  <div class="step-section">
                    <h4>Akcja:</h4>
                    <p>{{ step.action }}</p>
                  </div>

                  <div class="step-section">
                    <h4>Oczekiwany rezultat:</h4>
                    <p>{{ step.expected }}</p>
                  </div>
                </div>

                <div class="step-results">
                  <div class="result-status">
                    <label class="result-label">Status:</label>
                    <div class="status-options">
                      <mat-radio-group [(ngModel)]="step.status" (change)="updateProgress()">
                        <mat-radio-button value="passed" color="primary" class="status-option">
                          <span class="status-text passed">Zaliczony</span>
                        </mat-radio-button>
                        <mat-radio-button value="failed" color="warn" class="status-option">
                          <span class="status-text failed">Niezaliczony</span>
                        </mat-radio-button>
                        <mat-radio-button value="blocked" color="accent" class="status-option">
                          <span class="status-text blocked">Zablokowany</span>
                        </mat-radio-button>
                      </mat-radio-group>
                    </div>
                  </div>

                  <mat-form-field appearance="outline" class="comment-field">
                    <mat-label>Komentarz</mat-label>
                    <textarea matInput [(ngModel)]="step.comment" rows="2"></textarea>
                  </mat-form-field>

                  <div class="evidence-section">
                    <button mat-stroked-button type="button" class="evidence-button">
                      <mat-icon>attach_file</mat-icon>
                      <span>Dodaj załącznik</span>
                    </button>

                    <p class="no-evidence" *ngIf="!step.evidence">Brak załączników</p>
                  </div>
                </div>
              </div>

              <div class="step-navigation">
                <button mat-button *ngIf="i > 0" (click)="stepper.previous()">
                  <mat-icon>arrow_back</mat-icon> Poprzedni krok
                </button>
                <span class="spacer"></span>
                <button mat-button *ngIf="i < testSteps.length - 1" (click)="stepper.next()" color="primary">
                  Następny krok <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </mat-step>
          </mat-stepper>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .test-execution-container {
      .execution-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 16px;

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      }

      .info-card {
        .info-row {
          display: flex;
          align-items: center;
          margin-bottom: 16px;

          .info-label {
            width: 100px;
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

          .progress-indicator {
            display: flex;
            align-items: center;
            width: 100%;

            .progress-bar {
              flex: 1;
              height: 8px;
              background-color: rgba(0, 0, 0, 0.1);
              border-radius: 4px;
              overflow: hidden;
              margin-right: 8px;

              .dark-theme & {
                background-color: rgba(255, 255, 255, 0.1);
              }

              .progress-fill {
                height: 100%;
                background-color: #4caf50;
                border-radius: 4px;
              }
            }

            .progress-text {
              font-size: 14px;
              color: var(--text-secondary);
            }
          }
        }
      }

      .summary-card {
        .summary-results {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;

          .result-item {
            text-align: center;

            .result-count {
              font-size: 32px;
              font-weight: 500;

              &.passed, .passed & {
                color: #4caf50;
              }

              &.failed, .failed & {
                color: #f44336;
              }

              &.blocked, .blocked & {
                color: #ff9800;
              }

              &.not-started, .not-started & {
                color: var(--text-secondary);
              }
            }

            .result-label {
              font-size: 14px;
              color: var(--text-secondary);
            }
          }
        }

        .summary-divider {
          margin: 16px 0;
        }

        .execution-duration {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .duration-time {
            font-weight: 500;
          }
        }
      }

      .steps-card {
        h3 {
          font-size: 16px;
          font-weight: 500;
          margin-top: 0;
          margin-bottom: 16px;
        }

        .step-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin: 16px 0;

          @media (max-width: 992px) {
            grid-template-columns: 1fr;
          }

          .step-details {
            .step-section {
              margin-bottom: 16px;

              h4 {
                font-size: 14px;
                font-weight: 500;
                margin: 0 0 8px;
                color: var(--text-secondary);
              }

              p {
                margin: 0;
                line-height: 1.5;
              }
            }
          }

          .step-results {
            .result-status {
              margin-bottom: 16px;

              .result-label {
                display: block;
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 8px;
                color: var(--text-secondary);
              }

              .status-options {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;

                .status-option {
                  margin-right: 0;

                  .status-text {
                    margin-left: 4px;

                    &.passed {
                      color: #4caf50;
                    }

                    &.failed {
                      color: #f44336;
                    }

                    &.blocked {
                      color: #ff9800;
                    }
                  }
                }
              }
            }

            .comment-field {
              width: 100%;
              margin-bottom: 16px;
            }

            .evidence-section {
              .evidence-button {
                margin-bottom: 8px;
              }

              .no-evidence {
                font-size: 14px;
                color: var(--text-secondary);
                margin: 8px 0;
              }
            }
          }
        }

        .step-navigation {
          display: flex;
          padding-top: 16px;

          .spacer {
            flex: 1;
          }
        }
      }
    }
  `]
})
export class TestExecutionComponent implements OnInit {
  testCase: TestCase | null = null;
  testRun: TestRun | null = null;
  testSteps: TestStep[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const runId = params.get('id');
      if (runId) {
        this.loadTestRun(runId);
      }
    });
  }

  loadTestRun(runId: string) {
    // In a real application, you would fetch the test run and associated test case
    // This is a simplified example
    this.testRun = {
      id: runId,
      name: 'Testy modułu płatności - Wykonanie #1',
      project: 'Portal klienta',
      progress: { current: 2, total: 5, percentage: 40 }
    };

    this.apiService.getTestCaseById('TC-001').subscribe(testCase => {
      this.testCase = testCase;
      this.initializeTestSteps();
    });
  }

  initializeTestSteps() {
    // In a real application, you would initialize steps from the test case
    // This is a simplified example
    this.testSteps = [
      {
        action: 'Przejdź do strony logowania portalu',
        expected: 'Strona logowania wyświetla się poprawnie',
        status: 'passed',
        comment: 'Strona działa poprawnie'
      },
      {
        action: 'Wprowadź poprawny login i hasło',
        expected: 'Pola przyjmują wprowadzane wartości',
        status: 'passed',
        comment: 'Pola działają prawidłowo'
      },
      {
        action: 'Kliknij przycisk "Zaloguj"',
        expected: 'Użytkownik zostaje zalogowany i przekierowany do strony głównej',
        status: 'not-started',
        comment: ''
      },
      {
        action: 'Kliknij przycisk "Wyloguj"',
        expected: 'Użytkownik zostaje wylogowany i przekierowany do strony logowania',
        status: 'not-started',
        comment: ''
      },
      {
        action: 'Wprowadź niepoprawne hasło i kliknij "Zaloguj"',
        expected: 'System wyświetla komunikat o błędnych danych logowania',
        status: 'not-started',
        comment: ''
      }
    ];

    this.updateProgress();
  }

  updateProgress() {
    if (this.testRun && this.testSteps.length > 0) {
      const completed = this.getCompletedSteps();
      const total = this.testSteps.length;
      const percentage = Math.round((completed / total) * 100);

      this.testRun.progress = {
        current: completed,
        total: total,
        percentage: percentage
      };
    }
  }

  getProgressPercentage(): number {
    return this.testRun?.progress?.percentage || 0;
  }

  getCompletedSteps(): number {
    return this.testSteps.filter(step => step.status !== 'not-started').length;
  }

  getPassed(): number {
    return this.testSteps.filter(step => step.status === 'passed').length;
  }

  getFailed(): number {
    return this.testSteps.filter(step => step.status === 'failed').length;
  }

  getBlocked(): number {
    return this.testSteps.filter(step => step.status === 'blocked').length;
  }

  getNotStarted(): number {
    return this.testSteps.filter(step => step.status === 'not-started').length;
  }

  canComplete(): boolean {
    return this.getNotStarted() === 0;
  }

  pauseExecution() {
    this.snackBar.open('Wykonanie testu zostało wstrzymane', 'OK', { duration: 3000 });
    this.router.navigate(['/test-runs']);
  }

  completeExecution() {
    if (this.getNotStarted() > 0) {
      this.snackBar.open('Nie wszystkie kroki zostały wykonane', 'OK', { duration: 3000 });
      return;
    }

    // In a real application, you would save the test run results
    this.snackBar.open('Wykonanie testu zostało zakończone', 'OK', { duration: 3000 });
    this.router.navigate(['/test-runs/details', this.testRun?.id]);
  }
}
