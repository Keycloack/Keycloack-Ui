import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html'
})
export class Home {
  private readonly authService = inject(AuthService);
  readonly user = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
  }
}
