import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  themeSubscriber = new ReplaySubject();
  surfaceBackground: string;

  private lightSurface = 'rgba(255, 255, 255, 0)';
  private darkSurface = 'rgba(42, 50, 61, 0)';
  private defaultAssetImgTheme = `assets/imgs/${this.getThemePreference()}`;

  constructor() { }

  setThemePreference(themePreference: string, themeName: string): void {
    this.surfaceBackground = themePreference == 'dark' ? this.darkSurface : this.lightSurface;
    localStorage.setItem('theme_preference', themePreference);
    localStorage.setItem('theme_name', themeName);
    this.defaultAssetImgTheme = `assets/imgs/${themePreference}`;
    this.themeSubscriber.next(themePreference);
  }

  getThemePreference(): string {
    return localStorage.getItem('theme_preference') || 'light';
  }
  getThemeName(): string {
    return localStorage.getItem('theme_name');
  }

  getDefaultAssetImgTheme() {
    return this.defaultAssetImgTheme;
  }
}
