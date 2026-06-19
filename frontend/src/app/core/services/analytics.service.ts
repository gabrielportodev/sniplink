import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { UrlAnalytics } from 'src/app/shared/models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly analyticsApi = environment.analyticsApiUrl;

  getByShortCode(shortCode: string): Observable<UrlAnalytics> {
    return this.http.get<UrlAnalytics>(`${this.analyticsApi}/analytics/${shortCode}`);
  }
}
