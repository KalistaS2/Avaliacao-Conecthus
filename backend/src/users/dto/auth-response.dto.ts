import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

/**
 * DTO que representa a resposta de autenticação bem-sucedida.
 */
export class AuthResponseDto {
  @ApiProperty({ type: () => User, description: 'Dados do usuário autenticado' })
  user!: Partial<User>;

  @ApiProperty({
    description: 'Token de autenticação da sessão do usuário',
    example: 'fake-jwt-token-conecthus-1-1726000000000',
  })
  token!: string;
}
