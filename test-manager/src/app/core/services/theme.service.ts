import { Injectable, signal } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _darkMode = signal(false);
  darkMode = this._darkMode.asReadonly();
  
  constructor(private overlayContainer: OverlayContainer) {}
  
  toggleDarkMode() {
    const newValue = !this._darkMode();
    this._darkMode.set(newValue);
    
    if (newValue) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      this.overlayContainer.getContainerElement().classList.add('dark-theme');
      this.overlayContainer.getContainerElement().classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      this.overlayContainer.getContainerElement().classList.add('light-theme');
      this.overlayContainer.getContainerElement().classList.remove('dark-theme');
    }
  }
}
