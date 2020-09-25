import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

type DarkModeValue = 'on' | 'off';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  readonly STORAGE_DARK_MODE_KEY = 'dark.mode';

  private renderer: Renderer2;

  isEnabled: boolean;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  initialize() {
    let enableDarkMode = this.load();

    if (enableDarkMode === null) {
      enableDarkMode = this.isUserPreferenceDarkMode() ? 'on' : 'off';
    }

    if (enableDarkMode === 'on') {
      this.enable();
    } else {
      this.disable();
    }
  }

  isUserPreferenceDarkMode() {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');

    return prefersDarkMode.matches;
  }

  enable() {
    this.renderer.addClass(document.body, 'dark');
    this.isEnabled = true;
    this.save('on');
  }

  disable() {
    this.renderer.removeClass(document.body, 'dark');
    this.isEnabled = false;
    this.save('off');
  }

  private load() {
    return localStorage.getItem(this.STORAGE_DARK_MODE_KEY);
  }

  private save(value: DarkModeValue) {
    localStorage.setItem(this.STORAGE_DARK_MODE_KEY, value);
  }
}
