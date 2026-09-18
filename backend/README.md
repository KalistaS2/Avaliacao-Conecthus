# Backend - Conecthus API RESTful

API RESTful desenvolvida com **NestJS**, **TypeORM** e **PostgreSQL** para o gerenciamento completo de usuários do sistema Conecthus.

## 🛠️ Tecnologias Utilizadas
- **Node.js** & **TypeScript**
- **NestJS** (Framework REST)
- **TypeORM** (ORM para banco de dados)
- **PostgreSQL** (Banco de dados relacional)
- **Swagger UI** (Documentação interativa da API)
- **class-validator** & **class-transformer** (Validação e transformação de DTOs)
- **bcrypt** (Criptografia de senhas)

---

## 🔑 Variáveis de Ambiente (.env)
As variáveis de ambiente devem ser configuradas no arquivo `.env` localizado na raiz da pasta `/backend`:

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
Com a aplicação em execução, a documentação Swagger interativa pode ser acessada em:
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

---

## 📌 Endpoints da API

### Autenticação
- `POST /auth/login` - Autentica usuário via e-mail ou matrícula e senha.

### Usuários (`/users`)
- `POST /users` - Cria um novo usuário.
- `GET /users?search={nome}&page={num}&limit={qtd}` - Lista usuários paginados com filtro por nome.
- `GET /users/:id` - Detalhes de um usuário específico.
- `PATCH /users/:id` - Atualiza dados de um usuário.
- `DELETE /users/:id` - Remove um usuário do sistema.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js v20+
- Instância do PostgreSQL rodando (ou via Docker Compose)

### Passos
```bash
# Instalar dependências
npm install

# Compilar projeto
npm run build

# Executar em ambiente de desenvolvimento
npm run start:dev
```
