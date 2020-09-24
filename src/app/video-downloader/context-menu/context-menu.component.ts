import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ClipboardService } from '../../shared/services';

@Component({
  selector: 'context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent {
  @Input() url = '';

  constructor(
    private popoverController: PopoverController,
    private clipboardService: ClipboardService,
  ) {}

  copy() {
    this.clipboardService.writeText(this.url);
    this.popoverController.dismiss();
  }

  paste() {
    const text = this.clipboardService.readText();
    this.popoverController.dismiss({ text }, 'paste');
  }
}
