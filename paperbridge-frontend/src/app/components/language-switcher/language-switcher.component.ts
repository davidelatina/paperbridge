import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService, SupportedLanguage } from '../../services/translation.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css'
})
export class LanguageSwitcherComponent {
  constructor(public translationService: TranslationService) {}

  changeLanguage(lang: SupportedLanguage): void {
    this.translationService.setLanguage(lang);
  }

  getCurrentLanguage(): SupportedLanguage {
    return this.translationService.getCurrentLanguage();
  }

  getSupportedLanguages() {
    return this.translationService.getSupportedLanguages();
  }
}