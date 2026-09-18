# Backend - Conecthus API RESTful (NestJS)

API RESTful desenvolvida com **NestJS**, **TypeORM** e **PostgreSQL** para o gerenciamento completo de usuários e autenticação do sistema Conecthus.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** (v20+) & **TypeScript**
- **NestJS** (Framework REST modular com suporte a injeção de dependências)
- **TypeORM** (Object-Relational Mapping para interação com o banco relacional)
- **PostgreSQL 16** (Banco de dados relacional principal)
- **Swagger UI (`@nestjs/swagger`)** (Documentação interativa OpenAPI 3.0)
- **class-validator & class-transformer** (Validação e higienização estrita de DTOs)
- **bcrypt** (Criptografia e hashing seguro de senhas)
- **Vitest** (Testes unitários e de integração E2E)

---

## 📁 Estrutura do Projeto Backend

```text
backend/
├── src/
│   ├── app.controller.ts         # Endpoint de healthcheck / status da API
│   ├── app.controller.spec.ts    # Teste unitário do AppController
│   ├── app.module.ts            # Módulo raiz configurando TypeORM e recursos globais
│   ├── app.service.ts           # Serviço do módulo raiz
│   ├── main.ts                  # Bootstrapping, CORS, ValidationPipe global e Swagger UI
│   └── users/
│       ├── dto/
│       │   ├── create-user.dto.ts           # Validação para criação de usuário
│       │   ├── update-user.dto.ts           # Validação parcial para atualização
│       │   ├── login.dto.ts                 # Validação do formulário de autenticação
│       │   ├── forgot-password.dto.ts       # Validação para solicitação de recuperação de senha
│       │   ├── reset-password.dto.ts        # Validação para redefinição de senha com token
│       │   ├── auth-response.dto.ts         # DTO para resposta de login no Swagger
│       │   └── paginated-users.dto.ts       # DTO para resposta paginada no Swagger
│       ├── entities/
│       │   └── user.entity.ts               # Entidade TypeORM que define a tabela 'users'
│       ├── users.controller.ts              # Controladores REST (/users e /auth/*)
│       ├── users.module.ts                  # Módulo contendo a injeção de dependências de usuários
│       └── users.service.ts                 # Regras de negócio, hashing, seed automático e persistência
├── Dockerfile                   # Build multi-estágio em Node.js (Alpine)
├── package.json                 # Dependências e scripts do projeto
├── tsconfig.json                # Configurações do compilador TypeScript
└── .env                         # Variáveis de ambiente da aplicação
```

---

## 🔑 Variáveis de Ambiente (`.env`)

As configurações da API e conexão ao PostgreSQL devem estar no arquivo `.env` no diretório `/backend`:

```env
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=conecthus_db
```

---

## 📖 Documentação da API (Swagger UI)

A API possui documentação OpenAPI interativa e automatizada via **Swagger UI**. Com o container ou servidor backend em execução, acesse:

👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

No Swagger UI você encontra:
- **Schemas e DTOs detalhados**: `CreateUserDto`, `UpdateUserDto`, `LoginDto`, `ForgotPasswordDto`, `ResetPasswordDto`, `AuthResponseDto`, `PaginatedUsersResponseDto` e `User`.
- **Exemplos de Payload de requisição e resposta**.
- **Códigos de Status HTTP**: 200, 201, 400 (Bad Request), 401 (Unauthorized), 409 (Conflict - E-mail/Matrícula duplicados) e 404 (Not Found).
- **Interface interativa para testar as requisições diretamente do navegador**.

---

## 📌 Endpoints da API RESTful

### 🔹 Status / Healthcheck (`Status`)
- `GET /` - Retorna a confirmação de que o servidor backend está operacional.

### 🔹 Autenticação e Recuperação (`/auth`)
- `POST /auth/login`
  - **Descrição**: Autentica o usuário no sistema por **E-mail** ou **Matrícula** e **Senha**.
  - **Body**: `{ "login": "userteste@hotmail.com", "password": "senha123" }`
  - **Retorno**: Objeto contendo o perfil do usuário (sem a senha) e o token de acesso.

- `POST /auth/forgot-password`
  - **Descrição**: Solicita a recuperação de senha verificando se o e-mail informado existe no banco.
  - **Body**: `{ "email": "userteste@hotmail.com" }`
  - **Retorno**: `{ "message": "...", "registrationNumber": "1234", "token": "...", "resetUrl": "..." }`

- `POST /auth/reset-password`
  - **Descrição**: Redefine a senha do usuário com validação de nova senha (alfanumérico min 6 caracteres) e hash bcrypt.
  - **Body**: `{ "login": "userteste@hotmail.com", "token": "...", "newPassword": "novaSenha123" }`
  - **Retorno**: `{ "message": "Senha redefinida com sucesso." }`

### 🔹 Usuários (`/users`)
- `POST /users`
  - **Descrição**: Cria um novo usuário no banco de dados com validações estritas e hashing de senha.
  - **Body**: `{ "name": "Milena Santana", "email": "milena@conecthus.com", "registrationNumber": "12345", "password": "senha123" }`
  - **Retorno**: Objeto do usuário criado (Status HTTP 201).
- `GET /users?search={nome}&page={num}&limit={qtd}`
  - **Descrição**: Retorna uma lista de usuários paginada, permitindo busca por nome em tempo real.
  - **Parâmetros de Query**:
    - `search` (opcional): Filtra registros por trecho do nome.
    - `page` (opcional, padrão 1): Página desejada.
    - `limit` (opcional, padrão 10): Quantidade de itens por página.
  - **Retorno**: `{ "data": [...], "total": 10, "page": 1, "limit": 10, "totalPages": 1 }`
- `GET /users/:id`
  - **Descrição**: Retorna as informações detalhadas de um usuário específico pelo ID.
- `PATCH /users/:id`
  - **Descrição**: Atualiza parcialmente os dados do usuário. Se a senha for alterada, é gerado um novo hash bcrypt.
- `DELETE /users/:id`
  - **Descrição**: Exclui permanentemente o registro de um usuário do banco de dados.

---

## 🌱 Seeding Automático de Usuário Inicial

Ao inicializar a aplicação backend (`OnApplicationBootstrap`), o serviço executa o método `seedInitialUser()`. Se o usuário padrão de teste não for encontrado no PostgreSQL, ele é criado automaticamente:

- **Nome**: `acesso`
- **E-mail**: `userteste@hotmail.com`
- **Matrícula**: `1234`
- **Senha**: `senha123` (criptografada com bcrypt hash)

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js v20+
- PostgreSQL v16 em execução (localmente ou via Docker Compose)

### Passos de Instalação e Execução

```bash
# Navegar até o diretório backend
cd backend

# Instalar dependências
npm install

# Compilar o código TypeScript
npm run build

# Executar a aplicação em modo de desenvolvimento
npm run start:dev

# Executar suíte de testes unitários com Vitest
npm test
```
