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
    .metric-card {
      .metric-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      
      .metric-info {
        .metric-label {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        
        .metric-value {
          font-size: 28px;
          font-weight: 500;
          margin-bottom: 8px;
        }
        
        .metric-change {
          font-size: 14px;
          color: var(--text-secondary);
          
          span {
            font-weight: 500;
          }
          
          &.positive span {
            color: var(--success-color);
          }
          
          &.negative span {
            color: var(--warn-color);
          }
        }
      }
      
      .metric-icon {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.blue {
          background-color: rgba(63, 81, 181, 0.1);
          color: #3f51b5;
        }
        
        &.red {
          background-color: rgba(244, 67, 54, 0.1);
          color: #f44336;
        }
        
        &.purple {
          background-color: rgba(156, 39, 176, 0.1);
          color: #9c27b0;
        }
        
        &.green {
          background-color: rgba(76, 175, 80, 0.1);
          color: #4caf50;
        }
      }
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
