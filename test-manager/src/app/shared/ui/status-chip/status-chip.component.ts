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

      &.primary {
        background-color: rgba(33, 150, 243, 0.1);
        color: #2196f3;
      }

      &.accent {
        background-color: rgba(255, 152, 0, 0.1);
        color: #ff9800;
      }

      &.warn {
        background-color: rgba(244, 67, 54, 0.1);
        color: #f44336;
      }

      &.success {
        background-color: rgba(76, 175, 80, 0.1);
        color: #4caf50;
      }

      &.default {
        background-color: rgba(158, 158, 158, 0.1);
        color: #9e9e9e;
      }
    }
  `]
})
export class StatusChipComponent {
  @Input() text = '';
  @Input() color: string = 'default';

  get colorClass(): string {
    // Lista dozwolonych klas kolorów
    const allowedColors = ['primary', 'accent', 'warn', 'success', 'default'];

    // Sprawdź, czy kolor jest w dozwolonej liście
    return allowedColors.includes(this.color) ? this.color : 'default';
  }
}
