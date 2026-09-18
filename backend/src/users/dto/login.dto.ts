import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object para autenticação (Login).
 */
export class LoginDto {
  @ApiProperty({ description: 'E-mail ou Matrícula do usuário', example: 'adriano.machado@conecthus.com.br' })
  @IsNotEmpty({ message: 'O identificador (E-mail ou Matrícula) é obrigatório.' })
  login!: string;

  @ApiProperty({ description: 'Senha de acesso do usuário', example: 'abc123' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  password!: string;
}
