import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

/**
 * DTO que representa a resposta paginada da listagem de usuários.
 */
export class PaginatedUsersResponseDto {
  @ApiProperty({ type: [User], description: 'Lista de usuários na página atual' })
  data!: User[];

  @ApiProperty({ description: 'Total de usuários cadastrados', example: 12 })
  total!: number;

  @ApiProperty({ description: 'Número da página atual', example: 1 })
  page!: number;

  @ApiProperty({ description: 'Quantidade de registros por página', example: 10 })
  limit!: number;

  @ApiProperty({ description: 'Total de páginas calculadas', example: 2 })
  totalPages!: number;
}
