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
  templateUrl: './test-status-chart.component.html',
  styleUrls: ['./test-status-chart.component.scss']
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
    // Przykładowe dane dla widoku
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

    // Filtrowanie według projektu
    if (this.selectedProject !== 'all') {
      // W rzeczywistej aplikacji, dane byłyby filtrowane po ID projektu
      // Tutaj symulujemy różne dane dla różnych projektów
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
