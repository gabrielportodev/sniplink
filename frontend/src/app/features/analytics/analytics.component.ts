import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { UrlAnalytics, MetricCount } from 'src/app/shared/models/analytics.model';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { ClickChartComponent } from 'src/app/features/analytics/click-chart/click-chart.component';
import { DeviceChartComponent } from 'src/app/features/analytics/device-chart/device-chart.component';

@Component({
  selector: 'app-analytics',
  imports: [
    RouterLink,
    HeaderComponent,
    LoadingComponent,
    ClickChartComponent,
    DeviceChartComponent,
  ],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100">
      <app-header />

      <main class="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:p-6">
        @if (loading()) {
          <app-loading label="Carregando métricas..." />
        } @else if (analytics(); as data) {
          <div class="space-y-4">
            <a
              routerLink="/dashboard"
              class="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-slate-200"
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
                <path d="m15 18-6-6 6-6" />
              </svg>
              Voltar
            </a>

            <header class="flex items-center gap-3">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400"
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
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl font-bold tracking-tight text-slate-100">
                  /{{ data.shortCode }}
                </h1>
                <p class="text-sm text-slate-400">Métricas dos últimos 30 dias</p>
              </div>
            </header>
          </div>

          <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Cliques</p>
              <p class="mt-1 text-2xl font-bold text-slate-100">{{ data.totalClicks }}</p>
            </div>
            <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Países</p>
              <p class="mt-1 text-2xl font-bold text-slate-100">{{ data.countries.length }}</p>
            </div>
            <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Navegador</p>
              <p class="mt-1 truncate text-2xl font-bold text-slate-100">{{ topBrowser() }}</p>
            </div>
            <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Dispositivo</p>
              <p class="mt-1 truncate text-2xl font-bold text-slate-100">{{ topDevice() }}</p>
            </div>
          </div>

          <app-click-chart [clicksPerDay]="data.clicksPerDay" />

          <div class="grid gap-4 md:grid-cols-3">
            <app-device-chart title="Dispositivos" [metrics]="data.devices" />
            <app-device-chart title="Navegadores" [metrics]="data.browsers" />
            <app-device-chart title="Países" [metrics]="data.countries" />
          </div>
        } @else {
          <div
            class="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 px-6 py-16 text-center"
          >
            <p class="text-slate-300">Nenhuma métrica disponível ainda.</p>
            <p class="text-sm text-slate-500">
              Compartilhe seu link para começar a coletar cliques.
            </p>
          </div>
        }
      </main>
    </div>
  `,
})
export class AnalyticsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly analyticsService = inject(AnalyticsService);

  protected readonly analytics = signal<UrlAnalytics | null>(null);
  protected readonly loading = signal(true);

  protected readonly topBrowser = computed(() => this.top(this.analytics()?.browsers));
  protected readonly topDevice = computed(() => this.top(this.analytics()?.devices));

  constructor() {
    const shortCode = this.route.snapshot.paramMap.get('shortCode');

    if (!shortCode) {
      this.loading.set(false);
      return;
    }

    this.analyticsService.getByShortCode(shortCode).subscribe({
      next: (data) => {
        this.analytics.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private top(metrics: MetricCount[] | undefined): string {
    if (!metrics || metrics.length === 0) {
      return '—';
    }
    return metrics.reduce((max, m) => (m.count > max.count ? m : max)).label;
  }
}
