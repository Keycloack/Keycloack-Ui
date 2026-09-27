import { provideKeycloak, withAutoRefreshToken, AutoRefreshTokenService, UserActivityService } from 'keycloak-angular';
import { environment } from '../../../environments/environment';

/**
 * Builds the Keycloak provider configuration for this application.
 * This is the ONLY place Keycloak connection/init details live.
 * AuthService, guards, and the interceptor consume Keycloak via
 * Angular DI � they never configure it themselves.
 */
export const provideKeycloakAngular = () =>
  provideKeycloak({
    config: {
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      checkLoginIframe: false
    },
    features: [
      withAutoRefreshToken({
        onInactivityTimeout: 'logout',
        sessionTimeout: 300000
      })
    ],
    providers: [AutoRefreshTokenService, UserActivityService]
  });
