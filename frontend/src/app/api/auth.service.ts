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
   * Solicita a verificação de e-mail e geração de token de recuperação de senha.
   * @param email E-mail do usuário.
   * @returns Observable com objeto de resposta contendo a matrícula e o token/link.
   */
  public forgotPassword(email: string): Observable<{
    message: string;
    email: string;
    registrationNumber: string;
    token: string;
    resetUrl: string;
  }> {
    return this.http.post<{
      message: string;
      email: string;
      registrationNumber: string;
      token: string;
      resetUrl: string;
    }>(`${this.apiUrl}/forgot-password`, { email });
  }

  /**
   * Redefine a senha do usuário.
   * @param login E-mail ou matrícula do usuário.
   * @param token Token de recuperação.
   * @param newPassword Nova senha.
   * @returns Observable com a resposta do backend.
   */
  public resetPassword(login: string, token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, { login, token, newPassword });
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
