import { Component, computed, input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { MetricCount } from 'src/app/shared/models/analytics.model';

@Component({
  selector: 'app-device-chart',
  imports: [BaseChartDirective],
  template: `
    <div class="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 class="mb-4 text-sm font-medium text-slate-300">{{ title() }}</h2>
      <canvas baseChart type="doughnut" [data]="data()" [options]="options"></canvas>
    </div>
  `,
})
export class DeviceChartComponent {
  readonly title = input('Dispositivos');
  readonly metrics = input.required<MetricCount[]>();

  protected readonly data = computed<ChartConfiguration<'doughnut'>['data']>(() => ({
    labels: this.metrics().map((m) => m.label),
    datasets: [
      {
        data: this.metrics().map((m) => m.count),
        backgroundColor: ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'],
      },
    ],
  }));

  protected readonly options: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };
}
