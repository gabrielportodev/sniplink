import { Component, computed, input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { MetricCount } from 'src/app/shared/models/analytics.model';

@Component({
  selector: 'app-device-chart',
  imports: [BaseChartDirective],
  template: `
    <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 class="mb-4 text-sm font-semibold text-slate-200">{{ title() }}</h2>

      @if (metrics().length === 0) {
        <p class="py-12 text-center text-sm text-slate-500">Sem dados.</p>
      } @else {
        <div class="h-48">
          <canvas baseChart type="doughnut" [data]="data()" [options]="options"></canvas>
        </div>
      }
    </div>
  `,
})
export class DeviceChartComponent {
  readonly title = input('Dispositivos');
  readonly metrics = input.required<MetricCount[]>();

  private readonly palette = ['#818cf8', '#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#a78bfa'];

  protected readonly data = computed<ChartConfiguration<'doughnut'>['data']>(() => ({
    labels: this.metrics().map((m) => m.label),
    datasets: [
      {
        data: this.metrics().map((m) => m.count),
        backgroundColor: this.metrics().map((_, i) => this.palette[i % this.palette.length]),
        borderColor: '#0f172a',
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  }));

  protected readonly options: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 14,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e1',
        padding: 10,
      },
    },
  };
}
