import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para solicitação de recuperação de senha via e-mail.
 */
export class ForgotPasswordDto {
  @ApiProperty({ description: 'E-mail cadastrado do usuário', example: 'userteste@hotmail.com' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email!: string;
}
