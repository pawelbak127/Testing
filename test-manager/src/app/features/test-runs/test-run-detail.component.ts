import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StatusChipComponent } from '../../shared/ui/status-chip/status-chip.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { ApiService } from '../../core/services/api.service';
import { TestRun } from '../../core/models/test-run.model';
import {getStatusColorClass} from '../../shared/utils/color-utils';

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'blocked' | 'not-started';
  duration: string;
  executor: string;
}

@Component({
  selector: 'app-test-run-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatDividerModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatTooltipModule,
    StatusChipComponent,
    PageHeaderComponent
  ],
  template: `
    <div class="test-run-detail-container" *ngIf="testRun">
      <app-page-header [title]="testRun.name">
        <button mat-stroked-button color="primary" *ngIf="isActive" (click)="continueExecution()">
          <mat-icon>play_arrow</mat-icon>
          <span>Kontynuuj</span>
        </button>
        <button mat-flat-button color="primary" *ngIf="isCompleted" (click)="generateReport()">
          <mat-icon>assignment</mat-icon>
          <span>Generuj raport</span>
        </button>
      </app-page-header>

      <div class="overview-cards">
        <mat-card class="info-card">
          <mat-card-content>
            <div class="info-row">
              <div class="info-label">Projekt:</div>
              <div>{{ testRun.project }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">Status:</div>
              <app-status-chip [text]="getStatusText()" [color]="getStatusColor()"></app-status-chip>
            </div>

            <div class="info-row">
              <div class="info-label">Rozpoczęto:</div>
              <div>{{ startDate }}</div>
            </div>

            <div class="info-row" *ngIf="endDate">
              <div class="info-label">Zakończono:</div>
              <div>{{ endDate }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">Osoba:</div>
              <div>{{ executor }}</div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="progress-card" *ngIf="testRun.progress">
          <mat-card-content>
            <h3>Postęp</h3>

            <div class="progress-container">
              <div class="progress-label">{{ testRun.progress.current }}/{{ testRun.progress.total }} testów</div>
              <mat-progress-bar mode="determinate" [value]="testRun.progress.percentage"></mat-progress-bar>
              <div class="progress-percentage">{{ testRun.progress.percentage }}%</div>
            </div>

            <div class="progress-stats">
              <div class="stat-item passed">
                <mat-icon>check_circle</mat-icon>
                <div class="stat-label">Zaliczone</div>
                <div class="stat-value">{{ passedCount }}</div>
              </div>

              <div class="stat-item failed">
                <mat-icon>error</mat-icon>
                <div class="stat-label">Niezaliczone</div>
                <div class="stat-value">{{ failedCount }}</div>
              </div>

              <div class="stat-item blocked">
                <mat-icon>block</mat-icon>
                <div class="stat-label">Zablokowane</div>
                <div class="stat-value">{{ blockedCount }}</div>
              </div>

              <div class="stat-item remaining">
                <mat-icon>hourglass_empty</mat-icon>
                <div class="stat-label">Pozostałe</div>
                <div class="stat-value">{{ notStartedCount }}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="results-card" *ngIf="testRun.results">
          <mat-card-content>
            <h3>Wyniki</h3>

            <div class="results-summary">
              <div class="result-chart">
                <div class="chart-bar">
                  <div class="chart-segment passed"
                       [style.width.%]="getPercentage(testRun.results.success, testRun.results.success + testRun.results.errors)"
                       matTooltip="{{ testRun.results.success }} zaliczonych"></div>
                  <div class="chart-segment failed"
                       [style.width.%]="getPercentage(testRun.results.errors, testRun.results.success + testRun.results.errors)"
                       matTooltip="{{ testRun.results.errors }} niezaliczonych"></div>
                </div>
              </div>

              <div class="results-stats">
                <div class="stat-item">
                  <div class="stat-label">Pozytywne</div>
                  <div class="stat-value">{{ testRun.results.success }}</div>
                </div>

                <div class="stat-item">
                  <div class="stat-label">Negatywne</div>
                  <div class="stat-value">{{ testRun.results.errors }}</div>
                </div>

                <div class="stat-item">
                  <div class="stat-label">Skuteczność</div>
                  <div class="stat-value">{{ getSuccessRate() }}%</div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="tests-card">
        <mat-card-content>
          <mat-tab-group>
            <mat-tab label="Lista testów">
              <table class="tests-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nazwa</th>
                    <th>Status</th>
                    <th>Czas wykonania</th>
                    <th>Osoba</th>
                    <th>Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let test of testResults">
                    <td class="id-cell">{{ test.id }}</td>
                    <td class="name-cell">{{ test.name }}</td>
                    <td class="status-cell">
                      <span class="status-indicator" [ngClass]="test.status">
                        <mat-icon>
                          {{ getStatusIcon(test.status) }}
                        </mat-icon>
                        {{ getStatusLabel(test.status) }}
                      </span>
                    </td>
                    <td class="duration-cell">{{ test.duration }}</td>
                    <td class="executor-cell">{{ test.executor }}</td>
                    <td class="actions-cell">
                      <button mat-icon-button matTooltip="Zobacz szczegóły" (click)="viewTestDetails(test)">
                        <mat-icon>visibility</mat-icon>
                      </button>
                      <button mat-icon-button matTooltip="Wykonaj ponownie" *ngIf="isActive" (click)="executeTest(test)">
                        <mat-icon>replay</mat-icon>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </mat-tab>

            <mat-tab label="Defekty">
              <div class="defects-container" *ngIf="defects.length > 0">
                <mat-accordion>
                  <mat-expansion-panel *ngFor="let defect of defects">
                    <mat-expansion-panel-header>
                      <mat-panel-title>
                        {{ defect.id }}: {{ defect.title }}
                      </mat-panel-title>
                      <mat-panel-description>
                        <app-status-chip [text]="defect.severity" [color]="getSeverityColor(defect.severity)"></app-status-chip>
                      </mat-panel-description>
                    </mat-expansion-panel-header>

                    <div class="defect-details">
                      <div class="defect-info">
                        <div class="defect-row">
                          <div class="defect-label">Test:</div>
                          <div>{{ defect.testCase }}</div>
                        </div>

                        <div class="defect-row">
                          <div class="defect-label">Zgłaszający:</div>
                          <div>{{ defect.reporter }}</div>
                        </div>

                        <div class="defect-row">
                          <div class="defect-label">Data:</div>
                          <div>{{ defect.date }}</div>
                        </div>
                      </div>

                      <div class="defect-description">
                        <h4>Opis</h4>
                        <p>{{ defect.description }}</p>
                      </div>

                      <div class="defect-actions">
                        <button mat-stroked-button color="primary">
                          <mat-icon>bug_report</mat-icon>
                          <span>Zobacz w systemie zgłoszeń</span>
                        </button>
                      </div>
                    </div>
                  </mat-expansion-panel>
                </mat-accordion>
              </div>

              <div class="no-defects" *ngIf="defects.length === 0">
                <mat-icon>check_circle</mat-icon>
                <p>Brak zgłoszonych defektów dla tego wykonania.</p>
              </div>
            </mat-tab>

            <mat-tab label="Załączniki">
              <div class="attachments-container" *ngIf="attachments.length > 0">
                <div class="attachment-grid">
                  <mat-card *ngFor="let attachment of attachments" class="attachment-card">
                    <mat-card-content>
                      <div class="attachment-icon">
                        <mat-icon>{{ getAttachmentIcon(attachment.type) }}</mat-icon>
                      </div>

                      <div class="attachment-info">
                        <div class="attachment-name">{{ attachment.name }}</div>
                        <div class="attachment-details">
                          {{ attachment.size }} • {{ attachment.testCase }}
                        </div>
                      </div>

                      <button mat-icon-button matTooltip="Pobierz załącznik">
                        <mat-icon>download</mat-icon>
                      </button>
                    </mat-card-content>
                  </mat-card>
                </div>
              </div>

              <div class="no-attachments" *ngIf="attachments.length === 0">
                <mat-icon>image</mat-icon>
                <p>Brak załączników dla tego wykonania.</p>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .test-run-detail-container {
      .overview-cards {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 16px;
        margin-bottom: 16px;

        @media (max-width: 1200px) {
          grid-template-columns: 1fr 1fr;
        }

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
        }
      }

      .progress-card, .results-card {
        h3 {
          font-size: 16px;
          font-weight: 500;
          margin-top: 0;
          margin-bottom: 16px;
        }
      }

      .progress-card {
        .progress-container {
          display: flex;
          align-items: center;
          margin-bottom: 16px;

          .progress-label {
            width: 100px;
            font-size: 14px;
            margin-right: 8px;
          }

          .mat-progress-bar {
            flex: 1;
          }

          .progress-percentage {
            width: 60px;
            text-align: right;
            font-size: 14px;
            margin-left: 8px;
          }
        }

        .progress-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;

          @media (max-width: 992px) {
            grid-template-columns: repeat(2, 1fr);
          }

          .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;

            .mat-icon {
              margin-bottom: 4px;
            }

            &.passed .mat-icon {
              color: #4caf50;
            }

            &.failed .mat-icon {
              color: #f44336;
            }

            &.blocked .mat-icon {
              color: #ff9800;
            }

            &.remaining .mat-icon {
              color: #9e9e9e;
            }

            .stat-label {
              font-size: 12px;
              color: var(--text-secondary);
              margin-bottom: 4px;
            }

            .stat-value {
              font-weight: 500;
            }
          }
        }
      }

      .results-card {
        .results-summary {
          .result-chart {
            margin-bottom: 16px;

            .chart-bar {
              display: flex;
              height: 24px;
              border-radius: 4px;
              overflow: hidden;

              .chart-segment {
                height: 100%;

                &.passed {
                  background-color: #4caf50;
                }

                &.failed {
                  background-color: #f44336;
                }
              }
            }
          }

          .results-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;

            .stat-item {
              text-align: center;

              .stat-label {
                font-size: 12px;
                color: var(--text-secondary);
                margin-bottom: 4px;
              }

              .stat-value {
                font-size: 18px;
                font-weight: 500;
              }
            }
          }
        }
      }

      .tests-card {
        mat-tab-group {
          ::ng-deep .mat-mdc-tab-body-wrapper {
            padding: 16px 0;
          }
        }

        .tests-table {
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

          td.id-cell {
            width: 80px;
          }

          td.name-cell {
            min-width: 200px;
          }

          td.status-cell {
            width: 150px;

            .status-indicator {
              display: flex;
              align-items: center;

              .mat-icon {
                margin-right: 4px;
                font-size: 18px;
                width: 18px;
                height: 18px;
              }

              &.passed {
                color: #4caf50;
              }

              &.failed {
                color: #f44336;
              }

              &.blocked {
                color: #ff9800;
              }

              &.not-started {
                color: #9e9e9e;
              }
            }
          }

          td.actions-cell {
            width: 100px;
            text-align: right;
          }
        }

        .defects-container {
          .defect-details {
            .defect-info {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 16px;
              margin-bottom: 16px;

              @media (max-width: 768px) {
                grid-template-columns: 1fr;
              }

              .defect-row {
                .defect-label {
                  font-weight: 500;
                  margin-bottom: 4px;
                }
              }
            }

            .defect-description {
              margin-bottom: 16px;

              h4 {
                font-size: 14px;
                font-weight: 500;
                margin: 0 0 8px;
              }

              p {
                margin: 0;
                line-height: 1.5;
              }
            }
          }
        }

        .no-defects, .no-attachments {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 0;

          .mat-icon {
            font-size: 48px;
            width: 48px;
            height: 48px;
            opacity: 0.5;
            margin-bottom: 16px;
          }

          p {
            font-size: 16px;
            color: var(--text-secondary);
          }
        }

        .attachment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;

          .attachment-card {
            .mat-mdc-card-content {
              display: flex;
              align-items: center;
              padding: 12px;

              .attachment-icon {
                width: 40px;
                height: 40px;
                border-radius: 4px;
                background-color: rgba(0, 0, 0, 0.04);
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 12px;

                .dark-theme & {
                  background-color: rgba(255, 255, 255, 0.08);
                }
              }

              .attachment-info {
                flex: 1;

                .attachment-name {
                  font-weight: 500;
                  margin-bottom: 4px;
                }

                .attachment-details {
                  font-size: 12px;
                  color: var(--text-secondary);
                }
              }
            }
          }
        }
      }
    }
  `]
})
export class TestRunDetailComponent implements OnInit {
  testRun: TestRun | null = null;
  isActive = false;
  isCompleted = false;
  startDate = '12 mar 2025, 10:15';
  endDate = '12 mar 2025, 11:30';
  executor = 'Jan Kowalski';
  passedCount = 3;
  failedCount = 1;
  blockedCount = 1;
  notStartedCount = 0;

  testResults: TestResult[] = [
    { id: 'TC-001', name: 'Logowanie użytkownika z poprawnymi danymi', status: 'passed', duration: '00:05:12', executor: 'Jan Kowalski' },
    { id: 'TC-002', name: 'Rejestracja nowego użytkownika', status: 'passed', duration: '00:08:45', executor: 'Jan Kowalski' },
    { id: 'TC-003', name: 'Wyszukiwanie produktów według kategorii', status: 'passed', duration: '00:04:23', executor: 'Jan Kowalski' },
    { id: 'TC-004', name: 'Realizacja płatności kartą kredytową', status: 'failed', duration: '00:12:08', executor: 'Jan Kowalski' },
    { id: 'TC-005', name: 'Synchronizacja danych między aplikacjami', status: 'blocked', duration: 'N/A', executor: 'Jan Kowalski' }
  ];

  defects = [
    {
      id: 'DEF-123',
      title: 'Błąd podczas przetwarzania płatności kartą',
      severity: 'Krytyczny',
      testCase: 'TC-004: Realizacja płatności kartą kredytową',
      reporter: 'Jan Kowalski',
      date: '12 mar 2025, 11:05',
      description: 'Podczas próby realizacji płatności kartą system zwraca błąd 500. Problem występuje tylko dla kart Visa. Testy z kartami Mastercard przechodzą pomyślnie.'
    }
  ];

  attachments = [
    {
      name: 'błąd_płatności.png',
      type: 'image',
      size: '1.2 MB',
      testCase: 'TC-004: Realizacja płatności kartą kredytową'
    },
    {
      name: 'console_log.txt',
      type: 'text',
      size: '45 KB',
      testCase: 'TC-004: Realizacja płatności kartą kredytową'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadTestRun(id);
      }
    });
  }

  loadTestRun(id: string) {
    // In a real application, you would fetch the test run data
    // This is a simplified example
    if (id === 'TR-007') {
      this.testRun = {
        id: id,
        name: 'Testy modułu płatności',
        project: 'Portal klienta',
        progress: { current: 5, total: 5, percentage: 100 },
        results: { success: 3, errors: 2 }
      };
      this.isActive = false;
      this.isCompleted = true;
    } else {
      this.testRun = {
        id: id,
        name: 'Testy wydajnościowe API',
        project: 'Backend API',
        progress: { current: 18, total: 20, percentage: 90 }
      };
      this.isActive = true;
      this.isCompleted = false;
    }
  }

  getStatusText(): string {
    if (this.isCompleted) {
      return 'Zakończony';
    } else if (this.isActive) {
      return 'W toku';
    }
    return 'Zaplanowany';
  }

  getStatusColor(): string {
    if (this.isCompleted) {
      return 'success';
    } else if (this.isActive) {
      return 'accent';
    }
    return 'primary';
  }

  getPercentage(value: number, total: number): number {
    return total > 0 ? (value / total) * 100 : 0;
  }

  getSuccessRate(): number {
    if (this.testRun?.results) {
      const total = this.testRun.results.success + this.testRun.results.errors;
      return total > 0 ? Math.round((this.testRun.results.success / total) * 100) : 0;
    }
    return 0;
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'passed': return 'check_circle';
      case 'failed': return 'error';
      case 'blocked': return 'block';
      case 'not-started': return 'schedule';
      default: return 'help';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'passed': return 'Zaliczony';
      case 'failed': return 'Niezaliczony';
      case 'blocked': return 'Zablokowany';
      case 'not-started': return 'Nierozpoczęty';
      default: return 'Nieznany';
    }
  }

  getSeverityColor(severity: string): string {
    return getStatusColorClass(severity);
  }

  getAttachmentIcon(type: string): string {
    switch (type) {
      case 'image': return 'image';
      case 'text': return 'description';
      case 'video': return 'videocam';
      case 'pdf': return 'picture_as_pdf';
      default: return 'insert_drive_file';
    }
  }

  continueExecution() {
    if (this.testRun) {
      this.router.navigate(['/test-runs/execute', this.testRun.id]);
    }
  }

  generateReport() {
    if (this.testRun) {
      this.router.navigate(['/reports/generate'], {
        queryParams: { testRunId: this.testRun.id }
      });
    }
  }

  viewTestDetails(test: TestResult) {
    this.router.navigate(['/test-cases/view', test.id]);
  }

  executeTest(test: TestResult) {
    if (this.testRun) {
      this.router.navigate(['/test-runs/execute', this.testRun.id], {
        queryParams: { testCaseId: test.id }
      });
    }
  }
}
