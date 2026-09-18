import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * Data Transfer Object para atualização de dados do usuário.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
