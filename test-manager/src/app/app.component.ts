import { Component, signal, OnInit, PLATFORM_ID, Inject, HostBinding } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    NavigationComponent,
    SidebarComponent
  ],
  template: `
    <div class="app-container" [class.dark-theme]="themeService.isDarkMode()" [class.light-theme]="!themeService.isDarkMode()">
      <app-navigation (sidebarToggled)="toggleSidenav()"></app-navigation>

      <mat-sidenav-container class="sidenav-container">
        <!-- Prawidłowa implementacja mat-sidenav -->
        <mat-sidenav [opened]="sidenavOpened()" mode="side" class="app-sidenav">
          <app-sidebar></app-sidebar>
        </mat-sidenav>

        <mat-sidenav-content class="sidenav-content-container">
          <div class="main-content" [class.sidebar-open]="sidenavOpened()" [class.sidebar-closed]="!sidenavOpened()">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .sidenav-container {
      flex: 1;
      margin-top: 64px; // Wysokość paska nawigacyjnego
    }

    .main-content {
      padding: 24px;
      transition: margin-left 0.3s ease;
    }

    .main-content.sidebar-open {
      margin-left: 240px; // Szerokość sidebaru
    }

    .main-content.sidebar-closed {
      margin-left: 0;
    }

    .app-sidenav {
      width: 240px;
      transition: transform 0.3s ease;
    }

    @media (max-width: 768px) {
      .main-content.sidebar-open {
        margin-left: 0;
      }

      .app-sidenav {
        width: 100%;
        max-width: 240px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  sidenavOpened = signal(true);

  constructor(
    public themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Responsywne zachowanie panelu bocznego
      this.handleResponsiveSidenav();
    }
  }

  toggleSidenav() {
    this.sidenavOpened.update(value => !value);
  }

  private handleResponsiveSidenav() {
    // Zamknij panel boczny na małych ekranach domyślnie
    const checkWidth = () => {
      if (window.innerWidth < 768 && this.sidenavOpened()) {
        this.sidenavOpened.set(false);
      } else if (window.innerWidth >= 1200 && !this.sidenavOpened()) {
        this.sidenavOpened.set(true);
      }
    };

    // Sprawdź przy inicjalizacji
    checkWidth();

    // Nasłuchuj na zdarzenia zmiany rozmiaru
    window.addEventListener('resize', checkWidth);
  }
}
