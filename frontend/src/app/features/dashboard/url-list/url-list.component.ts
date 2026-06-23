import { Component, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ShortenedUrl } from 'src/app/shared/models/url.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-url-list',
  imports: [RouterLink, DatePipe],
  template: `
    @if (urls().length === 0) {
      <div
        class="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 px-6 py-14 text-center"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400"
        >
          <svg
            class="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>
        <p class="text-slate-300">Você ainda não criou nenhum link.</p>
        <a
          routerLink="/"
          class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          Encurtar uma URL
        </a>
      </div>
    } @else {
      <ul class="space-y-3">
        @for (url of urls(); track url.id) {
          <li
            class="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-slate-700 hover:bg-slate-900/70"
          >
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400"
            >
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <p class="truncate font-semibold text-indigo-400">/{{ url.shortCode }}</p>
                <button
                  type="button"
                  class="shrink-0 text-slate-500 transition hover:text-slate-200"
                  (click)="copy(url)"
                  [attr.aria-label]="'Copiar link de ' + url.shortCode"
                >
                  @if (copiedId() === url.id) {
                    <svg
                      class="h-4 w-4 text-emerald-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  } @else {
                    <svg
                      class="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  }
                </button>
              </div>
              <p class="truncate text-sm text-slate-400">{{ url.originalUrl }}</p>
              <p class="mt-0.5 text-xs text-slate-600">
                criado em {{ url.createdAt | date: 'dd/MM/yyyy' }}
              </p>
            </div>

            <a
              [routerLink]="['/analytics', url.shortCode]"
              class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:border-indigo-500 hover:text-white"
            >
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
              Analytics
            </a>
          </li>
        }
      </ul>
    }
  `,
})
export class UrlListComponent {
  readonly urls = input.required<ShortenedUrl[]>();

  protected readonly copiedId = signal<string | null>(null);

  copy(url: ShortenedUrl): void {
    const fullUrl = `${environment.shortBaseUrl}/${url.shortCode}`;
    navigator.clipboard?.writeText(fullUrl).then(() => {
      this.copiedId.set(url.id);
      setTimeout(() => this.copiedId.set(null), 2000);
    });
  }
}
