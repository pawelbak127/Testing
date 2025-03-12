import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button mat-icon-button (click)="sidebarToggled.emit()">
        <mat-icon>menu</mat-icon>
      </button>
      
      <div class="logo">
        <span class="primary-text">Test</span>
        <span>Manager</span>
      </div>
      
      <div class="main-nav">
        <a mat-button routerLink="/dashboard" routerLinkActive="active-link">Dashboard</a>
        <a mat-button routerLink="/test-cases" routerLinkActive="active-link">Przypadki testowe</a>
        <a mat-button routerLink="/test-runs" routerLinkActive="active-link">Wykonania testów</a>
        <a mat-button routerLink="/reports" routerLinkActive="active-link">Raporty</a>
      </div>
      
      <span class="spacer"></span>
      
      <div class="search-container">
        <mat-icon>search</mat-icon>
        <input type="text" placeholder="Szukaj..." class="search-input">
      </div>
      
      <button mat-icon-button matBadge="3" matBadgeColor="accent" class="notification-button">
        <mat-icon>notifications</mat-icon>
      </button>
      
      <button mat-icon-button (click)="themeService.toggleDarkMode()">
        <mat-icon>{{ themeService.darkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>
      
      <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
        <div class="avatar">JK</div>
        <span class="username">Jan Kowalski</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </button>
      
      <mat-menu #userMenu="matMenu">
        <button mat-menu-item>
          <mat-icon>person</mat-icon>
          <span>Mój profil</span>
        </button>
        <button mat-menu-item>
          <mat-icon>settings</mat-icon>
          <span>Ustawienia</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item>
          <mat-icon>exit_to_app</mat-icon>
          <span>Wyloguj</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .app-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 999;
    }

    .logo {
      font-size: 20px;
      font-weight: 600;
      margin-right: 32px;
      
      .primary-text {
        color: #90caf9;
        margin-right: 4px;
      }
    }

    .main-nav {
      display: flex;
      
      a {
        margin: 0 4px;
        height: 36px;
        line-height: 36px;
        border-radius: 4px;
        
        &.active-link {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
    }

    .spacer {
      flex: 1 1 auto;
    }

    .search-container {
      display: flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      padding: 0 12px;
      margin-right: 16px;
      height: 36px;
      
      mat-icon {
        margin-right: 8px;
        opacity: 0.7;
      }
      
      .search-input {
        background: transparent;
        border: none;
        outline: none;
        color: inherit;
        width: 180px;
        
        &::placeholder {
          color: currentColor;
          opacity: 0.7;
        }
      }
    }

    .notification-button {
      margin: 0 8px;
    }

    .user-button {
      display: flex;
      align-items: center;
      padding: 0 8px;
      margin-left: 8px;
      
      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #90caf9;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        margin-right: 8px;
      }
      
      .username {
        margin-right: 4px;
      }
    }
  `]
})
export class NavigationComponent {
  themeService = inject(ThemeService);
  @Output() sidebarToggled = new EventEmitter<void>();
}
