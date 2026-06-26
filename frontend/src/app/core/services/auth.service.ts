import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, finalize, map, of, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from 'src/app/shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authUrl = `${environment.apiUrl}/auth`;

  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  loginWith(provider: 'google' | 'github', redirect = '/dashboard'): void {
    const base = environment.authBaseUrl || window.location.origin;
    const url = new URL(`/oauth2/authorization/${provider}`, base);
    url.searchParams.set('redirect', redirect);
    window.location.href = url.toString();
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.authUrl}/logout`, {})
      .pipe(finalize(() => this._user.set(null)));
  }

  loadSession(): Observable<void> {
    return this.http.get<User>(`${this.authUrl}/me`).pipe(
      tap((user) => this._user.set(user)),
      map(() => void 0),
      catchError(() => {
        this._user.set(null);
        return of(void 0);
      }),
    );
  }
}
