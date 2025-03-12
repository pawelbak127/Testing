import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <mat-sidenav [opened]="opened" mode="side" class="app-sidenav">
      <div class="sidenav-content">
        <div class="new-test-button-container">
          <button mat-flat-button color="primary" class="new-test-button">
            <mat-icon>add</mat-icon>
            <span>Nowy test</span>
          </button>
        </div>
        
        <mat-nav-list>
          <h3 mat-subheader>Projekty</h3>
          
          <a mat-list-item class="project-item active">
            <div class="project-color-indicator green"></div>
            <span>Portal klienta</span>
          </a>
          
          <a mat-list-item class="project-item">
            <div class="project-color-indicator purple"></div>
            <span>Aplikacja mobilna</span>
          </a>
          
          <a mat-list-item class="project-item">
            <div class="project-color-indicator blue"></div>
            <span>Backend API</span>
          </a>
          
          <mat-divider></mat-divider>
          
          <h3 mat-subheader>Widoki</h3>
          
          <a mat-list-item>
            <mat-icon matListItemIcon>timeline</mat-icon>
            <span>Aktywność</span>
          </a>
          
          <a mat-list-item>
            <mat-icon matListItemIcon>history</mat-icon>
            <span>Ostatnie</span>
          </a>
          
          <a mat-list-item>
            <mat-icon matListItemIcon>calendar_today</mat-icon>
            <span>Harmonogram</span>
          </a>
        </mat-nav-list>
      </div>
      
      <div class="sidenav-footer">
        <a mat-list-item>
          <mat-icon matListItemIcon>settings</mat-icon>
          <span>Ustawienia</span>
        </a>
      </div>
    </mat-sidenav>
  `,
  styles: [`
    .app-sidenav {
      width: 240px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .sidenav-content {
        flex: 1;
        overflow-y: auto;
      }
      
      .new-test-button-container {
        padding: 16px;
        
        .new-test-button {
          width: 100%;
        }
      }
      
      .project-item {
        display: flex;
        align-items: center;
        
        .project-color-indicator {
          width: 4px;
          height: 24px;
          border-radius: 4px;
          margin-right: 12px;
          
          &.green {
            background-color: #4caf50;
          }
          
          &.purple {
            background-color: #9c27b0;
          }
          
          &.blue {
            background-color: #2196f3;
          }
        }
        
        &.active {
          background-color: rgba(0, 0, 0, 0.04);
          
          .dark-theme & {
            background-color: rgba(255, 255, 255, 0.08);
          }
        }
      }
      
      .sidenav-footer {
        border-top: 1px solid rgba(0, 0, 0, 0.12);
        
        .dark-theme & {
          border-top-color: rgba(255, 255, 255, 0.12);
        }
      }
    }
  `]
})
export class SidebarComponent {
  @Input() opened = true;
}
