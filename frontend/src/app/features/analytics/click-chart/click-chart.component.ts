import { Component, computed, input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { ClicksPerDay } from 'src/app/shared/models/analytics.model';

@Component({
  selector: 'app-click-chart',
  imports: [BaseChartDirective],
  template: `
    <div class="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 class="mb-4 text-sm font-medium text-slate-300">Cliques por dia</h2>
      <canvas baseChart type="line" [data]="data()" [options]="options"></canvas>
    </div>
  `,
})
export class ClickChartComponent {
  readonly clicksPerDay = input.required<ClicksPerDay[]>();

  protected readonly data = computed<ChartConfiguration<'line'>['data']>(() => ({
    labels: this.clicksPerDay().map((c) => c.date),
    datasets: [
      {
        label: 'Cliques',
        data: this.clicksPerDay().map((c) => c.count),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  }));

  protected readonly options: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
  };
}
