import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  template: `
    <a routerLink="/" class="flex items-center gap-2 font-semibold text-slate-100">
      <svg
        [attr.class]="'shrink-0 text-indigo-400 ' + size()"
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
      <span [class.text-lg]="large()">sniplink</span>
    </a>
  `,
})
export class LogoComponent {
  readonly size = input('h-5 w-5');
  readonly large = input(false);
}
