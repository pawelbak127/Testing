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
  `
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
