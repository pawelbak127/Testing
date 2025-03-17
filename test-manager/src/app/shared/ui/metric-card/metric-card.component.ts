import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <mat-card class="metric-card">
      <mat-card-content>
        <div class="metric-content">
          <div class="metric-info">
            <div class="metric-label">{{ label }}</div>
            <div class="metric-value">{{ value }}</div>
            <div class="metric-change" [ngClass]="changeType">
              <span>{{ change }}</span> {{ changeLabel }}
            </div>
          </div>
          <div class="metric-icon" [ngClass]="color">
            <mat-icon>{{ icon }}</mat-icon>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .metric-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
  `]
})
export class MetricCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() change = '';
  @Input() changeLabel = '';
  @Input() changeType: 'positive' | 'negative' | 'neutral' = 'neutral';
  @Input() icon = 'insights';
  @Input() color: 'blue' | 'red' | 'purple' | 'green' = 'blue';
}
