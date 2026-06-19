import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from 'src/app/core/services/auth.service';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LogoComponent],
  template: `
    <header class="flex items-center justify-between border-b border-slate-800 px-6 py-4">
      <app-logo />

      @if (auth.isAuthenticated()) {
        <nav class="flex items-center gap-4 text-sm">
          <a
            routerLink="/"
            routerLinkActive="text-indigo-400"
            [routerLinkActiveOptions]="{ exact: true }"
            class="text-slate-300 hover:text-white"
          >
            Encurtar
          </a>
          <a
            routerLink="/dashboard"
            routerLinkActive="text-indigo-400"
            class="text-slate-300 hover:text-white"
          >
            Dashboard
          </a>
          <button type="button" class="text-slate-400 hover:text-white" (click)="logout()">
            Sair
          </button>
        </nav>
      } @else {
        <nav class="flex items-center gap-2 text-sm">
          <a
            routerLink="/login"
            class="rounded-md border border-slate-700 px-3 py-1.5 text-slate-200 hover:bg-slate-800"
          >
            Entrar
          </a>
          <a
            routerLink="/register"
            class="rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-500"
          >
            Criar conta
          </a>
        </nav>
      }
    </header>
  `,
})
export class HeaderComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
