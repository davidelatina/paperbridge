import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent implements OnInit {
  documents = signal<Document[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading.set(true);
    this.error.set(null);

    this.documentService.getAllDocuments().subscribe({
      next: (docs) => {
        this.documents.set(docs);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load documents');
        this.loading.set(false);
        console.error('Error loading documents:', err);
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
