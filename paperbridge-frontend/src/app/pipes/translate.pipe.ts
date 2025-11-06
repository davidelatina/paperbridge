import { Pipe, PipeTransform, ChangeDetectorRef, inject } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Make it impure to react to language changes
})
export class TranslatePipe implements PipeTransform {
  private translationService = inject(TranslationService);
  private changeDetector = inject(ChangeDetectorRef);

  transform(key: string, params?: Record<string, string>): string {
    if (!key) {
      return '';
    }
    
    // Explicitly read the translations signal to create a reactive dependency
    // This ensures the pipe re-runs when translations change
    this.translationService.translationsSignal();
    
    // Get the translation
    return this.translationService.translate(key, params);
  }
}