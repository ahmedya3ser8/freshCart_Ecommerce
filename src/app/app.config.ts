import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { headersInterceptor } from './core/interceptors/headers/headers.interceptor';
import { errorsInterceptor } from './core/interceptors/errors/errors.interceptor';
import { NgxSpinnerService } from "ngx-spinner";
import { loadingInterceptor } from './core/interceptors/loading/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions(), withInMemoryScrolling({scrollPositionRestoration: 'top'})),
    provideHttpClient(withFetch(), withInterceptors([headersInterceptor, errorsInterceptor, loadingInterceptor])),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-left',
      timeOut: 2000,
      progressBar: true
    }),
    importProvidersFrom([NgxSpinnerService])
  ]
};
