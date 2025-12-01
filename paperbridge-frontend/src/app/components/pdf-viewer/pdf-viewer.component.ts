import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, NgxExtendedPdfViewerModule, TranslatePipe],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.css'
})
export class PdfViewerComponent implements OnInit {
  document = signal<Document | null>(null);
  pdfUrl = signal<string | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    const documentId = this.route.snapshot.paramMap.get('id');
    if (documentId) {
      this.loadDocument(parseInt(documentId, 10));
    } else {
      this.error.set('No document ID provided');
      this.loading.set(false);
    }
  }

  loadDocument(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.documentService.getDocumentById(id).subscribe({
      next: (doc) => {
        this.document.set(doc);
        // Construct the PDF URL
        this.pdfUrl.set(this.documentService.getDocumentFileUrl(id));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load document');
        this.loading.set(false);
        console.error('Error loading document:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/documents']);
  }
}

