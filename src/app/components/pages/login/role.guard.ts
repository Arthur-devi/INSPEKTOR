import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Ajuste o caminho

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Pega nos papéis permitidos a partir da propriedade 'data' da rota
  const expectedRoles = route.data['roles'] as number[];

  if (!authService.isLoggedIn()) {
    return router.parseUrl('/login');
  }

  const userRole = authService.getUserRole();

  // Verifica se o utilizador tem um dos papéis esperados
  if (userRole !== null && expectedRoles && expectedRoles.includes(userRole)) {
    return true; // Acesso permitido
  }

  // Se não tiver o papel, redireciona para a página principal
  console.warn(`Acesso negado. O utilizador com papel '${userRole}' tentou aceder a uma rota que requer um dos seguintes papéis: [${expectedRoles.join(', ')}]`);
  return router.parseUrl('/');
};
