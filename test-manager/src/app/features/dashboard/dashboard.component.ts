import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MetricCardComponent } from '../../shared/ui/metric-card/metric-card.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MetricCardComponent,
    PageHeaderComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  timeRangeOptions = ['Ostatnie 7 dni', 'Ostatnie 30 dni', 'Ten kwartał'];
  selectedTimeRange = 'Ostatnie 7 dni';
  
  recentTests = [
    { 
      name: 'Logowanie użytkownika', 
      status: 'success', 
      project: 'Portal klienta', 
      time: '2 godz. temu' 
    },
    { 
      name: 'Rejestracja konta', 
      status: 'error', 
      project: 'Portal klienta', 
      time: '3 godz. temu' 
    },
    { 
      name: 'Wyszukiwanie produktów', 
      status: 'success', 
      project: 'Aplikacja mobilna', 
      time: '4 godz. temu' 
    },
    { 
      name: 'Realizacja zamówienia', 
      status: 'in-progress', 
      project: 'Portal klienta', 
      time: '6 godz. temu' 
    }
  ];
}
