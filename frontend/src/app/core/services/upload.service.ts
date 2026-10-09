import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private baseUrl = window.location.hostname === 'localhost'
    ? '/api/uploads'
    : 'https://impacto-visible-production.up.railway.app/api/uploads';

  constructor(private http: HttpClient) {}

  uploadSingle(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ url: string }>(`${this.baseUrl}/single`, formData);
  }

  uploadMultiple(files: File[]): Observable<{ urls: string[] }> {
    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));
    return this.http.post<{ urls: string[] }>(`${this.baseUrl}/multiple`, formData);
  }
}