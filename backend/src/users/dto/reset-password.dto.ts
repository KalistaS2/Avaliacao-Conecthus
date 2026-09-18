import { IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para redefinição de senha do usuário.
 */
export class ResetPasswordDto {
  @ApiProperty({ description: 'E-mail ou Matrícula do usuário', example: 'userteste@hotmail.com' })
  @IsNotEmpty({ message: 'O identificador do usuário (e-mail ou matrícula) é obrigatório.' })
  login!: string;

  @ApiProperty({ description: 'Token de verificação gerado para a redefinição de senha', example: 'reset-token-conecthus-1-1726000000000' })
  @IsNotEmpty({ message: 'O token é obrigatório.' })
  token!: string;

  @ApiProperty({ description: 'Nova senha alfanumérica de exatos 6 caracteres', example: 'senha1' })
  @IsNotEmpty({ message: 'A nova senha é obrigatória.' })
  @MinLength(6, { message: 'deve conter 6 caracteres' })
  @MaxLength(6, { message: 'deve conter 6 caracteres' })
  @Matches(/^[a-zA-Z0-9]{6}$/, { message: 'deve conter 6 caracteres' })
  newPassword!: string;
}
