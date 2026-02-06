import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  AutoRefreshTokenService,
  includeBearerTokenInterceptor,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  provideKeycloak,
  UserActivityService,
  withAutoRefreshToken,
} from 'keycloak-angular';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
    provideKeycloak({
      config: {
        url: environment.keycloakUrl,
        realm: 'notes',
        clientId: 'notes-app',
      },
      initOptions: {
        onLoad: 'login-required',
        pkceMethod: 'S256',
      },
      providers: [AutoRefreshTokenService, UserActivityService],
      features: [withAutoRefreshToken()],
    }),
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [{ urlPattern: /\/api\/.*/ }],
    },
  ],
};
