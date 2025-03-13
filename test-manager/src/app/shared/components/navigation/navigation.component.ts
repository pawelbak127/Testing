import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatDividerModule,
    MatTooltipModule
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button mat-icon-button (click)="sidebarToggled.emit()" matTooltip="Przełącz panel boczny">
        <mat-icon>menu</mat-icon>
      </button>

      <div class="logo" routerLink="/dashboard">
        <span class="primary-text">Test</span>
        <span>Manager</span>
      </div>

      <div class="main-nav">
        <a mat-button routerLink="/dashboard" routerLinkActive="active-link">Dashboard</a>
        <a mat-button routerLink="/test-cases" routerLinkActive="active-link">Przypadki testowe</a>
        <a mat-button routerLink="/test-runs" routerLinkActive="active-link">Wykonania testów</a>
        <a mat-button routerLink="/reports" routerLinkActive="active-link">Raporty</a>
        <a mat-button routerLink="/analytics" routerLinkActive="active-link">Analityka</a>
      </div>

      <span class="spacer"></span>

      <div class="search-container">
        <mat-icon>search</mat-icon>
        <input type="text" placeholder="Szukaj..." class="search-input">
      </div>

      <button mat-icon-button [matMenuTriggerFor]="createMenu" matTooltip="Utwórz nowy">
        <mat-icon>add</mat-icon>
      </button>

      <mat-menu #createMenu="matMenu">
        <button mat-menu-item routerLink="/test-cases/create">
          <mat-icon>note_add</mat-icon>
          <span>Nowy przypadek testowy</span>
        </button>
        <button mat-menu-item routerLink="/test-runs/create">
          <mat-icon>play_circle</mat-icon>
          <span>Nowe wykonanie testów</span>
        </button>
        <button mat-menu-item routerLink="/reports/generate">
          <mat-icon>assessment</mat-icon>
          <span>Nowy raport</span>
        </button>
      </mat-menu>

      <button mat-icon-button matBadge="3" matBadgeColor="accent" class="notification-button"
              [matMenuTriggerFor]="notificationsMenu" matTooltip="Powiadomienia">
        <mat-icon>notifications</mat-icon>
      </button>

      <mat-menu #notificationsMenu="matMenu" class="notifications-menu">
        <div class="menu-header">
          <h3>Powiadomienia</h3>
          <button mat-button color="primary">Oznacz jako przeczytane</button>
        </div>

        <mat-divider></mat-divider>

        <div class="notifications-list">
          <button mat-menu-item class="notification-item unread">
            <div class="notification-icon test-run">
              <mat-icon>play_circle</mat-icon>
            </div>
            <div class="notification-content">
              <div class="notification-message">Wykonanie testu "Testy modułu płatności" zostało zakończone</div>
              <div class="notification-date">12 mar 2025, 11:30</div>
            </div>
          </button>

          <button mat-menu-item class="notification-item unread">
            <div class="notification-icon defect">
              <mat-icon>bug_report</mat-icon>
            </div>
            <div class="notification-content">
              <div class="notification-message">Nowy błąd: "Błąd podczas przetwarzania płatności kartą"</div>
              <div class="notification-date">10 mar 2025, 11:05</div>
            </div>
          </button>

          <button mat-menu-item class="notification-item">
            <div class="notification-icon system">
              <mat-icon>settings</mat-icon>
            </div>
            <div class="notification-content">
              <div class="notification-message">Zaplanowany przegląd techniczny systemu w dniu 15 marca</div>
              <div class="notification-date">9 mar 2025, 09:15</div>
            </div>
          </button>
        </div>

        <mat-divider></mat-divider>

        <div class="menu-footer">
          <button mat-button routerLink="/profile" [queryParams]="{tab: 'notifications'}">
            Wszystkie powiadomienia
          </button>
        </div>
      </mat-menu>

      <button mat-icon-button (click)="themeService.toggleDarkMode()" matTooltip="Zmień motyw">
        <mat-icon>{{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>

      <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
        <div class="avatar">JK</div>
        <span class="username">Jan Kowalski</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </button>

      <mat-menu #userMenu="matMenu">
        <button mat-menu-item routerLink="/profile">
          <mat-icon>person</mat-icon>
          <span>Mój profil</span>
        </button>
        <button mat-menu-item routerLink="/settings/project">
          <mat-icon>settings</mat-icon>
          <span>Ustawienia</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item>
          <mat-icon>help</mat-icon>
          <span>Pomoc</span>
        </button>
        <button mat-menu-item>
          <mat-icon>feedback</mat-icon>
          <span>Zgłoś problem</span>
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
      cursor: pointer;

      .primary-text {
        color: #90caf9; // Light blue accent for logo
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

      @media (max-width: 992px) {
        display: none;
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

      @media (max-width: 768px) {
        display: none;
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
        color: var(--on-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        margin-right: 8px;
      }

      .username {
        margin-right: 4px;

        @media (max-width: 600px) {
          display: none;
        }
      }
    }

    ::ng-deep .notifications-menu {
      max-width: 350px;

      .mat-mdc-menu-content {
        padding: 0;
      }

      .menu-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;

        h3 {
          font-size: 16px;
          font-weight: 500;
          margin: 0;
        }
      }

      .notifications-list {
        max-height: 320px;
        overflow-y: auto;

        .notification-item {
          display: flex;
          align-items: flex-start;
          padding: 12px 16px;
          height: auto;
          min-height: 64px;

          &.unread {
            background-color: rgba(var(--primary-rgb), 0.05);

            .dark-theme & {
              background-color: rgba(var(--primary-rgb), 0.1);
            }
          }

          .notification-icon {
            margin-right: 12px;

            &.test-run {
              color: var(--primary);
            }

            &.defect {
              color: var(--error);
            }

            &.system {
              color: var(--warning);
            }
          }

          .notification-content {
            flex: 1;

            .notification-message {
              white-space: normal;
              line-height: 1.4;
            }

            .notification-date {
              font-size: 12px;
              color: var(--on-surface-medium);
              margin-top: 4px;
            }
          }
        }
      }

      .menu-footer {
        display: flex;
        justify-content: center;
        padding: 8px;
      }
    }
  `]
})
export class NavigationComponent {
  themeService = inject(ThemeService);
  @Output() sidebarToggled = new EventEmitter<void>();
}
