import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'imageUrl', standalone: true })
export class ImageUrlPipe implements PipeTransform {
  private baseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://impacto-visible-production.up.railway.app';

  transform(url: string | undefined | null): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return this.baseUrl + url;
  }
}