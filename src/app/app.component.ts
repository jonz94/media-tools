import { Component, OnInit } from '@angular/core';
import { DarkModeService, LocaleService } from './shared/services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  selectedIndex = 0;

  pages = [
    {
      title: 'videoDownloader',
      url: '/app/video-downloader',
      icon: 'cloud-download-outline',
    },
  ];

  isDarkModeEnabled;
  currentLocale;

  constructor(
    private darkModeService: DarkModeService,
    private localeService: LocaleService,
  ) {}

  ngOnInit() {
    this.darkModeService.initialize();
    this.localeService.initialize();

    this.isDarkModeEnabled = this.darkModeService.isEnabled;
    this.currentLocale = this.localeService.currentLocale;
  }

  changeLocale(value) {
    this.localeService.change(value);
    this.currentLocale = this.localeService.currentLocale;
  }

  toggleDarkMode(enable: boolean) {
    enable ? this.darkModeService.enable() : this.darkModeService.disable();
    this.isDarkModeEnabled = this.darkModeService.isEnabled;
  }
}
