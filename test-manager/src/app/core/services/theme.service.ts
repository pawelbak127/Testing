import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _darkMode = signal(false);
  readonly darkMode = this._darkMode.asReadonly();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private overlayContainer: OverlayContainer
  ) {
    if (isPlatformBrowser(this.platformId)) {
      // Sprawdź zapisane preferencje
      const savedTheme = localStorage.getItem('theme');

      // Sprawdź preferencje systemowe
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialDarkMode = savedTheme === 'dark' || 
        (savedTheme === null && prefersDarkMode);

      this._darkMode.set(initialDarkMode);
      this.applyTheme(initialDarkMode);
    }
  }

  toggleDarkMode() {
    const newValue = !this._darkMode();
    this._darkMode.set(newValue);
    this.applyTheme(newValue);

    // Zapisz preferencje w localStorage jeśli w przeglądarce
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
    }
  }

  applyTheme(isDark: boolean) {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Pomiń manipulację DOM na serwerze
    }

    const bodyElement = this.document.body;
    const htmlElement = this.document.documentElement;
    const overlayContainerElement = this.overlayContainer.getContainerElement();

    if (isDark) {
      bodyElement.classList.add('dark-theme');
      bodyElement.classList.remove('light-theme');
      htmlElement.classList.add('dark-theme');
      htmlElement.classList.remove('light-theme');
      overlayContainerElement.classList.add('dark-theme');
      overlayContainerElement.classList.remove('light-theme');
    } else {
      bodyElement.classList.add('light-theme');
      bodyElement.classList.remove('dark-theme');
      htmlElement.classList.add('light-theme');
      htmlElement.classList.remove('dark-theme');
      overlayContainerElement.classList.add('light-theme');
      overlayContainerElement.classList.remove('dark-theme');
    }
  }

  // Pomocnicza metoda do sprawdzania aktualnego trybu ciemnego
  isDarkMode(): boolean {
    return this._darkMode();
  }
}
