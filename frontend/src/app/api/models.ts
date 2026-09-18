/**
 * Interface que define os dados de um Usuário no sistema Conecthus.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  registrationNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO para criação de um novo usuário.
 */
export interface CreateUserPayload {
  name: string;
  email: string;
  registrationNumber: string;
  password: string;
}

/**
 * DTO para atualização de usuário existente.
 */
export interface UpdateUserPayload {
  name?: string;
  email?: string;
  registrationNumber?: string;
  password?: string;
}

/**
 * Interface para a resposta paginada da listagem de usuários.
 */
export interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Resposta de autenticação (Login).
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Estrutura para envio de notificações de Toast.
 */
export interface NotificationMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}
