import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatusChipComponent } from '../../shared/ui/status-chip/status-chip.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { TestRun } from '../../core/models/test-run.model';

@Component({
  selector: 'app-test-runs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    StatusChipComponent,
    PageHeaderComponent
  ],
  templateUrl: './test-runs.component.html',
  styleUrls: ['./test-runs.component.scss']
})
export class TestRunsComponent {
  activeRuns: TestRun[] = [
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
  
  completedRuns: TestRun[] = [
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
  
  scheduledRuns: TestRun[] = [
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
