import { Component, computed, input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { ClicksPerDay } from 'src/app/shared/models/analytics.model';

@Component({
  selector: 'app-click-chart',
  imports: [BaseChartDirective],
  template: `
    <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-sm font-semibold text-slate-200">Cliques por dia</h2>
        <span class="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-400">
          {{ total() }} no período
        </span>
      </div>

      @if (clicksPerDay().length === 0) {
        <p class="py-12 text-center text-sm text-slate-500">Sem cliques no período.</p>
      } @else {
        <div class="h-64">
          <canvas baseChart type="line" [data]="data()" [options]="options"></canvas>
        </div>
      }
    </div>
  `,
})
export class ClickChartComponent {
  readonly clicksPerDay = input.required<ClicksPerDay[]>();

  protected readonly total = computed(() =>
    this.clicksPerDay().reduce((sum, c) => sum + c.count, 0),
  );

  protected readonly data = computed<ChartConfiguration<'line'>['data']>(() => ({
    labels: this.clicksPerDay().map((c) =>
      new Date(c.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
    ),
    datasets: [
      {
        label: 'Cliques',
        data: this.clicksPerDay().map((c) => c.count),
        borderColor: '#818cf8',
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#818cf8',
        pointBorderColor: '#0f172a',
        pointBorderWidth: 2,
        pointHoverRadius: 5,
      },
    ],
  }));

  protected readonly options: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e1',
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#64748b', font: { size: 11 }, maxRotation: 0, autoSkipPadding: 16 },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(148, 163, 184, 0.08)' },
        border: { display: false },
        ticks: { color: '#64748b', font: { size: 11 }, precision: 0 },
      },
    },
  };
}
