import {
  Injectable,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';

import Keycloak from 'keycloak-js';

import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  typeEventArgs,
  ReadyArgs
} from 'keycloak-angular';

export type AuthState =
  | 'initializing'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

export interface AuthUser {
  username: string | undefined;
  email: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  /**
   * Application-level authentication state.
   */
  private readonly state = signal<AuthState>('initializing');

  /**
   * Currently authenticated user.
   */
  private readonly user = signal<AuthUser | null>(null);

  /**
   * Default application route after successful login.
   */
  private readonly defaultLoginRedirect = '/dashboard';

  /**
   * Public readonly authentication state.
   */
  readonly authState = this.state.asReadonly();

  /**
   * Public readonly current user.
   */
  readonly currentUser = this.user.asReadonly();

  /**
   * Convenience computed signals.
   */
  readonly isInitializing = computed(
    () => this.state() === 'initializing'
  );

  readonly isAuthenticated = computed(
    () => this.state() === 'authenticated'
  );

  readonly hasError = computed(
    () => this.state() === 'error'
  );

  constructor() {
    effect(() => {
      const event = this.keycloakSignal();

      switch (event.type) {

        case KeycloakEventType.Ready: {
          const authenticated =
            typeEventArgs<ReadyArgs>(event.args);

          if (authenticated) {
            this.state.set('authenticated');
            void this.loadUserProfile();
          } else {
            this.state.set('unauthenticated');
            this.user.set(null);
          }

          break;
        }

        case KeycloakEventType.AuthSuccess:
          this.state.set('authenticated');
          void this.loadUserProfile();
          break;

        case KeycloakEventType.AuthLogout:
          this.state.set('unauthenticated');
          this.user.set(null);
          break;

        case KeycloakEventType.AuthError:
        case KeycloakEventType.AuthRefreshError:
          this.state.set('error');
          break;
      }
    });
  }

  /**
   * Redirect the user to Keycloak login.
   *
   * The component does not need to know the dashboard URL.
   */
  login(
    redirectUri: string = this.defaultLoginRedirect
  ): Promise<void> {
    return this.keycloak.login({
      redirectUri: this.buildRedirectUri(redirectUri)
    });
  }

  /**
   * Logout from Keycloak and return to the login page.
   */
  logout(
    redirectUri: string = '/login'
  ): Promise<void> {
    return this.keycloak.logout({
      redirectUri: this.buildRedirectUri(redirectUri)
    });
  }

  /**
   * Returns whether the user is currently authenticated.
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Returns the currently authenticated user.
   */
  getUser(): AuthUser | null {
    return this.user();
  }

  /**
   * Returns the current Keycloak access token.
   *
   * Prefer using an HTTP interceptor for attaching this token
   * to API requests instead of manually calling this method
   * throughout components.
   */
  getAccessToken(): string | undefined {
    return this.keycloak.token;
  }

  /**
   * Loads the authenticated user's Keycloak profile.
   */
  private async loadUserProfile(): Promise<void> {
    try {
      const profile = await this.keycloak.loadUserProfile();

      this.user.set({
        username: profile.username,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName
      });
    } catch {
      this.user.set(null);
    }
  }

  /**
   * Converts an application-relative route into
   * an absolute redirect URI.
   */
  private buildRedirectUri(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    const normalizedPath = path.startsWith('/')
      ? path
      : `/${path}`;

    return `${window.location.origin}${normalizedPath}`;
  }
}