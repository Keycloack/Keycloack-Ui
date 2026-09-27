import { inject } from '@angular/core';
import { Router } from '@angular/router';
import type { CanActivateFn } from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

/**
 * Protects a route: if the user is not authenticated, redirect them
 * to our own Angular /login page (which then lets the user trigger
 * Keycloak login explicitly via a button) instead of silently
 * auto-redirecting to Keycloak.
 */
const isAccessAllowed = async (_route: unknown, _state: unknown, authData: AuthGuardData) => {
  const { authenticated } = authData;

  if (authenticated) {
    return true;
  }

  const router = inject(Router);
  return router.parseUrl('/login');
};

export const authGuard: CanActivateFn = createAuthGuard(isAccessAllowed);
