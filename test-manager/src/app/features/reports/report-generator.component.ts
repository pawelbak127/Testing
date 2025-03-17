import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { ProjectService, Project } from '../../core/services/project.service';
import { ApiService } from '../../core/services/api.service';
import { TestRun } from '../../core/models/test-run.model';

@Component({
  selector: 'app-report-generator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTabsModule,
    MatExpansionModule,
    PageHeaderComponent
  ],
  template: `
    <div class="report-generator-container">
      <app-page-header title="Generator raportów">
        <button mat-stroked-button (click)="cancel()">
          <mat-icon>close</mat-icon>
          <span>Anuluj</span>
        </button>
      </app-page-header>

      <div class="report-content">
        <div class="report-form">
          <mat-card class="form-card">
            <mat-card-content>
              <form [formGroup]="reportForm">
                <h3>Podstawowe informacje</h3>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Tytuł raportu</mat-label>
                  <input matInput formControlName="title" placeholder="Np. Raport testów aplikacji mobilnej - Q1 2025">
                  <mat-error *ngIf="reportForm.get('title')?.hasError('required')">
                    Tytuł jest wymagany
                  </mat-error>
                </mat-form-field>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Projekt</mat-label>
                    <mat-select formControlName="project">
                      <mat-option value="all">Wszystkie projekty</mat-option>
                      <mat-option *ngFor="let project of projects" [value]="project.id">{{ project.name }}</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Typ raportu</mat-label>
                    <mat-select formControlName="type">
                      <mat-option value="test-run">Wykonanie testów</mat-option>
                      <mat-option value="test-summary">Podsumowanie testów</mat-option>
                      <mat-option value="defect-summary">Podsumowanie defektów</mat-option>
                      <mat-option value="metrics">Metryki testów</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <div *ngIf="reportForm.get('type')?.value === 'test-run'" class="test-run-selection">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Wybierz wykonanie testów</mat-label>
                    <mat-select formControlName="testRun">
                      <mat-option *ngFor="let run of testRuns" [value]="run.id">{{ run.name }}</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <div *ngIf="reportForm.get('type')?.value !== 'test-run'" class="date-range">
                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Data początkowa</mat-label>
                      <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                      <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                      <mat-datepicker #startPicker></mat-datepicker>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Data końcowa</mat-label>
                      <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                      <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                      <mat-datepicker #endPicker></mat-datepicker>
                    </mat-form-field>
                  </div>
                </div>

                <h3>Opcje zawartości raportu</h3>

                <div class="report-options">
                  <div class="form-row checkboxes">
                    <mat-checkbox formControlName="includeSummary">Podsumowanie ogólne</mat-checkbox>
                    <mat-checkbox formControlName="includeCharts">Wykresy i diagramy</mat-checkbox>
                  </div>

                  <div class="form-row checkboxes">
                    <mat-checkbox formControlName="includeDetails">Szczegóły testów</mat-checkbox>
                    <mat-checkbox formControlName="includeDefects">Informacje o defektach</mat-checkbox>
                  </div>
                </div>

                <h3>Format i dystrybucja</h3>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Format raportu</mat-label>
                    <mat-select formControlName="format">
                      <mat-option value="pdf">PDF</mat-option>
                      <mat-option value="xlsx">Excel</mat-option>
                      <mat-option value="html">HTML</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Dystrybucja</mat-label>
                    <mat-select formControlName="distribution">
                      <mat-option value="download">Tylko pobierz</mat-option>
                      <mat-option value="email">Wyślij emailem</mat-option>
                      <mat-option value="both">Pobierz i wyślij emailem</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <div *ngIf="reportForm.get('distribution')?.value !== 'download'" class="email-recipients">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Odbiorcy (adresy email oddzielone przecinkami)</mat-label>
                    <input matInput formControlName="recipients" placeholder="jan.kowalski@example.com, anna.nowak@example.com">
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Dodatkowe komentarze</mat-label>
                  <textarea matInput formControlName="comments" rows="3"></textarea>
                </mat-form-field>
              </form>

              <div class="form-actions">
                <button mat-button (click)="cancel()">Anuluj</button>
                <button mat-flat-button color="primary" [disabled]="reportForm.invalid" (click)="generateReport()">
                  <mat-icon>description</mat-icon>
                  <span>Generuj raport</span>
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="report-preview" *ngIf="previewLoaded">
          <mat-card class="preview-card">
            <mat-card-content>
              <div class="preview-header">
                <h3>Podgląd raportu</h3>
              </div>

              <mat-tab-group>
                <mat-tab label="Podsumowanie">
                  <div class="preview-content">
                    <div class="report-title">{{ reportForm.get('title')?.value }}</div>
                    <div class="report-meta">
                      <div class="meta-item">
                        <div class="meta-label">Projekt:</div>
                        <div class="meta-value">{{ getProjectName(reportForm.get('project')?.value) }}</div>
                      </div>
                      <div class="meta-item">
                        <div class="meta-label">Data raportu:</div>
                        <div class="meta-value">{{ getCurrentDate() }}</div>
                      </div>
                      <div class="meta-item">
                        <div class="meta-label">Autor:</div>
                        <div class="meta-value">Jan Kowalski</div>
                      </div>
                    </div>

                    <div class="report-summary" *ngIf="reportForm.get('includeSummary')?.value">
                      <h4>Podsumowanie</h4>

                      <div class="summary-metrics">
                        <div class="metric-item">
                          <div class="metric-value">45</div>
                          <div class="metric-label">Wszystkie testy</div>
                        </div>
                        <div class="metric-item">
                          <div class="metric-value">38</div>
                          <div class="metric-label">Wykonane</div>
                        </div>
                        <div class="metric-item">
                          <div class="metric-value">32</div>
                          <div class="metric-label">Zaliczone</div>
                        </div>
                        <div class="metric-item">
                          <div class="metric-value">6</div>
                          <div class="metric-label">Niezaliczone</div>
                        </div>
                      </div>

                      <div class="pass-rate">
                        <div class="pass-rate-label">Wskaźnik zaliczeń:</div>
                        <div class="pass-rate-bar">
                          <mat-progress-bar mode="determinate" [value]="84"></mat-progress-bar>
                          <div class="pass-rate-value">84%</div>
                        </div>
                      </div>
                    </div>

                    <div class="report-charts" *ngIf="reportForm.get('includeCharts')?.value">
                      <h4>Wykresy</h4>

                      <div class="charts-container">
                        <div class="chart-item">
                          <div class="chart-placeholder">
                            [Wykres statusów testów]
                          </div>
                          <div class="chart-caption">Rozkład statusów testów</div>
                        </div>
                        <div class="chart-item">
                          <div class="chart-placeholder">
                            [Wykres trendów testów]
                          </div>
                          <div class="chart-caption">Trendy testów w czasie</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </mat-tab>

                <mat-tab label="Szczegóły" *ngIf="reportForm.get('includeDetails')?.value">
                  <div class="preview-content">
                    <h4>Szczegóły testów</h4>

                    <div class="test-details-list">
                      <mat-accordion>
                        <mat-expansion-panel>
                          <mat-expansion-panel-header>
                            <mat-panel-title>
                              TC-001: Logowanie użytkownika z poprawnymi danymi
                            </mat-panel-title>
                            <mat-panel-description>
                              <span class="status-badge success">Zaliczony</span>
                            </mat-panel-description>
                          </mat-expansion-panel-header>

                          <div class="test-details">
                            <div class="detail-row">
                              <div class="detail-label">Wykonawca:</div>
                              <div class="detail-value">Jan Kowalski</div>
                            </div>
                            <div class="detail-row">
                              <div class="detail-label">Data wykonania:</div>
                              <div class="detail-value">12 mar 2025, 10:30</div>
                            </div>
                            <div class="detail-row">
                              <div class="detail-label">Czas wykonania:</div>
                              <div class="detail-value">5m 12s</div>
                            </div>
                          </div>
                        </mat-expansion-panel>

                        <mat-expansion-panel>
                          <mat-expansion-panel-header>
                            <mat-panel-title>
                              TC-002: Rejestracja nowego użytkownika
                            </mat-panel-title>
                            <mat-panel-description>
                              <span class="status-badge success">Zaliczony</span>
                            </mat-panel-description>
                          </mat-expansion-panel-header>

                          <div class="test-details">
                            <div class="detail-row">
                              <div class="detail-label">Wykonawca:</div>
                              <div class="detail-value">Jan Kowalski</div>
                            </div>
                            <div class="detail-row">
                              <div class="detail-label">Data wykonania:</div>
                              <div class="detail-value">12 mar 2025, 11:15</div>
                            </div>
                            <div class="detail-row">
                              <div class="detail-label">Czas wykonania:</div>
                              <div class="detail-value">8m 45s</div>
                            </div>
                          </div>
                        </mat-expansion-panel>

                        <mat-expansion-panel>
                          <mat-expansion-panel-header>
                            <mat-panel-title>
                              TC-004: Realizacja płatności kartą kredytową
                            </mat-panel-title>
                            <mat-panel-description>
                              <span class="status-badge failure">Niezaliczony</span>
                            </mat-panel-description>
                          </mat-expansion-panel-header>

                          <div class="test-details">
                            <div class="detail-row">
                              <div class="detail-label">Wykonawca:</div>
                              <div class="detail-value">Jan Kowalski</div>
                            </div>
                            <div class="detail-row">
                              <div class="detail-label">Data wykonania:</div>
                              <div class="detail-value">12 mar 2025, 12:05</div>
                            </div>
                            <div class="detail-row">
                              <div class="detail-label">Czas wykonania:</div>
                              <div class="detail-value">12m 08s</div>
                            </div>
                            <div class="detail-row">
                              <div class="detail-label">Komentarz:</div>
                              <div class="detail-value comment">Błąd podczas przetwarzania płatności - system zwraca kod błędu 500 podczas próby autoryzacji karty Visa.</div>
                            </div>
                          </div>
                        </mat-expansion-panel>
                      </mat-accordion>
                    </div>
                  </div>
                </mat-tab>

                <mat-tab label="Defekty" *ngIf="reportForm.get('includeDefects')?.value">
                  <div class="preview-content">
                    <h4>Znalezione defekty</h4>

                    <div class="defects-list">
                      <mat-accordion>
                        <mat-expansion-panel>
                          <mat-expansion-panel-header>
                            <mat-panel-title>
                              DEF-123: Błąd podczas przetwarzania płatności kartą
                            </mat-panel-title>
                            <mat-panel-description>
                              <span class="severity-badge critical">Krytyczny</span>
                            </mat-panel-description>
                          </mat-expansion-panel-header>

                          <div class="defect-details">
                            <div class="detail-row">
                              <div class="detail-label">Test przypadek:</div>
                              <div class="detail-value">TC-004: Realizacja płatności kartą kredytową</div>
                            </div>
                            <div class="detail-row">
                              <div class="detail-label">Zgłaszający:</div>
                              <div class="detail-value">Jan Kowalski</div>
                            </div>
                            <div class="detail-row">
                              <div class="detail-label">Data zgłoszenia:</div>
                              <div class="detail-value">12 mar 2025, 12:15</div>
                            </div>
                            <div class="detail-row">
                              <div class="detail-label">Status:</div>
                              <div class="detail-value">
                                <span class="status-badge open">Otwarty</span>
                              </div>
                            </div>
                            <div class="detail-row">
                              <div class="detail-label">Opis:</div>
                              <div class="detail-value description">
                                Podczas próby realizacji płatności kartą system zwraca błąd 500. Problem występuje tylko dla kart Visa.
                                Testy z kartami Mastercard przechodzą pomyślnie. Problem występuje zarówno w środowisku testowym jak i przedprodukcyjnym.
                              </div>
                            </div>
                          </div>
                        </mat-expansion-panel>

                        <mat-expansion-panel>
                          <mat-expansion-panel-header>
                            <mat-panel-title>
                              DEF-124: Niepoprawna walidacja formularza rejestracji
                            </mat-panel-title>
                            <mat-panel-description>
                              <span class="severity-badge medium">Średni</span>
                            </mat-panel-description>
                          </mat-expansion-panel-header>

                          <div class="defect-details">
                            <div class="detail-row">
                              <div class="detail-label">Test przypadek:</div>
                              <div class="detail-value">TC-002: Rejestracja nowego użytkownika</div>
                            </div>
                            <div class="detail-row">
                              <div class="detail-label">Zgłaszający:</div>
                              <div class="detail-value">Anna Nowak</div>
                            </div>
                            <div class="detail-row">
                              <div class="detail-label">Data zgłoszenia:</div>
                              <div class="detail-value">11 mar 2025, 14:30</div>
                            </div>
                            <div class="detail-row">
                              <div class="detail-label">Status:</div>
                              <div class="detail-value">
                                <span class="status-badge inprogress">W trakcie</span>
                              </div>
                            </div>
                            <div class="detail-row">
                              <div class="detail-label">Opis:</div>
                              <div class="detail-value description">
                                Formularz rejestracji akceptuje niepoprawne numery telefonów. Nie ma walidacji formatu numeru telefonu.
                              </div>
                            </div>
                          </div>
                        </mat-expansion-panel>
                      </mat-accordion>
                    </div>
                  </div>
                </mat-tab>
              </mat-tab-group>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .report-generator-container {
      .report-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-top: 16px;

        @media (max-width: 1200px) {
          grid-template-columns: 1fr;
        }
      }

      .full-width {
        width: 100%;
      }

      .form-row {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;

        mat-form-field {
          flex: 1;
        }

        @media (max-width: 600px) {
          flex-direction: column;
          gap: 0;
        }

        &.checkboxes {
          display: flex;
          flex-wrap: wrap;

          mat-checkbox {
            margin-right: 24px;
            margin-bottom: 8px;
          }
        }
      }

      h3 {
        font-size: 16px;
        font-weight: 500;
        margin: 24px 0 16px;

        &:first-child {
          margin-top: 0;
        }
      }

      .report-options {
        margin-bottom: 16px;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 24px;
      }

      .preview-card {
        .preview-header {
          margin-bottom: 16px;

          h3 {
            font-size: 18px;
            font-weight: 500;
            margin: 0;
          }
        }

        .preview-content {
          padding: 16px;

          .report-title {
            font-size: 20px;
            font-weight: 500;
            margin-bottom: 16px;
          }

          .report-meta {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 24px;

            @media (max-width: 768px) {
              grid-template-columns: 1fr;
            }

            .meta-item {
              .meta-label {
                font-weight: 500;
                margin-bottom: 4px;
              }
            }
          }

          h4 {
            font-size: 16px;
            font-weight: 500;
            margin: 24px 0 16px;
            color: var(--text-secondary);

            &:first-child {
              margin-top: 0;
            }
          }

          .summary-metrics {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 16px;

            @media (max-width: 768px) {
              grid-template-columns: repeat(2, 1fr);
            }

            .metric-item {
              padding: 16px;
              background-color: rgba(0, 0, 0, 0.03);
              border-radius: 8px;
              text-align: center;

              .dark-theme & {
                background-color: rgba(255, 255, 255, 0.05);
              }

              .metric-value {
                font-size: 24px;
                font-weight: 500;
                margin-bottom: 4px;
              }

              .metric-label {
                font-size: 14px;
                color: var(--text-secondary);
              }
            }
          }

          .pass-rate {
            display: flex;
            align-items: center;
            margin-bottom: 24px;

            .pass-rate-label {
              font-weight: 500;
              margin-right: 16px;
              min-width: 140px;
            }

            .pass-rate-bar {
              flex: 1;
              display: flex;
              align-items: center;

              mat-progress-bar {
                flex: 1;
                margin-right: 16px;
              }

              .pass-rate-value {
                font-weight: 500;
                min-width: 40px;
              }
            }
          }

          .charts-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;

            @media (max-width: 768px) {
              grid-template-columns: 1fr;
            }

            .chart-item {
              .chart-placeholder {
                height: 200px;
                background-color: rgba(0, 0, 0, 0.03);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-secondary);
                margin-bottom: 8px;

                .dark-theme & {
                  background-color: rgba(255, 255, 255, 0.05);
                }
              }

              .chart-caption {
                text-align: center;
                font-size: 14px;
                color: var(--text-secondary);
              }
            }
          }

          .test-details-list, .defects-list {
            mat-expansion-panel {
              margin-bottom: 8px;

              .status-badge, .severity-badge {
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;

                &.success {
                  background-color: rgba(76, 175, 80, 0.1);
                  color: #4caf50;
                }

                &.failure {
                  background-color: rgba(244, 67, 54, 0.1);
                  color: #f44336;
                }

                &.critical {
                  background-color: rgba(244, 67, 54, 0.1);
                  color: #f44336;
                }

                &.high {
                  background-color: rgba(255, 152, 0, 0.1);
                  color: #ff9800;
                }

                &.medium {
                  background-color: rgba(33, 150, 243, 0.1);
                  color: #2196f3;
                }

                &.low {
                  background-color: rgba(76, 175, 80, 0.1);
                  color: #4caf50;
                }

                &.open {
                  background-color: rgba(33, 150, 243, 0.1);
                  color: #2196f3;
                }

                &.inprogress {
                  background-color: rgba(255, 152, 0, 0.1);
                  color: #ff9800;
                }

                &.resolved {
                  background-color: rgba(76, 175, 80, 0.1);
                  color: #4caf50;
                }
              }
            }

            .test-details, .defect-details {
              .detail-row {
                display: flex;
                margin-bottom: 8px;

                .detail-label {
                  width: 130px;
                  font-weight: 500;
                }

                .detail-value {
                  flex: 1;

                  &.comment, &.description {
                    white-space: pre-line;
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
export class ReportGeneratorComponent implements OnInit {
  reportForm: FormGroup;
  projects: Project[] = [];
  testRuns: TestRun[] = [];
  previewLoaded = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {
    this.reportForm = this.createReportForm();
  }

  ngOnInit() {
    this.projectService.projects$.subscribe(projects => {
      this.projects = projects;
    });

    // Mock test runs data
    this.testRuns = [
      {
        id: 'TR-007',
        name: 'Testy modułu płatności',
        project: 'Portal klienta',
        progress: { current: 5, total: 5, percentage: 100 },
        results: { success: 3, errors: 2 }
      },
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
      }
    ];

    // Check if there is a test run ID in query params
    this.route.queryParams.subscribe(params => {
      if (params['testRunId']) {
        this.reportForm.patchValue({
          type: 'test-run',
          testRun: params['testRunId']
        });

        // Find the test run to set the project
        const testRun = this.testRuns.find(run => run.id === params['testRunId']);
        if (testRun) {
          const projectName = testRun.project;
          const project = this.projects.find(p => p.name === projectName);
          if (project) {
            this.reportForm.patchValue({ project: project.id });
          }

          // Generate a default title
          this.reportForm.patchValue({
            title: `Raport z wykonania: ${testRun.name}`
          });
        }
      }
    });

    // Show preview after form changes
    this.reportForm.valueChanges.subscribe(() => {
      if (this.reportForm.valid) {
        this.previewLoaded = true;
      }
    });

    // Initial preview
    setTimeout(() => {
      this.previewLoaded = true;
    }, 500);
  }

  createReportForm(): FormGroup {
    return this.fb.group({
      title: ['Raport testów - Portal klienta', Validators.required],
      project: ['all'],
      type: ['test-summary'],
      testRun: [''],
      startDate: [new Date(new Date().setDate(new Date().getDate() - 30))],
      endDate: [new Date()],
      includeSummary: [true],
      includeCharts: [true],
      includeDetails: [true],
      includeDefects: [true],
      format: ['pdf'],
      distribution: ['download'],
      recipients: [''],
      comments: ['']
    });
  }

  getProjectName(projectId: string): string {
    if (projectId === 'all') {
      return 'Wszystkie projekty';
    }
    const project = this.projects.find(p => p.id === projectId);
    return project ? project.name : '';
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('pl-PL');
  }

  generateReport() {
    if (this.reportForm.invalid) {
      this.snackBar.open('Proszę poprawić błędy w formularzu', 'OK', { duration: 3000 });
      return;
    }

    // In a real application, you would send the form data to an API
    const formData = {
      ...this.reportForm.value
    };

    console.log('Generating report:', formData);

    // Show loading
    this.previewLoaded = false;

    // Simulate API call
    setTimeout(() => {
      this.snackBar.open('Raport został wygenerowany', 'OK', { duration: 3000 });
      this.router.navigate(['/reports']);
    }, 1500);
  }

  cancel() {
    this.router.navigate(['/reports']);
  }
}
