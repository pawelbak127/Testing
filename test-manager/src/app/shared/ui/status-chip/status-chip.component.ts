import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="status-chip" [ngClass]="colorClass">
      {{ text }}
    </div>
  `,
  styles: [`
    .status-chip {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .status-chip.primary {
      background-color: rgba(63, 81, 181, 0.1);
      color: var(--primary);
    }
    
    .status-chip.accent {
      background-color: rgba(255, 152, 0, 0.1);
      color: var(--warning);
    }
    
    .status-chip.warn {
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--warn);
    }
    
    .status-chip.success {
      background-color: rgba(76, 175, 80, 0.1);
      color: var(--success);
    }
    
    .status-chip.default {
      background-color: rgba(0, 0, 0, 0.1);
      color: var(--text-secondary);
    }
  `]
})
export class StatusChipComponent {
  @Input() text = '';
  @Input() color: string = 'default';

  get colorClass(): string {
    // Allowed color classes
    const allowedColors = ['primary', 'accent', 'warn', 'success', 'default'];
    return allowedColors.includes(this.color) ? this.color : 'default';
  }
}
