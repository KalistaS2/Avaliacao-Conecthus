import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidade que representa a tabela de Usuários no banco de dados PostgreSQL.
 */
@Entity('users')
export class User {
  @ApiProperty({ description: 'Identificador único do usuário', example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'Nome completo do usuário (apenas letras)', example: 'Adriano Machado' })
  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @ApiProperty({ description: 'E-mail do usuário', example: 'adriano.machado@conecthus.com.br' })
  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;

  @ApiProperty({ description: 'Número de matrícula (apenas números)', example: '815667' })
  @Column({ type: 'varchar', length: 50, unique: true })
  registrationNumber!: string;

  @ApiProperty({ description: 'Senha alfanumérica de 6 dígitos (armazenada de forma hash)', example: 'abc123' })
  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @ApiProperty({ description: 'Data de criação do registro' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ description: 'Data da última atualização do registro' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
