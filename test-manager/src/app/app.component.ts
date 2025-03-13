import { Component, signal, OnInit, PLATFORM_ID, Inject } from '@angular/core';
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
    <div class="app-container">
      <app-navigation (sidebarToggled)="toggleSidenav()"></app-navigation>

      <mat-sidenav-container class="sidenav-container">
        <!-- Właściwa implementacja mat-sidenav -->
        <mat-sidenav [opened]="sidenavOpened()" mode="side" class="app-sidenav">
          <app-sidebar></app-sidebar>
        </mat-sidenav>

        <mat-sidenav-content class="sidenav-content-container">
          <div class="main-content">
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
      margin-top: 64px; // Height of toolbar
    }

    .main-content {
      padding: 24px;
    }

    .app-sidenav {
      width: 240px;
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
      // Responsive sidenav behavior
      this.handleResponsiveSidenav();
    }
  }

  toggleSidenav() {
    this.sidenavOpened.update(value => !value);
  }

  private handleResponsiveSidenav() {
    // Close sidenav on small screens by default
    const checkWidth = () => {
      if (window.innerWidth < 768 && this.sidenavOpened()) {
        this.sidenavOpened.set(false);
      } else if (window.innerWidth >= 768 && !this.sidenavOpened()) {
        this.sidenavOpened.set(true);
      }
    };

    // Check on init
    checkWidth();

    // Listen for resize events
    window.addEventListener('resize', checkWidth);
  }
}
