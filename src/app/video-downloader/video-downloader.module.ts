import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { VideoDownloaderPage } from './video-downloader.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: VideoDownloaderPage }]),
    TranslocoModule,
  ],
  declarations: [VideoDownloaderPage, ContextMenuComponent],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'video' }],
})
export class VideoDownloaderPageModule {}
