import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from 'src/app/core/services/auth.service';
import { UrlService } from 'src/app/core/services/url.service';
import { ShortenedUrl } from 'src/app/shared/models/url.model';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, HeaderComponent],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100">
      <app-header />

      <main class="mx-auto max-w-2xl px-4 pb-24 pt-16 text-center">
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
          Links longos? Resolve em um clique.
        </h1>
        <p class="mx-auto mt-4 max-w-md text-slate-400">Cola, encurta, compartilha.</p>

        <div class="mx-auto mt-10 max-w-xl rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <form class="space-y-3" [formGroup]="form" (ngSubmit)="submit()">
            <div class="flex flex-col gap-3 sm:flex-row">
              <div
                class="flex flex-1 items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3"
              >
                <svg
                  class="h-4 w-4 shrink-0 text-slate-500"
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
                <input
                  class="w-full bg-transparent py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  type="text"
                  placeholder="https://sua-url-longa.com/pagina..."
                  formControlName="originalUrl"
                />
              </div>
              <input
                class="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none sm:w-40"
                type="text"
                placeholder="alias (opcional)"
                formControlName="alias"
              />
            </div>

            <button
              class="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
              type="submit"
              [disabled]="form.invalid || loading()"
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
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" />
              </svg>
              {{ loading() ? 'Encurtando...' : 'Encurtar' }}
            </button>

            @if (error()) {
              <p class="text-sm text-red-400">{{ error() }}</p>
            }
          </form>
        </div>

        @if (shortUrl(); as url) {
          <div
            class="mx-auto mt-4 flex max-w-xl items-center justify-between gap-4 rounded-2xl bg-indigo-50 px-4 py-3"
          >
            <span class="flex min-w-0 items-center gap-2 text-indigo-700">
              <svg
                class="h-4 w-4 shrink-0"
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
              <span class="truncate font-mono text-sm">{{ url }}</span>
            </span>
            <button
              class="shrink-0 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
              type="button"
              (click)="copy(url)"
            >
              {{ copied() ? 'Copiado!' : 'Copiar' }}
            </button>
          </div>
        }

        @if (!auth.isAuthenticated()) {
          <p class="mt-4 text-sm text-slate-500">📊 Crie uma conta para acompanhar seus cliques</p>
        }

        <div class="mt-14 grid gap-4 sm:grid-cols-3">
          @for (feature of features; track feature.title) {
            <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-center">
              <div class="text-2xl">{{ feature.icon }}</div>
              <h3 class="mt-2 font-semibold text-slate-100">{{ feature.title }}</h3>
              <p class="mt-1 text-sm text-slate-400">{{ feature.description }}</p>
            </div>
          }
        </div>
      </main>
    </div>
  `,
})
export class HomeComponent {
  private readonly fb = inject(FormBuilder);
  private readonly urlService = inject(UrlService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly auth = inject(AuthService);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly copied = signal(false);
  private readonly created = signal<ShortenedUrl | null>(null);

  protected readonly shortUrl = computed(() => {
    const url = this.created();
    return url ? `${environment.shortBaseUrl}/${url.shortCode}` : null;
  });

  protected readonly features: Feature[] = [
    { icon: '⚡', title: 'Rápido', description: 'Redirect em milissegundos' },
    { icon: '🔀', title: 'Analytics', description: 'Cliques, dispositivos, países em tempo real' },
    { icon: '🔓', title: 'Sem cadastro', description: 'Encurte agora, crie conta quando quiser' },
  ];

  protected readonly form = this.fb.nonNullable.group({
    originalUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    alias: [''],
  });

  constructor() {
    const originalUrl = this.route.snapshot.queryParamMap.get('originalUrl');
    const alias = this.route.snapshot.queryParamMap.get('alias');

    if (originalUrl) {
      this.form.controls.originalUrl.setValue(originalUrl);
    }

    if (alias) {
      this.form.controls.alias.setValue(alias);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const { originalUrl, alias } = this.form.getRawValue();

    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { redirect: '/', originalUrl, alias },
      });
      return;
    }


    this.loading.set(true);
    this.error.set(null);
    this.copied.set(false);

    this.urlService.create({ originalUrl, alias: alias || null }).subscribe({
      next: (url) => {
        this.created.set(url);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.detail ?? 'Não foi possível encurtar a URL.');
        this.loading.set(false);
      },
    });
  }

  copy(url: string): void {
    navigator.clipboard?.writeText(url).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
