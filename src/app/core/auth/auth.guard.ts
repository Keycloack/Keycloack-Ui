import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';
import { AuthService } from './auth.service';

/**
 * Protects a route and sends unauthenticated users directly to Keycloak.
 */
const isAccessAllowed = async (_route: unknown, _state: unknown, authData: AuthGuardData) => {
  const { authenticated } = authData;

  if (authenticated) {
    return true;
  }

  void inject(AuthService).login();
  return false;
};

export const authGuard: CanActivateFn = createAuthGuard(isAccessAllowed);
