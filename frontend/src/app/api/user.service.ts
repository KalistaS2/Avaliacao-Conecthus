import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User, CreateUserPayload, UpdateUserPayload, PaginatedUsers } from './models';

/**
 * Serviço responsável por consumir a API RESTful de gerenciamento de usuários.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  /**
   * Construtor do UserService.
   * @param http Cliente HTTP do Angular para envio de requisições REST.
   */
  constructor(private readonly http: HttpClient) { }

  /**
   * Lista usuários cadastrados com suporte a filtro por nome e paginação.
   * @param search Termo opcional para filtro por nome.
   * @param page Número da página (padrão: 1).
   * @param limit Limite de registros por página (padrão: 10).
   * @returns Observable contendo os dados dos usuários paginados.
   */
  public getUsers(search: string = '', page: number = 1, limit: number = 10): Observable<PaginatedUsers> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<PaginatedUsers>(this.apiUrl, { params });
  }

  /**
   * Busca as informações de um usuário pelo seu ID.
   * @param id Identificador numérico do usuário.
   * @returns Observable com os dados do usuário.
   */
  public getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cadastra um novo usuário no sistema.
   * @param payload Objeto contendo os dados do formulário de criação.
   * @returns Observable com o usuário cadastrado.
   */
  public createUser(payload: CreateUserPayload): Observable<User> {
    return this.http.post<User>(this.apiUrl, payload);
  }

  /**
   * Atualiza os dados de um usuário cadastrado.
   * @param id Identificador do usuário.
   * @param payload Objeto com os campos modificados.
   * @returns Observable com o usuário atualizado.
   */
  public updateUser(id: number, payload: UpdateUserPayload): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, payload);
  }

  /**
   * Exclui um usuário do sistema.
   * @param id Identificador numérico do usuário.
   * @returns Observable da confirmação de remoção.
   */
  public deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
