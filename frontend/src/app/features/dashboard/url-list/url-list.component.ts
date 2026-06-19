import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShortenedUrl } from 'src/app/shared/models/url.model';

@Component({
  selector: 'app-url-list',
  imports: [RouterLink],
  template: `
    @if (urls().length === 0) {
      <p class="rounded-md border border-dashed border-slate-700 p-6 text-center text-slate-400">
        Você ainda não criou nenhum link.
      </p>
    } @else {
      <ul class="divide-y divide-slate-800 rounded-md border border-slate-800">
        @for (url of urls(); track url.id) {
          <li class="flex items-center justify-between gap-4 p-4">
            <div class="min-w-0">
              <p class="font-medium text-indigo-400">/{{ url.shortCode }}</p>
              <p class="truncate text-sm text-slate-400">{{ url.originalUrl }}</p>
            </div>
            <a
              [routerLink]="['/analytics', url.shortCode]"
              class="shrink-0 text-sm text-slate-400 hover:text-white"
            >
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
}
