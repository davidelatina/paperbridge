import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document';
import { DirectoryTreeComponent } from '../directory-tree/directory-tree.component';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DirectoryTreeComponent, TranslatePipe],
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
      // Show all documents
      return this.allDocuments();
    }
    if (path === 'ROOT') {
      // Show only root-level documents (no '/' in filePath)
      return this.allDocuments().filter(doc => !doc.filePath.includes('/'));
    }
    // Show documents in the selected folder and its subfolders
    return this.allDocuments().filter(doc => doc.filePath.startsWith(path + '/'));
  });
  
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  uploading = signal<boolean>(false);
  uploadError = signal<string | null>(null);
  selectedFile: File | null = null;
  showUploadForm = signal<boolean>(false);
  folders = signal<string[]>([]);
  selectedFolder = '';
  newFolderName = '';
  folderMode: 'select' | 'create' = 'select';

  constructor(
    private readonly documentService: DocumentService,
    private readonly translationService: TranslationService,
    private readonly router: Router
  ) {
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
    this.loadFolders();
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
        this.loadFolders(); // Reload folders after documents change
      },
      error: (err) => {
        this.error.set(err.message || this.translationService.translate('documents.error.loadFailed'));
        this.loading.set(false);
        console.error('Error loading documents:', err);
      }
    });
  }

  loadFolders(): void {
    this.documentService.getFolders().subscribe({
      next: (folderList) => {
        this.folders.set(folderList);
      },
      error: (err) => {
        console.error('Error loading folders:', err);
        // Don't show error for folders, just use empty list
        this.folders.set([]);
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return this.translationService.translate('common.date.na');
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 ' + this.translationService.translate('common.fileSize.bytes');
    const k = 1024;
    const sizes = [
      this.translationService.translate('common.fileSize.bytes'),
      this.translationService.translate('common.fileSize.kb'),
      this.translationService.translate('common.fileSize.mb'),
      this.translationService.translate('common.fileSize.gb')
    ];
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
      this.selectedFolder = '';
      this.newFolderName = '';
      this.folderMode = 'select';
    }
  }

  toggleFolderMode(): void {
    this.folderMode = this.folderMode === 'select' ? 'create' : 'select';
    this.selectedFolder = '';
    this.newFolderName = '';
  }

  uploadDocument(): void {
    if (!this.selectedFile) {
      this.uploadError.set(this.translationService.translate('documents.upload.selectFileError'));
      return;
    }

    // Determine subfolder path
    let subfolder: string | undefined = undefined;
    if (this.folderMode === 'select' && this.selectedFolder.trim()) {
      subfolder = this.selectedFolder.trim();
    } else if (this.folderMode === 'create' && this.newFolderName.trim()) {
      // Validate folder name
      const folderName = this.newFolderName.trim();
      if (!/^[a-zA-Z0-9_\-\s]+$/.test(folderName)) {
        this.uploadError.set(this.translationService.translate('documents.upload.folderNameError'));
        return;
      }
      // If a folder is selected, append to it; otherwise use as root folder
      if (this.selectedFolder.trim()) {
        subfolder = `${this.selectedFolder.trim()}/${folderName}`;
      } else {
        subfolder = folderName;
      }
    }

    this.uploading.set(true);
    this.uploadError.set(null);

    this.documentService.uploadDocument(this.selectedFile, subfolder).subscribe({
      next: () => {
        this.uploading.set(false);
        this.selectedFile = null;
        this.selectedFolder = '';
        this.newFolderName = '';
        this.showUploadForm.set(false);
        this.loadDocuments(); // Reload the document list and folders
      },
      error: (err) => {
        this.uploading.set(false);
        this.uploadError.set(err.message || this.translationService.translate('documents.error.uploadFailed'));
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

  onDocumentDoubleClick(document: Document): void {
    // Check if it's a PDF file (by extension)
    const fileName = document.filePath.toLowerCase();
    if (fileName.endsWith('.pdf')) {
      this.router.navigate(['/viewer', document.id]);
    }
  }
}
