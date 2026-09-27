import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly authService = inject(AuthService);

  // TODO: replace with MicroUiConfigService.getLoginLabels() once Micro UI integration is defined
  readonly labels = {
    appName: 'Icon',
    loginButton: 'Login',
    loadingMessage: 'Checking authentication status�',
    errorMessage: 'Something went wrong while connecting to the login service. Please try again.'
  };

  readonly authState = this.authService.authState;

  onLogin(): void {
    this.authService.login();
  }
}
