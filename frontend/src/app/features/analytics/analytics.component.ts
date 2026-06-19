import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { UrlAnalytics } from 'src/app/shared/models/analytics.model';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { ClickChartComponent } from 'src/app/features/analytics/click-chart/click-chart.component';
import { DeviceChartComponent } from 'src/app/features/analytics/device-chart/device-chart.component';

@Component({
  selector: 'app-analytics',
  imports: [HeaderComponent, LoadingComponent, ClickChartComponent, DeviceChartComponent],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100">
      <app-header />

      <main class="mx-auto max-w-4xl space-y-6 p-6">
        @if (loading()) {
          <app-loading label="Carregando métricas..." />
        } @else if (analytics(); as data) {
          <header class="space-y-1">
            <h1 class="text-2xl font-semibold text-slate-100">/{{ data.shortCode }}</h1>
            <p class="text-slate-400">{{ data.totalClicks }} cliques no total</p>
          </header>

          <app-click-chart [clicksPerDay]="data.clicksPerDay" />

          <div class="grid gap-6 md:grid-cols-3">
            <app-device-chart title="Dispositivos" [metrics]="data.devices" />
            <app-device-chart title="Navegadores" [metrics]="data.browsers" />
            <app-device-chart title="Países" [metrics]="data.countries" />
          </div>
        } @else {
          <p class="text-slate-400">Nenhuma métrica disponível.</p>
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
}
