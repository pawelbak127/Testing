import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    <div [ngClass]="{'dark-theme': themeService.darkMode(), 'light-theme': !themeService.darkMode()}" class="app-container">
      <app-navigation (sidebarToggled)="toggleSidenav()"></app-navigation>
      
      <mat-sidenav-container class="sidenav-container">
        <app-sidebar [opened]="sidenavOpened()"></app-sidebar>
        
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
  `]
})
export class AppComponent {
  sidenavOpened = signal(true);
  
  constructor(public themeService: ThemeService) {}
  
  toggleSidenav() {
    this.sidenavOpened.update(value => !value);
  }
}
