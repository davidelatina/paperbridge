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

  uploadDocument(file: File): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Document>(this.apiUrl, formData);
  }
}
