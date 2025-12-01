import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Document } from '../../models/document';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

export interface TreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  children: TreeNode[];
  document?: Document;
  expanded?: boolean;
}

@Component({
  selector: 'app-directory-tree',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './directory-tree.component.html',
  styleUrl: './directory-tree.component.css'
})
export class DirectoryTreeComponent {
  @Input() documents: Document[] = [];
  @Output() pathSelected = new EventEmitter<string | null>();

  selectedPath = signal<string | null>(null);
  
  constructor(
    private translationService: TranslationService,
    private router: Router
  ) {}
  
  tree = computed(() => this.buildTree(this.documents));

  buildTree(documents: Document[]): TreeNode {
    const root: TreeNode = {
      name: this.translationService.translate('documents.title'),
      path: '',
      isFolder: true,
      children: [],
      expanded: true
    };

    documents.forEach(doc => {
      const parts = doc.filePath.split('/').filter(p => p.length > 0);
      this.addToTree(root, parts, doc, '');
    });

    // Sort children: folders first, then files
    this.sortTree(root);

    return root;
  }

  private addToTree(parent: TreeNode, parts: string[], document: Document, currentPath: string): void {
    if (parts.length === 0) return;

    const name = parts[0];
    const newPath = currentPath ? `${currentPath}/${name}` : name;
    const isLast = parts.length === 1;

    let node = parent.children.find(child => child.name === name);

    if (!node) {
      node = {
        name,
        path: newPath,
        isFolder: !isLast,
        children: [],
        expanded: false
      };
      parent.children.push(node);
    }

    if (isLast) {
      node.document = document;
    } else {
      this.addToTree(node, parts.slice(1), document, newPath);
    }
  }

  private sortTree(node: TreeNode): void {
    node.children.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return a.name.localeCompare(b.name);
    });
    
    node.children.forEach(child => {
      if (child.isFolder) {
        this.sortTree(child);
      }
    });
  }

  countDocuments(node: TreeNode): number {
    if (!node.isFolder) {
      return node.document ? 1 : 0;
    }
    
    let count = 0;
    const traverse = (n: TreeNode) => {
      if (n.isFolder) {
        n.children.forEach(child => traverse(child));
      } else if (n.document) {
        count++;
      }
    };
    
    traverse(node);
    return count;
  }

  toggleExpansion(node: TreeNode, event: Event): void {
    event.stopPropagation();
    if (node.isFolder) {
      node.expanded = !node.expanded;
    }
  }

  selectFolder(node: TreeNode): void {
    if (node.isFolder) {
      // Expand folder when selected
      node.expanded = true;
      this.selectPath(node.path);
    }
  }

  selectPath(path: string | null): void {
    this.selectedPath.set(path);
    this.pathSelected.emit(path);
  }

  onFileDoubleClick(node: TreeNode, event: Event): void {
    event.stopPropagation();
    if (!node.isFolder && node.document) {
      // Check if it's a PDF file (by extension)
      const fileName = node.document.filePath.toLowerCase();
      if (fileName.endsWith('.pdf')) {
        this.router.navigate(['/viewer', node.document.id]);
      }
    }
  }
}

