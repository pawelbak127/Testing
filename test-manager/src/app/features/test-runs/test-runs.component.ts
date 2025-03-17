import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StatusChipComponent } from '../../shared/ui/status-chip/status-chip.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { TestRun } from '../../core/models/test-run.model';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-test-runs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    StatusChipComponent,
    PageHeaderComponent
  ],
  templateUrl: './test-runs.component.html',
  styleUrls: ['./test-runs.component.scss']
})
export class TestRunsComponent implements OnInit {
  activeRuns: TestRun[] = [];
  completedRuns: TestRun[] = [];
  scheduledRuns: TestRun[] = [];
  isLoading = true;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadTestRuns();
  }

  loadTestRuns() {
    this.isLoading = true;
    this.apiService.getTestRuns().subscribe(
      testRuns => {
        // Reset arrays
        this.activeRuns = [];
        this.completedRuns = [];
        this.scheduledRuns = [];

        // Categorize data by status
        testRuns.forEach(run => {
          if (run.progress && run.progress.percentage < 100) {
            this.activeRuns.push(run);
          } else if (run.results) {
            this.completedRuns.push(run);
          } else {
            this.scheduledRuns.push(run);
          }
        });

        this.isLoading = false;
      },
      error => {
        console.error('Error loading test runs:', error);
        this.snackBar.open('Error loading data', 'OK', { duration: 3000 });
        
        // Fallback to example data in case of API error
        this.setupMockData();
        this.isLoading = false;
      }
    );
  }

  setupMockData() {
    this.activeRuns = [
      {
        id: 'TR-007',
        name: 'Testy modułu płatności',
        project: 'Portal klienta',
        progress: { current: 15, total: 20, percentage: 75 }
      },
      {
        id: 'TR-008',
        name: 'Testy wydajnościowe API',
        project: 'Backend API',
        progress: { current: 6, total: 20, percentage: 30 }
      }
    ];
    
    this.completedRuns = [
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
      },
      {
        id: 'TR-004',
        name: 'Testy bezpieczeństwa',
        project: 'Backend API',
        results: { success: 12, errors: 3 }
      }
    ];
    
    this.scheduledRuns = [
      {
        id: 'TR-009',
        name: 'Testy integracji z API płatności',
        project: 'Portal klienta',
        date: '15 mar 2025'
      },
      {
        id: 'TR-010',
        name: 'Testy kompatybilności mobilnej',
        project: 'Aplikacja mobilna',
        date: '18 mar 2025'
      }
    ];
  }

  createTestRun() {
    this.router.navigate(['/test-runs/create']);
  }

  continueTestRun(run: TestRun) {
    this.router.navigate(['/test-runs/execute', run.id]);
  }

  viewTestRunDetails(run: TestRun) {
    this.router.navigate(['/test-runs/details', run.id]);
  }

  editTestRun(run: TestRun) {
    this.router.navigate(['/test-runs/create'], { queryParams: { testRunId: run.id } });
  }

  generateReport(run: TestRun) {
    this.router.navigate(['/reports/generate'], { queryParams: { testRunId: run.id } });
  }
}
