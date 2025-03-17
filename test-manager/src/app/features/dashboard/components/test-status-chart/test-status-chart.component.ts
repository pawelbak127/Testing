import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ProjectService, Project } from '../../../../core/services/project.service';

interface ChartData {
  label: string;
  passed: number;
  failed: number;
  blocked: number;
  notExecuted: number;
}

@Component({
  selector: 'app-test-status-chart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-card class="chart-card">
      <mat-card-content>
        <div class="chart-header">
          <h2 class="chart-title">Status wykonania testów</h2>

          <div class="chart-controls">
            <mat-form-field appearance="outline" class="time-range-selector">
              <mat-select [(value)]="selectedTimeRange" (selectionChange)="updateChart()">
                <mat-option *ngFor="let option of timeRangeOptions" [value]="option.value">
                  {{ option.label }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="project-selector">
              <mat-select [(value)]="selectedProject" (selectionChange)="updateChart()">
                <mat-option value="all">Wszystkie projekty</mat-option>
                <mat-option *ngFor="let project of projects" [value]="project.id">
                  <div class="project-option">
                    <div class="color-dot" [ngClass]="project.color"></div>
                    <span>{{ project.name }}</span>
                  </div>
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color passed"></div>
              <div class="legend-label">Zaliczone</div>
            </div>
            <div class="legend-item">
              <div class="legend-color failed"></div>
              <div class="legend-label">Niezaliczone</div>
            </div>
            <div class="legend-item">
              <div class="legend-color blocked"></div>
              <div class="legend-label">Zablokowane</div>
            </div>
            <div class="legend-item">
              <div class="legend-color not-executed"></div>
              <div class="legend-label">Niewykonane</div>
            </div>
          </div>

          <div class="test-status-chart">
            <div class="chart-axis y-axis">
              <div class="axis-label">100%</div>
              <div class="axis-label">80%</div>
              <div class="axis-label">60%</div>
              <div class="axis-label">40%</div>
              <div class="axis-label">20%</div>
              <div class="axis-label">0%</div>
            </div>
            <div class="chart-body">
              <div class="chart-columns">
                <div class="chart-column" *ngFor="let item of chartData">
                  <div class="column-segments">
                    <div class="segment passed" [style.height.%]="getSegmentHeight(item.passed)"></div>
                    <div class="segment failed" [style.height.%]="getSegmentHeight(item.failed)"></div>
                    <div class="segment blocked" [style.height.%]="getSegmentHeight(item.blocked)"></div>
                    <div class="segment not-executed" [style.height.%]="getSegmentHeight(item.notExecuted)"></div>
                  </div>
                  <div class="column-label">{{ item.label }}</div>
                </div>
              </div>
              <div class="chart-gridlines">
                <div class="gridline"></div>
                <div class="gridline"></div>
                <div class="gridline"></div>
                <div class="gridline"></div>
                <div class="gridline"></div>
              </div>
            </div>
          </div>

          <div class="chart-summary">
            <div class="summary-metric passed">
              <div class="metric-value">{{ getTotalPassed() }}</div>
              <div class="metric-label">Zaliczone</div>
            </div>
            <div class="summary-metric failed">
              <div class="metric-value">{{ getTotalFailed() }}</div>
              <div class="metric-label">Niezaliczone</div>
            </div>
            <div class="summary-metric blocked">
              <div class="metric-value">{{ getTotalBlocked() }}</div>
              <div class="metric-label">Zablokowane</div>
            </div>
            <div class="summary-metric not-executed">
              <div class="metric-value">{{ getTotalNotExecuted() }}</div>
              <div class="metric-label">Niewykonane</div>
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .chart-card {
      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        flex-wrap: wrap;

        @media (max-width: 768px) {
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }

        .chart-title {
          font-size: 16px;
          font-weight: 500;
          margin: 0;
        }

        .chart-controls {
          display: flex;
          gap: 16px;

          .time-range-selector, .project-selector {
            width: 180px;

            ::ng-deep .mat-mdc-form-field-subscript-wrapper {
              display: none;
            }
          }

          .project-option {
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

      .chart-container {
        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-bottom: 16px;
          flex-wrap: wrap;

          .legend-item {
            display: flex;
            align-items: center;

            .legend-color {
              width: 16px;
              height: 16px;
              border-radius: 2px;
              margin-right: 8px;

              &.passed {
                background-color: #4caf50;
              }

              &.failed {
                background-color: #f44336;
              }

              &.blocked {
                background-color: #ff9800;
              }

              &.not-executed {
                background-color: #9e9e9e;
              }
            }

            .legend-label {
              font-size: 14px;
              color: var(--text-secondary);
            }
          }
        }

        .test-status-chart {
          display: flex;
          height: 300px;
          margin-bottom: 24px;

          .y-axis {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding-right: 8px;
            width: 50px;

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
              justify-content: space-around;
              height: 100%;
              position: relative;
              z-index: 1;

              .chart-column {
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: 0 8px;

                .column-segments {
                  flex: 1;
                  display: flex;
                  flex-direction: column-reverse;
                  justify-content: flex-start;

                  .segment {
                    width: 100%;

                    &.passed {
                      background-color: #4caf50;
                    }

                    &.failed {
                      background-color: #f44336;
                    }

                    &.blocked {
                      background-color: #ff9800;
                    }

                    &.not-executed {
                      background-color: #9e9e9e;
                    }
                  }
                }

                .column-label {
                  text-align: center;
                  font-size: 12px;
                  color: var(--text-secondary);
                  padding-top: 4px;
                  height: 20px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }
          }
        }

        .chart-summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;

          .summary-metric {
            text-align: center;

            .metric-value {
              font-size: 24px;
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

              &.not-executed, .not-executed & {
                color: #9e9e9e;
              }
            }

            .metric-label {
              font-size: 14px;
              color: var(--text-secondary);
            }
          }
        }
      }
    }
  `]
})
export class TestStatusChartComponent implements OnInit {
  @Input() height: string = '400px';

  timeRangeOptions = [
    { value: '7', label: 'Ostatnie 7 dni' },
    { value: '30', label: 'Ostatnie 30 dni' },
    { value: '90', label: 'Ostatnie 90 dni' }
  ];

  selectedTimeRange = '30';
  selectedProject = 'all';

  projects: Project[] = [];
  chartData: ChartData[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.projectService.projects$.subscribe(projects => {
      this.projects = projects;
    });

    this.loadChartData();
  }

  loadChartData() {
    // In a real application, this would be fetched from an API
    // This is just mock data
    if (this.selectedTimeRange === '7') {
      this.chartData = [
        { label: '6 mar', passed: 60, failed: 10, blocked: 5, notExecuted: 25 },
        { label: '7 mar', passed: 65, failed: 8, blocked: 7, notExecuted: 20 },
        { label: '8 mar', passed: 70, failed: 12, blocked: 3, notExecuted: 15 },
        { label: '9 mar', passed: 68, failed: 15, blocked: 7, notExecuted: 10 },
        { label: '10 mar', passed: 72, failed: 13, blocked: 5, notExecuted: 10 },
        { label: '11 mar', passed: 75, failed: 10, blocked: 5, notExecuted: 10 },
        { label: '12 mar', passed: 80, failed: 8, blocked: 7, notExecuted: 5 }
      ];
    } else if (this.selectedTimeRange === '30') {
      this.chartData = [
        { label: 'Tydzień 1', passed: 55, failed: 15, blocked: 10, notExecuted: 20 },
        { label: 'Tydzień 2', passed: 60, failed: 15, blocked: 5, notExecuted: 20 },
        { label: 'Tydzień 3', passed: 70, failed: 10, blocked: 5, notExecuted: 15 },
        { label: 'Tydzień 4', passed: 80, failed: 8, blocked: 7, notExecuted: 5 }
      ];
    } else {
      this.chartData = [
        { label: 'Styczeń', passed: 50, failed: 20, blocked: 10, notExecuted: 20 },
        { label: 'Luty', passed: 60, failed: 15, blocked: 5, notExecuted: 20 },
        { label: 'Marzec', passed: 75, failed: 10, blocked: 5, notExecuted: 10 }
      ];
    }

    // Filter by project if needed
    if (this.selectedProject !== 'all') {
      // In a real application, you would filter the data by project
      // Here we just adjust the numbers for demonstration
      const projectIndex = this.projects.findIndex(p => p.id === this.selectedProject);
      const adjustmentFactor = (projectIndex + 1) * 0.1;

      this.chartData = this.chartData.map(item => ({
        ...item,
        passed: Math.min(Math.floor(item.passed * (1 + adjustmentFactor)), 100),
        failed: Math.max(Math.floor(item.failed * (1 - adjustmentFactor)), 0),
        blocked: Math.max(Math.floor(item.blocked * (1 - adjustmentFactor)), 0),
        notExecuted: Math.max(Math.floor(item.notExecuted * (1 - adjustmentFactor)), 0)
      }));
    }
  }

  updateChart() {
    this.loadChartData();
  }

  getSegmentHeight(value: number): number {
    return value;
  }

  getTotalPassed(): number {
    return this.getLastItem().passed;
  }

  getTotalFailed(): number {
    return this.getLastItem().failed;
  }

  getTotalBlocked(): number {
    return this.getLastItem().blocked;
  }

  getTotalNotExecuted(): number {
    return this.getLastItem().notExecuted;
  }

  private getLastItem(): ChartData {
    return this.chartData[this.chartData.length - 1];
  }
}
