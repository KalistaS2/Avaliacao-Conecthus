import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';

/**
 * Controller responsável pelos endpoints de Usuários e Autenticação.
 */
@ApiTags('Usuários')
@Controller()
export class UsersController {
  /**
   * Construtor do UsersController.
   * @param usersService Serviço com regras de negócio de usuários.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Realiza a autenticação (login) do usuário no sistema.
   * @param loginDto Objeto contendo login (e-mail ou matrícula) e senha.
   * @returns Retorna os dados do usuário autenticado e um token de sessão.
   */
  @Post('auth/login')
  @ApiOperation({ summary: 'Autenticar usuário', description: 'Realiza o login via E-mail ou Matrícula e Senha.' })
  @ApiResponse({ status: 200, description: 'Login efetuado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() loginDto: LoginDto): Promise<{ user: Partial<User>; token: string }> {
    return await this.usersService.login(loginDto);
  }

  /**
   * Cadastra um novo usuário no sistema.
   * @param createUserDto Dados do formulário de cadastro.
   * @returns Retorna o registro do usuário criado.
   */
  @Post('users')
  @ApiOperation({ summary: 'Cadastrar novo usuário', description: 'Cria um novo registro de usuário com validação dos campos.' })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso.', type: User })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @ApiResponse({ status: 409, description: 'Conflito de e-mail ou matrícula existente.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  /**
   * Lista todos os usuários cadastrados com suporte a busca e paginação.
   * @param search Termo opcional para busca por nome.
   * @param page Número da página desejada.
   * @param limit Quantidade de registros por página.
   * @returns Retorna objeto paginado com registros de usuários.
   */
  @Get('users')
  @ApiOperation({ summary: 'Listar usuários', description: 'Retorna a listagem de usuários com filtro de busca por nome e paginação.' })
  @ApiQuery({ name: 'search', required: false, description: 'Filtrar por nome' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página', example: 10 })
  @ApiResponse({ status: 200, description: 'Lista de usuários recuperada com sucesso.' })
  async findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return await this.usersService.findAll(search, pageNum, limitNum);
  }

  /**
   * Busca os detalhes de um único usuário pelo ID.
   * @param id Identificador numérico do usuário.
   * @returns Objeto com dados do usuário encontrado.
   */
  @Get('users/:id')
  @ApiOperation({ summary: 'Buscar usuário por ID', description: 'Retorna os detalhes de um único usuário.' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso.', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.usersService.findOne(id);
  }

  /**
   * Atualiza os dados de um usuário pelo seu ID.
   * @param id Identificador do usuário.
   * @param updateUserDto Objeto com os campos a serem atualizados.
   * @returns Objeto do usuário atualizado.
   */
  @Patch('users/:id')
  @ApiOperation({ summary: 'Atualizar usuário', description: 'Atualiza informações cadastradas de um usuário.' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  /**
   * Exclui um usuário do sistema pelo seu ID.
   * @param id Identificador do usuário a ser removido.
   * @returns Mensagem de confirmação de exclusão.
   */
  @Delete('users/:id')
  @ApiOperation({ summary: 'Excluir usuário', description: 'Remove permanentemente o registro de um usuário.' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário excluído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.usersService.remove(id);
    return { message: 'Usuário excluído com sucesso.' };
  }
}
