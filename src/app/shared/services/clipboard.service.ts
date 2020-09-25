import { Injectable } from '@angular/core';
import { clipboard } from 'electron';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  private clipboard: typeof clipboard;

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.clipboard = window.require('electron').clipboard;
    }
  }

  readText() {
    return this.clipboard.readText();
  }

  writeText(text: string) {
    this.clipboard.writeText(text);
  }
}
