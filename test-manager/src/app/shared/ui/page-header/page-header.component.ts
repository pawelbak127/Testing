import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="page-header">
      <h1 class="page-title">{{ title }}</h1>
      
      <div class="page-actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      
      .page-title {
        font-size: 24px;
        font-weight: 500;
        margin: 0;
      }
      
      .page-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  `]
})
export class PageHeaderComponent {
  @Input() title = '';
}
