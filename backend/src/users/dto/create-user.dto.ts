import { IsNotEmpty, IsEmail, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object para criação de um novo usuário.
 */
export class CreateUserDto {
  @ApiProperty({ description: 'Nome completo do usuário (Apenas letras e espaços)', example: 'acesso' })
  @IsNotEmpty({ message: 'O campo Nome é obrigatório.' })
  @Matches(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/, { message: 'O nome deve conter apenas letras.' })
  name!: string;

  @ApiProperty({ description: 'E-mail válido do usuário', example: 'userteste@hotmail.com' })
  @IsNotEmpty({ message: 'O campo E-mail é obrigatório.' })
  @IsEmail({}, { message: 'O campo E-mail deve conter um endereço de e-mail válido.' })
  email!: string;

  @ApiProperty({ description: 'Número de matrícula (Apenas números)', example: '1234' })
  @IsNotEmpty({ message: 'O campo Matrícula é obrigatório.' })
  @Matches(/^\d+$/, { message: 'A matrícula deve conter apenas números.' })
  registrationNumber!: string;

  @ApiProperty({ description: 'Senha alfanumérica (Mínimo 6 dígitos)', example: 'senha123' })
  @IsNotEmpty({ message: 'O campo Senha é obrigatório.' })
  @MinLength(6, { message: 'A senha deve conter no mínimo 6 dígitos.' })
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'A senha deve ser alfanumérica.' })
  password!: string;
}
