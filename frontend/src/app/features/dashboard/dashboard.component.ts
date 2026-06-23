import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UrlService } from 'src/app/core/services/url.service';
import { ShortenedUrl } from 'src/app/shared/models/url.model';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { UrlListComponent } from 'src/app/features/dashboard/url-list/url-list.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, HeaderComponent, LoadingComponent, UrlListComponent],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100">
      <app-header />

      <main class="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:p-6">
        <div class="flex items-end justify-between gap-4">
          <div class="space-y-1">
            <h1 class="text-2xl font-bold tracking-tight text-slate-100">Seus links</h1>
            @if (!loading()) {
              <p class="text-sm text-slate-400">
                {{ urls().length }}
                {{ urls().length === 1 ? 'link encurtado' : 'links encurtados' }}
              </p>
            }
          </div>
          <a
            routerLink="/"
            class="inline-flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
          >
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Novo link
          </a>
        </div>

        @if (loading()) {
          <app-loading label="Carregando seus links..." />
        } @else {
          <app-url-list [urls]="urls()" />
        }
      </main>
    </div>
  `,
})
export class DashboardComponent {
  private readonly urlService = inject(UrlService);

  protected readonly urls = signal<ShortenedUrl[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.urlService.list().subscribe({
      next: (urls) => {
        this.urls.set(urls);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
