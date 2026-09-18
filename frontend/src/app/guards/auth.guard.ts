import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../api/auth.service';

/**
 * Guard funcional do Angular para proteger rotas privadas.
 * Garante que o usuário possua uma sessão ativa antes de acessar páginas restritas (/home, /usuarios, /cadastro-usuario).
 * Se o usuário não estiver autenticado, redireciona para a página de login exibindo notificação.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: {
      message: 'Usuário não autenticado. Faça login para acessar esta página.',
      type: 'warning',
    },
  });
};

/**
 * Guard funcional para impedir que usuários já autenticados acessem a página de login.
 * Se o usuário já estiver autenticado, redireciona diretamente para o painel inicial (/home).
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/home']);
  }

  return true;
};
