import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { Report } from '../../core/models/report.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  reports: Report[] = [
    {
      title: 'Raport wydajności tygodniowy',
      project: 'Wszystkie projekty',
      date: '10 mar 2025',
      icon: 'bar_chart',
      color: 'primary'
    },
    {
      title: 'Raport defektów',
      project: 'Portal klienta',
      date: '9 mar 2025',
      icon: 'error',
      color: 'warn'
    },
    {
      title: 'Raport pokrycia testami',
      project: 'Backend API',
      date: '8 mar 2025',
      icon: 'check_circle',
      color: 'success'
    },
    {
      title: 'Raport wydajności miesięczny',
      project: 'Wszystkie projekty',
      date: '5 mar 2025',
      icon: 'bar_chart',
      color: 'primary'
    },
    {
      title: 'Raport czasu wykonania testów',
      project: 'Aplikacja mobilna',
      date: '3 mar 2025',
      icon: 'schedule',
      color: 'purple'
    },
    {
      title: 'Raport regresji',
      project: 'Portal klienta',
      date: '1 mar 2025',
      icon: 'trending_up',
      color: 'accent'
    }
  ];
}
