import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from 'src/app/core/services/auth.service';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LogoComponent],
  template: `
    <header class="relative z-50 border-b border-slate-800">
      <div class="relative z-50 flex items-center justify-between bg-slate-950 px-4 py-4 sm:px-6">
        <app-logo />

        @if (auth.isAuthenticated()) {
          <nav class="hidden items-center gap-4 text-sm md:flex">
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

            <span class="flex items-center gap-2 border-l border-slate-800 pl-4">
              <span
                class="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold uppercase text-white"
              >
                {{ initial() }}
              </span>
              <span class="max-w-40 truncate font-medium text-slate-200">
                {{ auth.user()?.username }}
              </span>
            </span>

            <button type="button" class="text-slate-400 hover:text-white" (click)="logout()">
              Sair
            </button>
          </nav>

          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 hover:text-white md:hidden"
            [attr.aria-expanded]="menuOpen()"
            aria-label="Abrir menu"
            (click)="toggleMenu()"
          >
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              @if (menuOpen()) {
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6 6 18" />
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              }
            </svg>
          </button>
        } @else {
          <a
            routerLink="/login"
            class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Entrar
          </a>
        }
      </div>

      @if (auth.isAuthenticated() && menuOpen()) {
        <div
          class="fixed inset-0 z-40 bg-black/60 md:hidden"
          aria-hidden="true"
          (click)="closeMenu()"
        ></div>

        <nav
          class="absolute inset-x-0 top-full z-50 flex flex-col gap-1 border-b border-slate-800 bg-slate-900 px-4 py-3 text-sm shadow-xl shadow-black/40 md:hidden"
        >
          <div class="flex items-center gap-2 px-2 py-2">
            <span
              class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold uppercase text-white"
            >
              {{ initial() }}
            </span>
            <span class="truncate font-medium text-slate-200">{{ auth.user()?.username }}</span>
          </div>

          <a
            routerLink="/"
            routerLinkActive="text-indigo-400"
            [routerLinkActiveOptions]="{ exact: true }"
            class="rounded-md px-2 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            (click)="closeMenu()"
          >
            Encurtar
          </a>
          <a
            routerLink="/dashboard"
            routerLinkActive="text-indigo-400"
            class="rounded-md px-2 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            (click)="closeMenu()"
          >
            Dashboard
          </a>
          <button
            type="button"
            class="rounded-md px-2 py-2 text-left text-slate-400 hover:bg-slate-800 hover:text-white"
            (click)="logout()"
          >
            Sair
          </button>
        </nav>
      }
    </header>
  `,
})
export class HeaderComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly menuOpen = signal(false);

  protected initial(): string {
    return this.auth.user()?.username?.charAt(0) ?? '?';
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.closeMenu();
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
