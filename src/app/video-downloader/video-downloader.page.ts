import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { shareReplay } from 'rxjs/operators';
import { VideoDownloadService } from '../shared/services';
import { ContextMenuComponent } from './context-menu/context-menu.component';

@Component({
  selector: 'app-video-downloader',
  templateUrl: './video-downloader.page.html',
  styleUrls: ['./video-downloader.page.scss'],
})
export class VideoDownloaderPage {
  url = '';

  isDownloading$ = this.videoDownloadService.isDownloading$.pipe(shareReplay());

  spawnOutput$ = this.videoDownloadService.spawnOutput$
    .asObservable()
    .pipe(shareReplay());

  outputDirectory = this.videoDownloadService.outputDirectory;

  constructor(
    private popoverController: PopoverController,
    private videoDownloadService: VideoDownloadService,
  ) {}

  async presentContextMenu(event: any) {
    const popover = await this.popoverController.create({
      event,
      component: ContextMenuComponent,
      componentProps: {
        url: this.url ?? '',
      },
      mode: 'md',
      showBackdrop: false,
      backdropDismiss: true,
    });

    await popover.present();

    const detail = await popover.onWillDismiss();

    if (detail?.data?.text) {
      this.url = detail.data.text;
    }
  }

  downloadSubtitle() {
    try {
      this.videoDownloadService.downloadSubtitle(this.url);
    } catch (error) {
      console.error(error);
    }
  }

  downloadTranslatedSubtitle() {
    try {
      this.videoDownloadService.downloadSubtitle(this.url, 'zh-Hant');
    } catch (error) {
      console.error(error);
    }
  }

  downloadVideo() {
    try {
      this.videoDownloadService.downloadVideo(this.url);
    } catch (error) {
      console.error(error);
    }
  }

  changeOutoutDirectory() {
    this.videoDownloadService.changeOutputDirectory();
    this.outputDirectory = this.videoDownloadService.outputDirectory;
  }

  cancelDownload() {
    try {
      this.videoDownloadService.cancelDownloadProcess();
    } catch (error) {
      console.error(error);
    }
  }
}
