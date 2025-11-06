import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export type SupportedLanguage = 'en' | 'it';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = signal<SupportedLanguage>('en');
  private translations = signal<Record<string, any>>({});
  private loading = signal<boolean>(false);

  // Expose translations as a readonly signal for reactive access
  readonly translationsSignal = this.translations.asReadonly();

  constructor(private http: HttpClient) {
    // Load saved language preference from localStorage
    const savedLang = localStorage.getItem('app-language') as SupportedLanguage;
    if (savedLang && (savedLang === 'en' || savedLang === 'it')) {
      this.currentLanguage.set(savedLang);
    }
    this.loadTranslations(this.currentLanguage());
  }

  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage();
  }

  setLanguage(lang: SupportedLanguage): void {
    if (lang !== this.currentLanguage()) {
      this.currentLanguage.set(lang);
      localStorage.setItem('app-language', lang);
      this.loadTranslations(lang);
    }
  }

  private loadTranslations(lang: SupportedLanguage): void {
    this.loading.set(true);
    this.http.get<Record<string, any>>(`/assets/i18n/${lang}.json`)
      .pipe(
        catchError((error) => {
          console.error(`Failed to load translations for ${lang}:`, error);
          return of({});
        })
      )
      .subscribe(translations => {
        this.translations.set(translations);
        this.loading.set(false);
      });
  }

  translate(key: string, params?: Record<string, string>): string {
    // Read from signal to create reactive dependency
    const translations = this.translations();
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Simple parameter substitution
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    }

    return value;
  }

  getSupportedLanguages(): Array<{ code: SupportedLanguage; name: string }> {
    return [
      { code: 'en', name: 'English' },
      { code: 'it', name: 'Italiano' }
    ];
  }
}