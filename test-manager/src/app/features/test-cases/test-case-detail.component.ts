import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { StatusChipComponent } from '../../shared/ui/status-chip/status-chip.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { ApiService } from '../../core/services/api.service';
import { TestCase } from '../../core/models/test-case.model';
import { getStatusColorClass } from '../../shared/utils/color-utils';

@Component({
  selector: 'app-test-case-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatChipsModule,
    StatusChipComponent,
    PageHeaderComponent
  ],
  template: `
    <div class="test-case-detail-container" *ngIf="testCase">
      <app-page-header [title]="testCase.id + ': ' + testCase.name">
        <button mat-stroked-button color="primary" (click)="navigateToEdit()">
          <mat-icon>edit</mat-icon>
          <span>Edytuj</span>
        </button>
        <button mat-flat-button color="primary" (click)="createTestRun()">
          <mat-icon>play_arrow</mat-icon>
          <span>Uruchom test</span>
        </button>
      </app-page-header>

      <div class="detail-overview">
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
              <div class="info-label">Priorytet:</div>
              <app-status-chip [text]="testCase.priority.level" [color]="getStatusColorClass(testCase.priority.color)"></app-status-chip>
            </div>

            <div class="info-row">
              <div class="info-label">Status:</div>
              <app-status-chip [text]="testCase.status.name" [color]="getStatusColorClass(testCase.status.color)"></app-status-chip>
            </div>

            <div class="info-row">
              <div class="info-label">Autor:</div>
              <div>{{ testCase.author }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">Data utworzenia:</div>
              <div>{{ testCase.creationDate }}</div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="description-card">
          <mat-card-content>
            <h3>Opis</h3>
            <p>{{ description }}</p>

            <mat-divider class="divider"></mat-divider>

            <h3>Warunki wstępne</h3>
            <ul>
              <li *ngFor="let precondition of preconditions">{{ precondition }}</li>
            </ul>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="steps-card">
        <mat-card-content>
          <h3>Kroki testowe</h3>

          <table class="steps-table">
            <thead>
              <tr>
                <th class="step-number">#</th>
                <th class="step-action">Akcja</th>
                <th class="step-expected">Oczekiwany rezultat</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let step of steps; let i = index">
                <td class="step-number">{{ i + 1 }}</td>
                <td class="step-action">{{ step.action }}</td>
                <td class="step-expected">{{ step.expected }}</td>
              </tr>
            </tbody>
          </table>
        </mat-card-content>
      </mat-card>

      <mat-card class="history-card">
        <mat-card-content>
          <h3>Historia wykonań</h3>

          <div class="execution-history">
            <div class="history-item" *ngFor="let item of executionHistory">
              <div class="history-status" [ngClass]="item.status">
                <mat-icon>{{ item.status === 'success' ? 'check_circle' : 'error' }}</mat-icon>
              </div>
              <div class="history-details">
                <div class="history-title">{{ item.run }}</div>
                <div class="history-date">{{ item.date }} przez {{ item.executor }}</div>
              </div>
              <div class="history-actions">
                <button mat-button color="primary" (click)="viewExecutionDetails(item)">
                  Zobacz
                </button>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .test-case-detail-container {
      .detail-overview {
        display: grid;
        grid-template-columns: 300px 1fr;
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
            width: 120px;
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
        }
      }

      .description-card {
        h3 {
          font-size: 16px;
          font-weight: 500;
          margin-top: 0;
          margin-bottom: 8px;
        }

        p {
          line-height: 1.5;
        }

        .divider {
          margin: 16px 0;
        }

        ul {
          margin-top: 8px;
          padding-left: 20px;

          li {
            margin-bottom: 4px;
          }
        }
      }

      .steps-card {
        margin-bottom: 16px;

        h3 {
          font-size: 16px;
          font-weight: 500;
          margin-top: 0;
          margin-bottom: 16px;
        }

        .steps-table {
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

          .step-number {
            width: 50px;
          }

          .step-action {
            width: 50%;
          }
        }
      }

      .history-card {
        h3 {
          font-size: 16px;
          font-weight: 500;
          margin-top: 0;
          margin-bottom: 16px;
        }

        .execution-history {
          .history-item {
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

            .history-status {
              margin-right: 16px;

              &.success {
                color: #4caf50;
              }

              &.failure {
                color: #f44336;
              }
            }

            .history-details {
              flex: 1;

              .history-title {
                font-weight: 500;
              }

              .history-date {
                font-size: 14px;
                color: var(--text-secondary);
              }
            }
          }
        }
      }
    }
  `]
})
export class TestCaseDetailComponent implements OnInit {

  testCase: TestCase | null = null;
  description = 'Ten przypadek testowy weryfikuje poprawność działania funkcji logowania użytkownika na portalu klienta. Sprawdza zarówno pozytywne jak i negatywne ścieżki dla różnych rodzajów kont.';
  preconditions = [
    'Portal klienta jest dostępny',
    'Użytkownik posiada konto w systemie',
    'Baza danych użytkowników jest dostępna'
  ];
  steps = [
    { action: 'Przejdź do strony logowania portalu', expected: 'Strona logowania wyświetla się poprawnie' },
    { action: 'Wprowadź poprawny login i hasło', expected: 'Pola przyjmują wprowadzane wartości' },
    { action: 'Kliknij przycisk "Zaloguj"', expected: 'Użytkownik zostaje zalogowany i przekierowany do strony głównej' },
    { action: 'Kliknij przycisk "Wyloguj"', expected: 'Użytkownik zostaje wylogowany i przekierowany do strony logowania' },
    { action: 'Wprowadź niepoprawne hasło i kliknij "Zaloguj"', expected: 'System wyświetla komunikat o błędnych danych logowania' }
  ];
  executionHistory = [
    { status: 'success', run: 'Testy interfejsu użytkownika', date: '10 mar 2025', executor: 'Jan Kowalski' },
    { status: 'failure', run: 'Testy interfejsu użytkownika', date: '5 mar 2025', executor: 'Anna Nowak' },
    { status: 'success', run: 'Testy regresyjne', date: '1 mar 2025', executor: 'Jan Kowalski' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  getStatusColorClass(color: string): string {
    return getStatusColorClass(color);
  }


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadTestCase(id);
      }
    });
  }

  loadTestCase(id: string) {
    this.apiService.getTestCaseById(id).subscribe(testCase => {
      this.testCase = testCase;
    });
  }

  navigateToEdit() {
    if (this.testCase) {
      this.router.navigate(['/test-cases/edit', this.testCase.id]);
    }
  }

  createTestRun() {
    if (this.testCase) {
      this.router.navigate(['/test-runs/create'], {
        queryParams: { testCaseId: this.testCase.id }
      });
    }
  }

  viewExecutionDetails(item: any) {
    // Navigate to execution details page (to be implemented)
    this.router.navigate(['/test-runs/details', 'execution-id']);
  }

}

