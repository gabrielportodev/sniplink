import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { CreateUrlRequest, ShortenedUrl } from 'src/app/shared/models/url.model';

@Injectable({ providedIn: 'root' })
export class UrlService {
  private readonly http = inject(HttpClient);
  private readonly urlApi = `${environment.apiUrl}/url`;

  list(): Observable<ShortenedUrl[]> {
    return this.http.get<ShortenedUrl[]>(this.urlApi);
  }

  create(request: CreateUrlRequest): Observable<ShortenedUrl> {
    return this.http.post<ShortenedUrl>(this.urlApi, request);
  }
}
