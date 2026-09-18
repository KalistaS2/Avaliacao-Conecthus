import { IsNotEmpty, IsEmail, Matches, MinLength, MaxLength } from 'class-validator';
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

  @ApiProperty({ description: 'Senha alfanumérica de exatos 6 caracteres', example: 'senha1' })
  @IsNotEmpty({ message: 'O campo Senha é obrigatório.' })
  @MinLength(6, { message: 'deve conter 6 caracteres' })
  @MaxLength(6, { message: 'deve conter 6 caracteres' })
  @Matches(/^[a-zA-Z0-9]{6}$/, { message: 'deve conter 6 caracteres' })
  password!: string;
}
