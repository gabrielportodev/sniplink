import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from 'src/app/app.routes';
import { credentialsInterceptor } from 'src/app/core/interceptors/credentials.interceptor';
import { AuthService } from 'src/app/core/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([credentialsInterceptor])),
    provideCharts(withDefaultRegisterables()),
    provideAppInitializer(() => inject(AuthService).loadSession()),
  ],
};
