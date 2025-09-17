import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Ajuste o caminho se necessário

// Este guarda verifica se o utilizador tem um token de login válido
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Se está logado, permite o acesso
  } else {
    // Se não está logado, redireciona para a página de login
    return router.parseUrl('/login');
  }
};
