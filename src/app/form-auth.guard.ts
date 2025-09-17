import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { FormularioService } from './components/pages/forms-selection/formulario.service'; // Ajuste o caminho
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const formAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const formularioService = inject(FormularioService);

  // O nome do formulário vem do último segmento da URL (ex: 'sachets')
  const formRoute = route.url[route.url.length - 1]?.path;

  if (!formRoute) {
    // Se não houver uma rota específica, redireciona
    return router.parseUrl('/formularios');
  }

  return formularioService.getFormularios().pipe(
    map(formularios => {
      // Encontra o formulário correspondente à rota
      const formulario = formularios.find(f => f.rota.endsWith(formRoute));

      if (formulario && formulario.ativo) {
        // Se o formulário existe e está ativo, permite o acesso
        return true;
      } else {
        // Se não encontrar ou estiver inativo, redireciona
        console.warn(`Acesso bloqueado à rota '/${formRoute}' porque o formulário não está ativo.`);
        return router.parseUrl('/formularios');
      }
    }),
    catchError(() => {
      // Em caso de erro na API, redireciona por segurança
      console.error('Erro ao verificar o estado do formulário. Redirecionando...');
      return of(router.parseUrl('/formularios'));
    })
  );
};
