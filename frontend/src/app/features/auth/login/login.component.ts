import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from 'src/app/core/services/auth.service';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, LogoComponent],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <section class="w-full max-w-sm space-y-6">
        <div class="flex justify-center">
          <app-logo size="h-6 w-6" [large]="true" />
        </div>

        <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h1 class="text-xl font-semibold text-slate-100">Entrar</h1>

          <form class="mt-5 space-y-4" [formGroup]="form" (ngSubmit)="submit()">
            <input
              class="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              type="text"
              placeholder="Usuário"
              formControlName="username"
            />
            <input
              class="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              type="password"
              placeholder="Senha"
              formControlName="password"
            />

            @if (error()) {
              <p class="text-sm text-red-400">{{ error() }}</p>
            }

            <button
              class="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
              type="submit"
              [disabled]="form.invalid || loading()"
            >
              {{ loading() ? 'Entrando...' : 'Entrar' }}
            </button>
          </form>
        </div>

        <p class="text-center text-sm text-slate-400">
          Não tem conta?
          <a routerLink="/register" class="text-indigo-400 hover:text-indigo-300">Cadastre-se</a>
        </p>
      </section>
    </div>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const params = this.route.snapshot.queryParamMap;
    const redirect = params.get('redirect') ?? '/dashboard';
    const originalUrl = params.get('originalUrl');
    const alias = params.get('alias');

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () =>
        this.router.navigate([redirect], {
          queryParams: originalUrl ? { originalUrl, alias } : {},
        }),
      error: () => {
        this.error.set('Usuário ou senha inválidos.');
        this.loading.set(false);
      },
    });
  }
}
