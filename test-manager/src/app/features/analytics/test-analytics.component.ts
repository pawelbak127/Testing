import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { ProjectService, Project } from '../../core/services/project.service';

@Component({
  selector: 'app-test-analytics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    PageHeaderComponent
  ],
  template: `
    <div class="test-analytics-container">
      <app-page-header title="Analityka testów">
        <button mat-stroked-button (click)="exportData()">
          <mat-icon>download</mat-icon>
          <span>Eksportuj dane</span>
        </button>
      </app-page-header>

      <div class="filters-container">
        <mat-card class="filters-card">
          <mat-card-content>
            <div class="filters-grid">
              <mat-form-field appearance="outline">
                <mat-label>Projekt</mat-label>
                <mat-select [(value)]="selectedProject" (selectionChange)="applyFilters()">
                  <mat-option value="all">Wszystkie projekty</mat-option>
                  <mat-option *ngFor="let project of projects" [value]="project.id">{{ project.name }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Zakres czasu</mat-label>
                <mat-select [(value)]="selectedTimeRange" (selectionChange)="applyFilters()">
                  <mat-option value="7">Ostatnie 7 dni</mat-option>
                  <mat-option value="30">Ostatnie 30 dni</mat-option>
                  <mat-option value="90">Ostatnie 90 dni</mat-option>
                  <mat-option value="custom">Zakres niestandardowy</mat-option>
                </mat-select>
              </mat-form-field>

              <div class="date-range-fields" *ngIf="selectedTimeRange === 'custom'">
                <mat-form-field appearance="outline">
                  <mat-label>Data początkowa</mat-label>
                  <input matInput [matDatepicker]="startPicker" [(ngModel)]="startDate">
                  <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                  <mat-datepicker #startPicker></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Data końcowa</mat-label>
                  <input matInput [matDatepicker]="endPicker" [(ngModel)]="endDate">
                  <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                  <mat-datepicker #endPicker></mat-datepicker>
                </mat-form-field>

                <button mat-flat-button color="primary" (click)="applyCustomDateRange()">
                  Zastosuj
                </button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="analytics-grid">
        <mat-card class="metrics-card">
          <mat-card-content>
            <h3>Podsumowanie metryki</h3>

            <div class="metrics-grid">
              <div class="metric-item">
                <div class="metric-value">{{ totalTests }}</div>
                <div class="metric-label">Wszystkie testy</div>
              </div>

              <div class="metric-item">
                <div class="metric-value">{{ executedTests }}</div>
                <div class="metric-label">Wykonane</div>
              </div>

              <div class="metric-item">
                <div class="metric-value">{{ passRate }}%</div>
                <div class="metric-label">Wskaźnik zaliczeń</div>
              </div>

              <div class="metric-item">
                <div class="metric-value">{{ avgExecutionTime }}</div>
                <div class="metric-label">Średni czas wykonania</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-content>
            <div class="chart-header">
              <h3>Wyniki testów w czasie</h3>
              <div class="chart-legend">
                <div class="legend-item">
                  <div class="legend-color success"></div>
                  <div class="legend-label">Zaliczone</div>
                </div>
                <div class="legend-item">
                  <div class="legend-color failure"></div>
                  <div class="legend-label">Niezaliczone</div>
                </div>
                <div class="legend-item">
                  <div class="legend-color blocked"></div>
                  <div class="legend-label">Zablokowane</div>
                </div>
              </div>
            </div>

            <div class="chart-placeholder">
              <div class="test-results-chart">
                <div class="chart-axis y-axis">
                  <div class="axis-label">100</div>
                  <div class="axis-label">75</div>
                  <div class="axis-label">50</div>
                  <div class="axis-label">25</div>
                  <div class="axis-label">0</div>
                </div>
                <div class="chart-body">
                  <div class="chart-columns">
                    <div class="chart-column" *ngFor="let day of resultsByDay">
                      <div class="column-segments">
                        <div class="segment success" [style.height.%]="day.passed"></div>
                        <div class="segment failure" [style.height.%]="day.failed"></div>
                        <div class="segment blocked" [style.height.%]="day.blocked"></div>
                      </div>
                      <div class="column-label">{{ day.date }}</div>
                    </div>
                  </div>
                  <div class="chart-gridlines">
                    <div class="gridline"></div>
                    <div class="gridline"></div>
                    <div class="gridline"></div>
                    <div class="gridline"></div>
                  </div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-content>
            <div class="chart-header">
              <h3>Rozkład statusów testów</h3>
            </div>

            <div class="chart-placeholder">
              <div class="distribution-chart">
                <div class="pie-chart">
                  <div class="pie-segment success" [style.--segment-size]="'60%'"></div>
                  <div class="pie-segment failure" [style.--segment-size]="'25%'"></div>
                  <div class="pie-segment blocked" [style.--segment-size]="'15%'"></div>
                </div>
                <div class="distribution-legend">
                  <div class="legend-item">
                    <div class="legend-color success"></div>
                    <div class="legend-label">Zaliczone</div>
                    <div class="legend-value">60% (120)</div>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color failure"></div>
                    <div class="legend-label">Niezaliczone</div>
                    <div class="legend-value">25% (50)</div>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color blocked"></div>
                    <div class="legend-label">Zablokowane</div>
                    <div class="legend-value">15% (30)</div>
                  </div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-content>
            <div class="chart-header">
              <h3>Najczęstsze przyczyny błędów</h3>
            </div>

            <div class="chart-placeholder">
              <div class="failures-chart">
                <div class="bar-chart">
                  <div class="chart-bar">
                    <div class="bar-label">Błędy logiki biznesowej</div>
                    <div class="bar-track">
                      <div class="bar-fill" style="width: 75%"></div>
                    </div>
                    <div class="bar-value">30</div>
                  </div>
                  <div class="chart-bar">
                    <div class="bar-label">Problemy z interfejsem</div>
                    <div class="bar-track">
                      <div class="bar-fill" style="width: 42.5%"></div>
                    </div>
                    <div class="bar-value">17</div>
                  </div>
                  <div class="chart-bar">
                    <div class="bar-label">Problemy z obsługą błędów</div>
                    <div class="bar-track">
                      <div class="bar-fill" style="width: 37.5%"></div>
                    </div>
                    <div class="bar-value">15</div>
                  </div>
                  <div class="chart-bar">
                    <div class="bar-label">Problemy z wydajnością</div>
                    <div class="bar-track">
                      <div class="bar-fill" style="width: 32.5%"></div>
                    </div>
                    <div class="bar-value">13</div>
                  </div>
                  <div class="chart-bar">
                    <div class="bar-label">Problemy z kompatybilnością</div>
                    <div class="bar-track">
                      <div class="bar-fill" style="width: 20%"></div>
                    </div>
                    <div class="bar-value">8</div>
                  </div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card span-full">
          <mat-card-content>
            <div class="chart-header">
              <h3>Metryki testów według komponentów</h3>
            </div>

            <div class="chart-placeholder">
              <table class="components-table">
                <thead>
                  <tr>
                    <th>Komponent</th>
                    <th>Łącznie testów</th>
                    <th>Wykonanych</th>
                    <th>Zaliczonych</th>
                    <th>Niezaliczonych</th>
                    <th>Wskaźnik zaliczeń</th>
                    <th>Średni czas wykonania</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let component of componentMetrics">
                    <td>{{ component.name }}</td>
                    <td>{{ component.total }}</td>
                    <td>{{ component.executed }}</td>
                    <td>{{ component.passed }}</td>
                    <td>{{ component.failed }}</td>
                    <td>
                      <div class="progress-bar">
                        <div class="progress-fill" [style.width.%]="component.passRate"></div>
                        <div class="progress-text">{{ component.passRate }}%</div>
                      </div>
                    </td>
                    <td>{{ component.avgTime }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .test-analytics-container {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .filters-container {
        .filters-card {
          .filters-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;

            .date-range-fields {
              display: grid;
              grid-template-columns: 1fr 1fr auto;
              gap: 8px;
              grid-column: 1 / -1;

              @media (max-width: 768px) {
                grid-template-columns: 1fr;
              }
            }
          }
        }
      }

      .analytics-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;

        @media (max-width: 992px) {
          grid-template-columns: 1fr;
        }

        .span-full {
          grid-column: 1 / -1;
        }
      }

      h3 {
        font-size: 16px;
        font-weight: 500;
        margin: 0 0 16px;
      }

      .metrics-card {
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;

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
      }

      .chart-card {
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;

          .chart-legend {
            display: flex;
            gap: 12px;

            .legend-item {
              display: flex;
              align-items: center;

              .legend-color {
                width: 12px;
                height: 12px;
                border-radius: 2px;
                margin-right: 4px;

                &.success {
                  background-color: #4caf50;
                }

                &.failure {
                  background-color: #f44336;
                }

                &.blocked {
                  background-color: #ff9800;
                }
              }

              .legend-label {
                font-size: 12px;
                color: var(--text-secondary);
              }
            }
          }
        }

        .chart-placeholder {
          min-height: 300px;

          .test-results-chart {
            display: flex;
            height: 300px;

            .y-axis {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding-right: 8px;

              .axis-label {
                font-size: 12px;
                color: var(--text-secondary);
                height: 20px;
                display: flex;
                align-items: center;
              }
            }

            .chart-body {
              flex: 1;
              position: relative;

              .chart-gridlines {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 20px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                pointer-events: none;

                .gridline {
                  height: 1px;
                  background-color: rgba(0, 0, 0, 0.1);

                  .dark-theme & {
                    background-color: rgba(255, 255, 255, 0.1);
                  }
                }
              }

              .chart-columns {
                display: flex;
                justify-content: space-between;
                height: 100%;
                position: relative;
                z-index: 1;

                .chart-column {
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  padding: 0 4px;

                  .column-segments {
                    flex: 1;
                    display: flex;
                    flex-direction: column-reverse;
                    justify-content: flex-start;

                    .segment {
                      width: 100%;

                      &.success {
                        background-color: #4caf50;
                      }

                      &.failure {
                        background-color: #f44336;
                      }

                      &.blocked {
                        background-color: #ff9800;
                      }
                    }
                  }

                  .column-label {
                    text-align: center;
                    font-size: 12px;
                    color: var(--text-secondary);
                    padding-top: 4px;
                    height: 20px;
                  }
                }
              }
            }
          }

          .distribution-chart {
            display: flex;
            align-items: center;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 24px;
            height: 100%;
            padding: 16px 0;

            .pie-chart {
              width: 200px;
              height: 200px;
              position: relative;
              border-radius: 50%;
              background-color: rgba(0, 0, 0, 0.05);

              .dark-theme & {
                background-color: rgba(255, 255, 255, 0.05);
              }

              .pie-segment {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                clip-path: polygon(50% 50%, 50% 0, calc(50% + var(--segment-size)) 0, 50% 50%);
                transform: rotate(0deg);

                &.success {
                  background-color: #4caf50;
                  clip-path: polygon(50% 50%, 50% 0, 100% 0, 100% 50%, 50% 50%);
                  transform: rotate(0deg);
                }

                &.failure {
                  background-color: #f44336;
                  clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 75% 100%, 50% 50%);
                  transform: rotate(0deg);
                }

                &.blocked {
                  background-color: #ff9800;
                  clip-path: polygon(50% 50%, 75% 100%, 0 100%, 0 50%, 50% 50%);
                  transform: rotate(0deg);
                }
              }
            }

            .distribution-legend {
              display: flex;
              flex-direction: column;
              gap: 12px;

              .legend-item {
                display: flex;
                align-items: center;

                .legend-color {
                  width: 16px;
                  height: 16px;
                  border-radius: 2px;
                  margin-right: 8px;

                  &.success {
                    background-color: #4caf50;
                  }

                  &.failure {
                    background-color: #f44336;
                  }

                  &.blocked {
                    background-color: #ff9800;
                  }
                }

                .legend-label {
                  min-width: 100px;
                }

                .legend-value {
                  font-weight: 500;
                }
              }
            }
          }

          .failures-chart {
            padding: 16px 0;

            .bar-chart {
              display: flex;
              flex-direction: column;
              gap: 16px;

              .chart-bar {
                display: flex;
                align-items: center;

                .bar-label {
                  width: 180px;
                  font-size: 14px;
                  padding-right: 16px;
                }

                .bar-track {
                  flex: 1;
                  height: 16px;
                  background-color: rgba(0, 0, 0, 0.05);
                  border-radius: 8px;
                  overflow: hidden;

                  .dark-theme & {
                    background-color: rgba(255, 255, 255, 0.05);
                  }

                  .bar-fill {
                    height: 100%;
                    background-color: #f44336;
                    border-radius: 8px;
                  }
                }

                .bar-value {
                  width: 40px;
                  text-align: right;
                  font-weight: 500;
                  padding-left: 16px;
                }
              }
            }
          }

          .components-table {
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

            .progress-bar {
              display: flex;
              align-items: center;
              height: 8px;
              background-color: rgba(0, 0, 0, 0.05);
              border-radius: 4px;
              overflow: hidden;
              position: relative;

              .dark-theme & {
                background-color: rgba(255, 255, 255, 0.05);
              }

              .progress-fill {
                height: 100%;
                background-color: #4caf50;
                border-radius: 4px;
              }

              .progress-text {
                position: absolute;
                right: 0;
                font-size: 12px;
                font-weight: 500;
              }
            }
          }
        }
      }
    }
  `]
})
export class TestAnalyticsComponent implements OnInit {
  projects: Project[] = [];
  selectedProject = 'all';
  selectedTimeRange = '30';
  startDate = new Date(new Date().setDate(new Date().getDate() - 30));
  endDate = new Date();

  totalTests = 200;
  executedTests = 185;
  passRate = 75;
  avgExecutionTime = '12m 45s';

  resultsByDay = [
    { date: '6 mar', passed: 60, failed: 30, blocked: 10 },
    { date: '7 mar', passed: 65, failed: 25, blocked: 10 },
    { date: '8 mar', passed: 70, failed: 20, blocked: 10 },
    { date: '9 mar', passed: 65, failed: 25, blocked: 10 },
    { date: '10 mar', passed: 60, failed: 30, blocked: 10 },
    { date: '11 mar', passed: 75, failed: 15, blocked: 10 },
    { date: '12 mar', passed: 70, failed: 20, blocked: 10 }
  ];

  componentMetrics = [
    { name: 'Logowanie i uwierzytelnianie', total: 45, executed: 42, passed: 35, failed: 7, passRate: 83, avgTime: '9m 12s' },
    { name: 'Wyszukiwanie', total: 38, executed: 36, passed: 30, failed: 6, passRate: 83, avgTime: '7m 45s' },
    { name: 'Koszyk i płatności', total: 52, executed: 48, passed: 32, failed: 16, passRate: 67, avgTime: '15m 30s' },
    { name: 'Zarządzanie kontami', total: 35, executed: 32, passed: 28, failed: 4, passRate: 88, avgTime: '10m 20s' },
    { name: 'Raporty i analityka', total: 30, executed: 27, passed: 21, failed: 6, passRate: 78, avgTime: '11m 15s' }
  ];

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.projectService.projects$.subscribe(projects => {
      this.projects = projects;
    });
  }

  applyFilters() {
    if (this.selectedTimeRange !== 'custom') {
      const days = parseInt(this.selectedTimeRange);
      this.startDate = new Date(new Date().setDate(new Date().getDate() - days));
      this.endDate = new Date();
    }

    // In a real application, you would fetch data based on the selected filters
    // This is just a placeholder
    console.log('Applying filters:', {
      project: this.selectedProject,
      timeRange: this.selectedTimeRange,
      startDate: this.startDate,
      endDate: this.endDate
    });
  }

  applyCustomDateRange() {
    // In a real application, you would fetch data based on the custom date range
    console.log('Applying custom date range:', {
      project: this.selectedProject,
      startDate: this.startDate,
      endDate: this.endDate
    });
  }

  exportData() {
    // In a real application, you would implement the export functionality
    console.log('Exporting analytics data');
  }
}
