import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="flex items-center justify-center gap-3 py-8 text-slate-500">
      <span
        class="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600"
        aria-hidden="true"
      ></span>
      <span>{{ label() }}</span>
    </div>
  `,
})
export class LoadingComponent {
  readonly label = input('Carregando...');
}
