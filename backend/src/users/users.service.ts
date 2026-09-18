import { Injectable, NotFoundException, ConflictException, UnauthorizedException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';

/**
 * Serviço responsável pelo gerenciamento de usuários e regras de negócio.
 */
@Injectable()
export class UsersService implements OnApplicationBootstrap {
  /**
   * Construtor da classe UsersService.
   * @param userRepository Repositório TypeORM da entidade User.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Hook de inicialização do NestJS para popular o usuário padrão inicial no banco.
   * @returns Promise sem retorno.
   */
  async onApplicationBootstrap(): Promise<void> {
    await this.seedInitialUser();
  }

  /**
   * Garante que o usuário de teste padrão exigido seja cadastrado no banco de dados.
   * @returns Promise sem retorno.
   */
  private async seedInitialUser(): Promise<void> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: [
          { email: 'userteste@hotmail.com' },
          { registrationNumber: '1234' },
        ],
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash('senha123', 10);
        const initialUser = this.userRepository.create({
          name: 'acesso',
          email: 'userteste@hotmail.com',
          registrationNumber: '1234',
          password: hashedPassword,
        });
        await this.userRepository.save(initialUser);
        console.log('✅ Usuário inicial seed criado com sucesso! (userteste@hotmail.com / 1234 / senha123)');
      }
    } catch (error) {
      console.error('Erro ao popular usuário inicial:', error);
    }
  }

  /**
   * Cria um novo usuário no sistema após validar duplicidades e criptografar a senha.
   * @param createUserDto Dados para criação do usuário.
   * @returns O objeto do usuário recém-criado sem expor a senha em texto puro.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { registrationNumber: createUserDto.registrationNumber },
      ],
    });

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException('Já existe um usuário cadastrado com este e-mail.');
      }
      if (existingUser.registrationNumber === createUserDto.registrationNumber) {
        throw new ConflictException('Já existe um usuário cadastrado com esta matrícula.');
      }
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  /**
   * Lista usuários cadastrados com paginação e busca por nome.
   * @param search Termo opcional para busca por nome.
   * @param page Número da página atual (padrão: 1).
   * @param limit Quantidade de registros por página (padrão: 10).
   * @returns Objeto com a lista de usuários, total de registros, página atual e total de páginas.
   */
  async findAll(
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: User[]; total: number; page: number; limit: number; totalPages: number }> {
    const queryPage = Math.max(1, page);
    const queryLimit = Math.max(1, limit);

    const whereCondition = search
      ? { name: Like(`%${search}%`) }
      : {};

    const [data, total] = await this.userRepository.findAndCount({
      where: whereCondition,
      order: { createdAt: 'DESC' },
      skip: (queryPage - 1) * queryLimit,
      take: queryLimit,
    });

    const totalPages = Math.ceil(total / queryLimit) || 1;

    return {
      data,
      total,
      page: queryPage,
      limit: queryLimit,
      totalPages,
    };
  }

  /**
   * Busca um usuário pelo seu ID único.
   * @param id Identificador do usuário.
   * @returns O usuário encontrado.
   * @throws NotFoundException caso o usuário não seja localizado.
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não foi encontrado.`);
    }
    return user;
  }

  /**
   * Atualiza os dados de um usuário existente.
   * @param id Identificador do usuário a ser atualizado.
   * @param updateUserDto Dados atualizados do usuário.
   * @returns O usuário com os dados atualizados.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.userRepository.findOne({ where: { email: updateUserDto.email } });
      if (emailExists) {
        throw new ConflictException('Já existe outro usuário cadastrado com este e-mail.');
      }
    }

    if (updateUserDto.registrationNumber && updateUserDto.registrationNumber !== user.registrationNumber) {
      const regExists = await this.userRepository.findOne({ where: { registrationNumber: updateUserDto.registrationNumber } });
      if (regExists) {
        throw new ConflictException('Já existe outro usuário cadastrado com esta matrícula.');
      }
    }

    const updateData: Partial<User> = { ...updateUserDto };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  /**
   * Remove um usuário do banco de dados pelo seu ID.
   * @param id Identificador do usuário a ser removido.
   * @returns Promise sem retorno.
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  /**
   * Autentica um usuário via e-mail ou matrícula e senha.
   * @param loginDto Dados de autenticação (login e senha).
   * @returns Informações do usuário autenticado e token de acesso.
   */
  async login(loginDto: LoginDto): Promise<{ user: Partial<User>; token: string }> {
    const { login, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: [
        { email: login },
        { registrationNumber: login },
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas. Verifique seu e-mail/matrícula e senha.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas. Verifique seu e-mail/matrícula e senha.');
    }

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token: `fake-jwt-token-conecthus-${user.id}-${Date.now()}`,
    };
  }
}
