import { Injectable, computed, effect, inject, signal } from '@angular/core';
import Keycloak from 'keycloak-js';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, typeEventArgs, ReadyArgs } from 'keycloak-angular';

export type AuthState = 'initializing' | 'authenticated' | 'unauthenticated' | 'error';

export interface AuthUser {
  username: string | undefined;
  email: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  private readonly state = signal<AuthState>('initializing');
  private readonly user = signal<AuthUser | null>(null);

  readonly authState = this.state.asReadonly();
  readonly currentUser = this.user.asReadonly();
  readonly isInitializing = computed(() => this.state() === 'initializing');
  readonly isAuthenticated = computed(() => this.state() === 'authenticated');
  readonly hasError = computed(() => this.state() === 'error');

  constructor() {
    effect(() => {
      const event = this.keycloakSignal();

      switch (event.type) {
        case KeycloakEventType.Ready: {
          const authenticated = typeEventArgs<ReadyArgs>(event.args);
          this.state.set(authenticated ? 'authenticated' : 'unauthenticated');
          if (authenticated) {
            this.loadUserProfile();
          }
          break;
        }
        case KeycloakEventType.AuthSuccess:
          this.state.set('authenticated');
          this.loadUserProfile();
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

  login(redirectUri?: string): Promise<void> {
    return this.keycloak.login({
      redirectUri: redirectUri ?? window.location.origin
    });
  }

  logout(redirectUri?: string): Promise<void> {
    return this.keycloak.logout({
      redirectUri: redirectUri ?? window.location.origin + '/login'
    });
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getUser(): AuthUser | null {
    return this.user();
  }

  getAccessToken(): string | undefined {
    return this.keycloak.token;
  }
}
