import { Routes } from '@angular/router';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';

export const routes: Routes = [
  { path: '', redirectTo: '/documents', pathMatch: 'full' },
  { path: 'documents', component: DocumentListComponent },
  { path: 'viewer/:id', component: PdfViewerComponent }
];
