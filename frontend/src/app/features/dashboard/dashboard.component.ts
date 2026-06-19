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

      <main class="mx-auto max-w-3xl space-y-6 p-6">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-semibold text-slate-100">Seus links</h1>
          <a
            routerLink="/"
            class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
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
