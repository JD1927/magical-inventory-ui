import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorSchemeService {
  readonly isDarkMode = signal<boolean>(true);

  onToggleDarkMode(): void {
    // Hello my friend
    const element = document.querySelector('html');
    if (!element) return;
    element.classList.toggle('magical-inventory-ui-dark');
    this.isDarkMode.update((value) => !value);
  }
}
