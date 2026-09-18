import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';
import { authGuard, guestGuard } from './guards/auth.guard';

/**
 * Mapeamento principal de rotas da aplicação Frontend Angular.
 * As rotas privadas (/home, /usuarios, /cadastro-usuario) exigem autenticação prévia via `authGuard`.
 */
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
    title: 'Conecthus - Autenticação',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    title: 'Conecthus - Painel Inicial',
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [authGuard],
    title: 'Conecthus - Gerenciamento de Usuários',
  },
  {
    path: 'cadastro-usuario',
    component: CadastroUsuarioComponent,
    canActivate: [authGuard],
    title: 'Conecthus - Cadastro de Usuário',
  },
  { path: '**', redirectTo: 'login' },
];
