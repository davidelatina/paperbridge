import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document';
import { DirectoryTreeComponent } from '../directory-tree/directory-tree.component';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DirectoryTreeComponent],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent implements OnInit {
  allDocuments = signal<Document[]>([]);
  selectedPath = signal<string | null>(null);
  sidebarWidth = signal<number>(250);
  isResizing = signal<boolean>(false);
  
  documents = computed(() => {
    const path = this.selectedPath();
    if (!path) {
      return this.allDocuments();
    }
    return this.allDocuments().filter(doc => doc.filePath === path || doc.filePath.startsWith(path + '/'));
  });
  
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  uploading = signal<boolean>(false);
  uploadError = signal<string | null>(null);
  selectedFile: File | null = null;
  showUploadForm = signal<boolean>(false);

  constructor(private documentService: DocumentService) {
    effect(() => {
      // Ensure sidebar width is within reasonable bounds
      const width = this.sidebarWidth();
      if (width < 150) {
        this.sidebarWidth.set(150);
      } else if (width > 600) {
        this.sidebarWidth.set(600);
      }
    });
  }

  ngOnInit(): void {
    this.loadDocuments();
    // Add global event listeners for resizing
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mouseup', () => this.onMouseUp());
  }

  loadDocuments(): void {
    this.loading.set(true);
    this.error.set(null);

    this.documentService.getAllDocuments().subscribe({
      next: (docs) => {
        this.allDocuments.set(docs);
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

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadError.set(null);
    }
  }

  toggleUploadForm(): void {
    this.showUploadForm.set(!this.showUploadForm());
    if (!this.showUploadForm()) {
      this.selectedFile = null;
      this.uploadError.set(null);
    }
  }

  uploadDocument(): void {
    if (!this.selectedFile) {
      this.uploadError.set('Please select a file');
      return;
    }

    this.uploading.set(true);
    this.uploadError.set(null);

    this.documentService.uploadDocument(this.selectedFile).subscribe({
      next: () => {
        this.uploading.set(false);
        this.selectedFile = null;
        this.showUploadForm.set(false);
        this.loadDocuments(); // Reload the document list
      },
      error: (err) => {
        this.uploading.set(false);
        this.uploadError.set(err.message || 'Failed to upload document');
        console.error('Error uploading document:', err);
      }
    });
  }

  onPathSelected(path: string | null): void {
    this.selectedPath.set(path);
  }

  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.isResizing.set(true);
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isResizing()) {
      const newWidth = event.clientX;
      if (newWidth >= 150 && newWidth <= 600) {
        this.sidebarWidth.set(newWidth);
      }
    }
  }

  onMouseUp(): void {
    this.isResizing.set(false);
  }
}
