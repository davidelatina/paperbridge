# Localization Plan for PaperBridge

This document outlines a step-by-step plan for implementing internationalization (i18n) and localization (l10n) for both the frontend (Angular) and backend (Spring Boot) components of PaperBridge.

## Overview

The localization system will support:
- **Frontend**: Angular i18n with runtime language switching
- **Backend**: Spring Boot MessageSource for error messages
- **Initial Languages**: English (en) and Italian (it)
- **Language Selection**: User-selectable language switcher in the UI
- **Persistence**: Language preference stored in browser localStorage

---

## Part 1: Frontend Localization (Angular)

### Step 1.1: Install Angular i18n Dependencies

1. **Install @angular/localize** (if not already included):
   ```bash
   cd paperbridge-frontend
   ng add @angular/localize
   ```

2. **Verify Angular i18n support** is available in Angular 20.2.0 (it should be built-in)

### Step 1.2: Create Translation Files Structure

Create the following directory structure:
```
paperbridge-frontend/src/
  └── assets/
      └── i18n/
          ├── en.json
          └── it.json
```

### Step 1.3: Extract All User-Facing Strings

Identify and catalog all strings that need translation:

**From `document-list.component.html`:**
- "Documents"
- "Browse and manage your documents"
- "Cancel"
- "Upload Document"
- "Upload New Document"
- "Choose a file to upload"
- "Folder (Optional)"
- "Select Existing"
- "Create New"
- "Root (no folder)"
- "Root"
- "Enter folder name"
- "Letters, numbers, spaces, hyphens, and underscores only"
- "Uploading..."
- "Upload"
- "Loading documents..."
- "Retry"
- "No documents found"
- "Get started by uploading your first document."
- "Untitled Document"
- "No content available"
- "Created:"
- "Updated:"
- "Please select a file"
- "Failed to load documents"
- "Failed to upload document"
- "Folder name can only contain letters, numbers, spaces, hyphens, and underscores"

**From `directory-tree.component.html`:**
- "Directory"
- "Show root directory documents"
- "Root"
- "Show all documents"
- "All"
- "No documents found"

**From `app.html`:**
- "Documents" (nav link)
- "PaperBridge" (title)

**From `document-list.component.ts`:**
- Error messages in `formatFileSize()`: "Bytes", "KB", "MB", "GB"
- "N/A" in `formatDate()`

**From `directory-tree.component.ts`:**
- "Documents" (root node name)

### Step 1.4: Create Translation JSON Files

**`src/assets/i18n/en.json`:**
```json
{
  "app": {
    "title": "PaperBridge",
    "nav": {
      "documents": "Documents"
    }
  },
  "documents": {
    "title": "Documents",
    "subtitle": "Browse and manage your documents",
    "upload": {
      "button": "Upload Document",
      "cancel": "Cancel",
      "formTitle": "Upload New Document",
      "chooseFile": "Choose a file to upload",
      "uploading": "Uploading...",
      "uploadButton": "Upload",
      "selectFileError": "Please select a file",
      "folderNameError": "Folder name can only contain letters, numbers, spaces, hyphens, and underscores"
    },
    "folder": {
      "optional": "Folder (Optional)",
      "selectExisting": "Select Existing",
      "createNew": "Create New",
      "root": "Root",
      "rootNoFolder": "Root (no folder)",
      "enterName": "Enter folder name",
      "nameHint": "Letters, numbers, spaces, hyphens, and underscores only"
    },
    "loading": "Loading documents...",
    "error": {
      "loadFailed": "Failed to load documents",
      "uploadFailed": "Failed to upload document"
    },
    "retry": "Retry",
    "empty": {
      "title": "No documents found",
      "message": "Get started by uploading your first document."
    },
    "card": {
      "untitled": "Untitled Document",
      "noContent": "No content available",
      "created": "Created:",
      "updated": "Updated:"
    }
  },
  "directory": {
    "title": "Directory",
    "root": "Root",
    "all": "All",
    "rootTooltip": "Show root directory documents",
    "allTooltip": "Show all documents",
    "empty": "No documents found"
  },
  "common": {
    "fileSize": {
      "bytes": "Bytes",
      "kb": "KB",
      "mb": "MB",
      "gb": "GB"
    },
    "date": {
      "na": "N/A"
    }
  }
}
```

**`src/assets/i18n/it.json`:**
```json
{
  "app": {
    "title": "PaperBridge",
    "nav": {
      "documents": "Documenti"
    }
  },
  "documents": {
    "title": "Documenti",
    "subtitle": "Sfoglia e gestisci i tuoi documenti",
    "upload": {
      "button": "Carica Documento",
      "cancel": "Annulla",
      "formTitle": "Carica Nuovo Documento",
      "chooseFile": "Scegli un file da caricare",
      "uploading": "Caricamento...",
      "uploadButton": "Carica",
      "selectFileError": "Seleziona un file",
      "folderNameError": "Il nome della cartella può contenere solo lettere, numeri, spazi, trattini e underscore"
    },
    "folder": {
      "optional": "Cartella (Opzionale)",
      "selectExisting": "Seleziona Esistente",
      "createNew": "Crea Nuova",
      "root": "Radice",
      "rootNoFolder": "Radice (nessuna cartella)",
      "enterName": "Inserisci nome cartella",
      "nameHint": "Solo lettere, numeri, spazi, trattini e underscore"
    },
    "loading": "Caricamento documenti...",
    "error": {
      "loadFailed": "Impossibile caricare i documenti",
      "uploadFailed": "Impossibile caricare il documento"
    },
    "retry": "Riprova",
    "empty": {
      "title": "Nessun documento trovato",
      "message": "Inizia caricando il tuo primo documento."
    },
    "card": {
      "untitled": "Documento Senza Titolo",
      "noContent": "Nessun contenuto disponibile",
      "created": "Creato:",
      "updated": "Aggiornato:"
    }
  },
  "directory": {
    "title": "Directory",
    "root": "Radice",
    "all": "Tutti",
    "rootTooltip": "Mostra documenti della directory radice",
    "allTooltip": "Mostra tutti i documenti",
    "empty": "Nessun documento trovato"
  },
  "common": {
    "fileSize": {
      "bytes": "Byte",
      "kb": "KB",
      "mb": "MB",
      "gb": "GB"
    },
    "date": {
      "na": "N/D"
    }
  }
}
```

### Step 1.5: Create Translation Service

Create `src/app/services/translation.service.ts`:

```typescript
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export type SupportedLanguage = 'en' | 'it';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = signal<SupportedLanguage>('en');
  private translations = signal<Record<string, any>>({});
  private loading = signal<boolean>(false);

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
        catchError(() => {
          console.error(`Failed to load translations for ${lang}`);
          return of({});
        })
      )
      .subscribe(translations => {
        this.translations.set(translations);
        this.loading.set(false);
      });
  }

  translate(key: string, params?: Record<string, string>): string {
    const keys = key.split('.');
    let value: any = this.translations();
    
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
```

### Step 1.6: Create Translation Pipe

Create `src/app/pipes/translate.pipe.ts`:

```typescript
import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Make it impure to react to language changes
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private lastKey: string = '';
  private lastValue: string = '';
  private subscription?: Subscription;

  constructor(
    private translationService: TranslationService,
    private changeDetector: ChangeDetectorRef
  ) {}

  transform(key: string, params?: Record<string, string>): string {
    if (!key || key !== this.lastKey) {
      this.lastKey = key;
      this.lastValue = this.translationService.translate(key, params);
    }
    return this.lastValue;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
```

### Step 1.7: Create Language Switcher Component

Create `src/app/components/language-switcher/language-switcher.component.ts`:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService, SupportedLanguage } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
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
```

Create `src/app/components/language-switcher/language-switcher.component.html`:

```html
<div class="language-switcher">
  <select 
    [value]="getCurrentLanguage()" 
    (change)="changeLanguage($any($event.target).value)"
    class="language-select"
    aria-label="Select language"
  >
    @for (lang of getSupportedLanguages(); track lang.code) {
      <option [value]="lang.code">{{ lang.name }}</option>
    }
  </select>
</div>
```

Create `src/app/components/language-switcher/language-switcher.component.css`:

```css
.language-switcher {
  display: inline-block;
}

.language-select {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
}

.language-select:hover {
  border-color: #888;
}

.language-select:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}
```

### Step 1.8: Update Components to Use Translations

**Update `document-list.component.ts`:**
- Import `TranslationService` and `TranslatePipe`
- Replace hardcoded strings with translation keys using the pipe
- Update error messages to use translations

**Update `document-list.component.html`:**
- Replace all hardcoded text with `{{ 'key.path' | translate }}`
- Use the translate pipe for all user-facing strings

**Update `directory-tree.component.ts`:**
- Import `TranslationService`
- Replace hardcoded "Documents" string with translation

**Update `directory-tree.component.html`:**
- Replace hardcoded text with translate pipe

**Update `app.html`:**
- Add language switcher component to navbar
- Replace hardcoded text with translate pipe

### Step 1.9: Update App Configuration

**Update `app.config.ts`** to include HttpClient:

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};
```

### Step 1.10: Ensure Assets Are Served

Verify that `angular.json` includes the assets folder:

```json
"assets": [
  "src/favicon.ico",
  "src/assets"
]
```

---

## Part 2: Backend Localization (Spring Boot)

### Step 2.1: Configure MessageSource

**Update `application.properties`** (or create `application.yml`):

```properties
# Internationalization
spring.messages.basename=messages
spring.messages.encoding=UTF-8
spring.messages.cache-duration=3600
spring.messages.fallback-to-system-locale=true
```

### Step 2.2: Create Message Resource Files

Create the following directory structure:
```
paperbridge-backend/src/main/resources/
  └── messages/
      ├── messages.properties (default/English)
      ├── messages_en.properties (English)
      └── messages_it.properties (Italian)
```

**`messages.properties` and `messages_en.properties`:**
```properties
# Error Messages
error.document.notfound=Document not found with ID: {0}
error.file.null=File is null
error.file.empty=File is empty
error.file.noFilename=File has no original filename
error.folder.invalidPath=Invalid subfolder path: {0}
error.storage.failed=Failed to store file {0}
error.storage.pathTraversal=Path traversal attempt detected

# Success Messages (if needed in future)
success.document.uploaded=Document uploaded successfully
success.document.updated=Document updated successfully
success.document.deleted=Document deleted successfully
```

**`messages_it.properties`:**
```properties
# Error Messages
error.document.notfound=Documento non trovato con ID: {0}
error.file.null=Il file è nullo
error.file.empty=Il file è vuoto
error.file.noFilename=Il file non ha un nome originale
error.folder.invalidPath=Percorso sottocartella non valido: {0}
error.storage.failed=Impossibile salvare il file {0}
error.storage.pathTraversal=Tentativo di path traversal rilevato

# Success Messages
success.document.uploaded=Documento caricato con successo
success.document.updated=Documento aggiornato con successo
success.document.deleted=Documento eliminato con successo
```

### Step 2.3: Create MessageSource Configuration

Create `src/main/java/org/paperbridge/backend/config/LocaleConfig.java`:

```java
package org.paperbridge.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;

@Configuration
public class LocaleConfig {

    @Bean
    public LocaleResolver localeResolver() {
        AcceptHeaderLocaleResolver resolver = new AcceptHeaderLocaleResolver();
        resolver.setDefaultLocale(Locale.ENGLISH);
        resolver.setSupportedLocales(Arrays.asList(Locale.ENGLISH, Locale.ITALIAN));
        return resolver;
    }

    @Bean
    public ResourceBundleMessageSource messageSource() {
        ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
        messageSource.setBasename("messages/messages");
        messageSource.setDefaultEncoding("UTF-8");
        messageSource.setCacheSeconds(3600);
        messageSource.setFallbackToSystemLocale(true);
        return messageSource;
    }
}
```

### Step 2.4: Create Message Service

Create `src/main/java/org/paperbridge/backend/service/MessageService.java`:

```java
package org.paperbridge.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class MessageService {

    private final MessageSource messageSource;

    @Autowired
    public MessageService(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public String getMessage(String key, Object... args) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(key, args, key, locale);
    }

    public String getMessage(String key, Locale locale, Object... args) {
        return messageSource.getMessage(key, args, key, locale);
    }
}
```

### Step 2.5: Update Exception Classes

**Update `DocumentNotFoundException`:**
```java
package org.paperbridge.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class DocumentNotFoundException extends RuntimeException {
    private final Long documentId;

    public DocumentNotFoundException(Long documentId) {
        super("Document not found with ID: " + documentId);
        this.documentId = documentId;
    }

    public DocumentNotFoundException(String message) {
        super(message);
        this.documentId = null;
    }

    public Long getDocumentId() {
        return documentId;
    }
}
```

### Step 2.6: Update Controllers to Use MessageService

**Update `DocumentController.java`:**
- Inject `MessageService`
- Replace hardcoded error messages with `messageService.getMessage()`
- Use message keys instead of hardcoded strings

**Update `FilesystemStorageService.java`:**
- Inject `MessageService`
- Replace RuntimeException messages with localized messages

### Step 2.7: Create Global Exception Handler (Optional but Recommended)

Create `src/main/java/org/paperbridge/backend/exception/GlobalExceptionHandler.java`:

```java
package org.paperbridge.backend.exception;

import org.paperbridge.backend.controller.DocumentNotFoundException;
import org.paperbridge.backend.service.MessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private final MessageService messageService;

    public GlobalExceptionHandler(MessageService messageService) {
        this.messageService = messageService;
    }

    @ExceptionHandler(DocumentNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleDocumentNotFound(DocumentNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        String message = ex.getDocumentId() != null 
            ? messageService.getMessage("error.document.notfound", ex.getDocumentId())
            : ex.getMessage();
        body.put("error", message);
        body.put("status", HttpStatus.NOT_FOUND.value());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

### Step 2.8: Handle Language Header in Frontend

**Update `document.service.ts`** to send Accept-Language header:

```typescript
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:8080/api/documents';

  constructor(
    private http: HttpClient,
    private translationService: TranslationService
  ) {}

  private getHeaders(): HttpHeaders {
    const lang = this.translationService.getCurrentLanguage();
    return new HttpHeaders({
      'Accept-Language': lang === 'it' ? 'it' : 'en'
    });
  }

  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Update all other methods similarly...
}
```

---

## Part 3: Language Selection & Persistence

### Step 3.1: Frontend Language Persistence

The `TranslationService` already handles localStorage persistence. Ensure:
- Language preference is saved on change
- Language is loaded on app initialization
- Default to English if no preference exists

### Step 3.2: Backend Language Detection

The backend uses `AcceptHeaderLocaleResolver` which reads the `Accept-Language` header:
- Frontend sends language preference in HTTP headers
- Backend automatically resolves locale from header
- Falls back to English if header not present or unsupported language

### Step 3.3: Add Language Switcher to UI

1. Add language switcher component to the main navigation bar
2. Position it prominently (top-right corner recommended)
3. Style it consistently with the app design

---

## Part 4: Adding New Languages (General Process)

### Step 4.1: Frontend - Adding a New Language

1. **Add language code** to `SupportedLanguage` type in `translation.service.ts`
2. **Create translation file**: `src/assets/i18n/{lang}.json`
3. **Add language option** to `getSupportedLanguages()` method
4. **Translate all keys** from `en.json` to the new language file
5. **Test** the new language thoroughly

### Step 4.2: Backend - Adding a New Language

1. **Create message file**: `src/main/resources/messages/messages_{lang}.properties`
2. **Add locale** to `LocaleConfig.java` supported locales list
3. **Translate all message keys** from `messages_en.properties`
4. **Test** error messages in the new language

### Step 4.3: Testing New Language

1. Switch to new language in UI
2. Verify all frontend strings are translated
3. Trigger backend errors and verify messages are translated
4. Check date/time formatting (if applicable)
5. Test file size formatting (if applicable)

---

## Part 5: Implementation Checklist

### Frontend
- [ ] Install @angular/localize (if needed)
- [ ] Create i18n directory structure
- [ ] Create en.json and it.json translation files
- [ ] Create TranslationService
- [ ] Create TranslatePipe
- [ ] Create LanguageSwitcherComponent
- [ ] Update all components to use translate pipe
- [ ] Add language switcher to navigation
- [ ] Update app.config.ts for HttpClient
- [ ] Test language switching
- [ ] Test persistence across page reloads

### Backend
- [ ] Configure MessageSource in application.properties
- [ ] Create messages directory structure
- [ ] Create messages.properties, messages_en.properties, messages_it.properties
- [ ] Create LocaleConfig
- [ ] Create MessageService
- [ ] Update DocumentController to use MessageService
- [ ] Update FilesystemStorageService to use MessageService
- [ ] Create GlobalExceptionHandler (optional)
- [ ] Update frontend service to send Accept-Language header
- [ ] Test error messages in both languages

### Integration
- [ ] Verify language preference persists
- [ ] Test language switching updates both frontend and backend
- [ ] Verify error messages match selected language
- [ ] Test with browser language detection (optional)

---

## Part 6: Best Practices

1. **Key Naming**: Use hierarchical keys (e.g., `documents.upload.button`) for organization
2. **Parameterization**: Use `{{param}}` syntax for dynamic values
3. **Fallback**: Always provide fallback to English if translation missing
4. **Testing**: Test with missing translations to ensure graceful degradation
5. **Consistency**: Keep translation keys consistent across frontend and backend
6. **Review**: Have native speakers review translations
7. **Pluralization**: Consider pluralization rules for different languages (future enhancement)

---

## Part 7: Future Enhancements

1. **Pluralization Support**: Add proper pluralization rules
2. **Date/Time Localization**: Format dates according to locale
3. **Number Formatting**: Format numbers according to locale
4. **RTL Support**: Add right-to-left language support if needed
5. **Translation Management**: Consider using translation management tools
6. **Browser Language Detection**: Auto-detect browser language on first visit
7. **Language-Specific Validation**: Localize validation error messages

---

## Notes

- The frontend uses a runtime translation approach (loading JSON files) rather than Angular's compile-time i18n for flexibility
- Backend uses Spring's MessageSource for server-side localization
- Language preference is stored in browser localStorage
- Backend language is determined by Accept-Language HTTP header
- Both systems default to English if language not supported

