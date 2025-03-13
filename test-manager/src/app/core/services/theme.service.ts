import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _darkMode = signal(false);
  darkMode = this._darkMode.asReadonly();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    // Always start with light theme class explicitly
    if (isPlatformBrowser(this.platformId)) {
      this.applyTheme(false);

      // Then check for saved preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this._darkMode.set(true);
        this.applyTheme(true);
      }
    }
  }

  toggleDarkMode() {
    const newValue = !this._darkMode();
    this._darkMode.set(newValue);
    this.applyTheme(newValue);

    // Save preference to localStorage if in browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
    }
  }

  applyTheme(isDark: boolean) {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip DOM manipulation on server
    }

    const rootElement = this.document.documentElement;
    const bodyElement = this.document.body;

    if (isDark) {
      rootElement.classList.add('dark-theme');
      rootElement.classList.remove('light-theme');
      bodyElement.classList.add('dark-theme');
      bodyElement.classList.remove('light-theme');
    } else {
      rootElement.classList.add('light-theme');
      rootElement.classList.remove('dark-theme');
      bodyElement.classList.add('light-theme');
      bodyElement.classList.remove('dark-theme');
    }
  }

  // Helper method to get current dark mode value
  isDarkMode(): boolean {
    return this._darkMode();
  }
}
