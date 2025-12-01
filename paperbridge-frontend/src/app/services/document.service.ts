import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from '../models/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:8080/api/documents';

  constructor(private http: HttpClient) { }

  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrl);
  }

  getDocumentById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`);
  }

  searchByTag(tag: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/search`, {
      params: { tag }
    });
  }

  getFolders(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/folders`);
  }

  uploadDocument(file: File, subfolder?: string): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    if (subfolder && subfolder.trim()) {
      formData.append('subfolder', subfolder.trim());
    }
    return this.http.post<Document>(this.apiUrl, formData);
  }

  /**
   * Returns the URL to access the file content for a document.
   * @param id The document ID
   * @returns The URL string
   */
  getDocumentFileUrl(id: number): string {
    return `${this.apiUrl}/${id}/file`;
  }
}
