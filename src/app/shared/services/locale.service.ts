import { Injectable, OnDestroy } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

type LocaleValue = 'en' | 'zh-TW';

@Injectable({
  providedIn: 'root',
})
export class LocaleService implements OnDestroy {
  readonly STORAGE_LOCALE_KEY = 'locale';

  private subscription: Subscription = Subscription.EMPTY;
  private langChangeSubscription: Subscription = Subscription.EMPTY;

  currentLocale;

  constructor(private translocoService: TranslocoService) {}

  initialize() {
    const lang = this.load() ?? this.getDefaultLocale();
    this.currentLocale = lang;
    this.change(lang);
  }

  getDefaultLocale(): LocaleValue {
    return /^zh/.test(window.navigator.language) ? 'zh-TW' : 'en';
  }

  change(lang: LocaleValue) {
    this.subscription.unsubscribe();
    this.subscription = this.translocoService
      .load(lang)
      .pipe(take(1))
      .subscribe(() => this.setLocale(lang));
  }

  private setLocale(lang: LocaleValue) {
    this.save(lang);
    this.currentLocale = lang;
    this.translocoService.setActiveLang(lang);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.langChangeSubscription.unsubscribe();
  }

  private load() {
    return localStorage.getItem(this.STORAGE_LOCALE_KEY) as LocaleValue;
  }

  private save(value: LocaleValue) {
    localStorage.setItem(this.STORAGE_LOCALE_KEY, value);
  }
}
