import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/core/services/auth.service';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';

@Component({
  selector: 'app-login',
  imports: [LogoComponent],
  template: `
    <div class="grid min-h-screen bg-slate-950 text-slate-100 lg:grid-cols-2">
      <section class="flex items-center justify-center px-6 py-12 sm:px-10">
        <div class="w-full max-w-md space-y-10">
          <app-logo size="h-8 w-8" [large]="true" />

          <div class="space-y-3">
            <h1 class="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
              Entrar no Sniplink
            </h1>
            <p class="text-base text-slate-400">
              Use sua conta Google ou GitHub para acessar seu painel.
            </p>
          </div>

          <div class="space-y-4">
            <button
              class="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3.5 text-base font-medium text-slate-100 transition hover:border-slate-600 hover:bg-slate-800"
              type="button"
              (click)="loginWith('google')"
            >
              <svg class="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
                />
              </svg>
              Continuar com Google
            </button>

            <button
              class="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3.5 text-base font-medium text-slate-100 transition hover:border-slate-600 hover:bg-slate-800"
              type="button"
              (click)="loginWith('github')"
            >
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.53.1.72-.23.72-.5v-1.76c-2.92.63-3.54-1.41-3.54-1.41-.48-1.21-1.17-1.54-1.17-1.54-.96-.65.07-.64.07-.64 1.06.08 1.62 1.09 1.62 1.09.94 1.61 2.47 1.15 3.07.88.1-.68.37-1.15.67-1.41-2.33-.27-4.78-1.17-4.78-5.18 0-1.15.41-2.08 1.08-2.82-.11-.27-.47-1.34.1-2.79 0 0 .88-.28 2.88 1.07a10 10 0 0 1 5.24 0c2-1.35 2.88-1.07 2.88-1.07.57 1.45.21 2.52.1 2.79.68.74 1.08 1.67 1.08 2.82 0 4.02-2.46 4.9-4.8 5.16.38.33.71.97.71 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5Z"
                />
              </svg>
              Continuar com GitHub
            </button>
          </div>

          <p class="text-sm text-slate-500">
            Ao continuar, você concorda em criar uma conta automaticamente caso ainda não tenha uma.
          </p>
        </div>
      </section>

      <section class="hidden items-center justify-center bg-slate-900/40 p-10 lg:flex">
        <img src="login-ilustration.svg" alt="" class="w-full max-w-xl" />
      </section>
    </div>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  loginWith(provider: 'google' | 'github'): void {
    const params = this.route.snapshot.queryParamMap;
    const redirect = params.get('redirect') ?? '/dashboard';
    const originalUrl = params.get('originalUrl');
    const alias = params.get('alias');

    let target = redirect;
    if (originalUrl) {
      const query = new URLSearchParams({ originalUrl });
      if (alias) {
        query.set('alias', alias);
      }
      target = `${redirect}?${query.toString()}`;
    }

    this.auth.loginWith(provider, target);
  }
}
