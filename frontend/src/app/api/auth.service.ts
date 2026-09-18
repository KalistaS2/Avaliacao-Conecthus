import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthResponse, User } from './models';

/**
 * Serviço responsável por gerenciar a autenticação e estado da sessão do usuário.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  /** Signal que armazena o usuário atualmente autenticado no sistema */
  public currentUser = signal<User | null>(this.getStoredUser());

  /**
   * Construtor do AuthService.
   * @param http Cliente HTTP do Angular para realizar requisições à API.
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Realiza a autenticação do usuário junto ao backend.
   * @param login E-mail ou número de matrícula do usuário.
   * @param password Senha de acesso.
   * @returns Observable com os dados do usuário e o token de autenticação.
   */
  public login(login: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { login, password }).pipe(
      tap((res) => {
        if (res && res.user && res.token) {
          localStorage.setItem('conecthus_user', JSON.stringify(res.user));
          localStorage.setItem('conecthus_token', res.token);
          this.currentUser.set(res.user);
        }
      })
    );
  }

  /**
   * Realiza o logout do usuário limpando o armazenamento local e limpando a sessão.
   * @returns Void
   */
  public logout(): void {
    localStorage.removeItem('conecthus_user');
    localStorage.removeItem('conecthus_token');
    this.currentUser.set(null);
  }

  /**
   * Verifica se o usuário está autenticado.
   * @returns Booleano indicando se há uma sessão ativa.
   */
  public isAuthenticated(): boolean {
    return !!localStorage.getItem('conecthus_token');
  }

  /**
   * Recupera o usuário salvo no localStorage caso existente.
   * @returns Objeto User ou null.
   */
  private getStoredUser(): User | null {
    const data = localStorage.getItem('conecthus_user');
    if (!data) return null;
    try {
      return JSON.parse(data) as User;
    } catch {
      return null;
    }
  }
}
