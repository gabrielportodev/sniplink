import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer
      class="border-t border-slate-800 bg-slate-950 px-4 py-6 text-center text-sm text-slate-500"
    >
      Desenvolvido por
      <a
        href="https://gabrielporto.me"
        target="_blank"
        rel="noopener noreferrer"
        class="text-slate-300 transition hover:text-white"
      >
        Gabriel Porto
      </a>
    </footer>
  `,
})
export class FooterComponent {}
