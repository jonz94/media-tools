import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'app/video-downloader',
    pathMatch: 'full',
  },
  {
    path: 'app',
    redirectTo: 'app/video-downloader',
    pathMatch: 'full',
  },
  {
    path: 'app/video-downloader',
    loadChildren: () =>
      import('./video-downloader/video-downloader.module').then(
        (m) => m.VideoDownloaderPageModule,
      ),
  },
  {
    path: '**',
    redirectTo: 'app',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
