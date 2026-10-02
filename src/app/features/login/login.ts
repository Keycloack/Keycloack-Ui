import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {

  private readonly authService = inject(AuthService);

  readonly labels = {
    appName: 'Tejas',
    loginButton: 'Sign in',
    loadingMessage: 'Checking authentication status...',
    errorMessage:
      'Something went wrong while connecting to the login service. Please try again.'
  };

  readonly authState = this.authService.authState;

  readonly isInitializing = this.authService.isInitializing;

  readonly isAuthenticated = this.authService.isAuthenticated;

  readonly hasError = this.authService.hasError;

  /**
   * Starts the Keycloak authentication flow.
   * Credentials are handled by Keycloak.
   */
  onLogin(): void {
    void this.authService.login();
  }
}