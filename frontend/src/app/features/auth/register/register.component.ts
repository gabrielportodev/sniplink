import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from 'src/app/core/services/auth.service';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, LogoComponent],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <section class="w-full max-w-sm space-y-6">
        <div class="flex justify-center">
          <app-logo size="h-6 w-6" [large]="true" />
        </div>

        <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h1 class="text-xl font-semibold text-slate-100">Criar conta</h1>

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
              {{ loading() ? 'Criando...' : 'Cadastrar' }}
            </button>
          </form>
        </div>

        <p class="text-center text-sm text-slate-400">
          Já tem conta?
          <a routerLink="/login" class="text-indigo-400 hover:text-indigo-300">Entrar</a>
        </p>
      </section>
    </div>
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.error.set('Não foi possível criar a conta.');
        this.loading.set(false);
      },
    });
  }
}
