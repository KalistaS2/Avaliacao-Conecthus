# Sistema CRUD Avaliação Conecthus (Monorepo)

Sistema Full Stack completo para gerenciamento de usuários e autenticação, englobando backend em **NestJS**, frontend em **Angular 19** e infraestrutura containerizada com **Docker Compose** e **PostgreSQL**.

---

## 🏗️ Arquitetura do Monorepo

O projeto é estruturado no formato de Monorepo organizado em dois diretórios principais e orquestrado via Docker:

```text
Avaliacao-Conecthus/
├── backend/                  # Aplicação Backend NestJS (API RESTful + Swagger UI + TypeORM + PostgreSQL)
├── frontend/                 # Aplicação Frontend Angular 19 (SPA Modular com Header, Sidebar, Signals, Login & Recuperar Senha)
├── docker-compose.yml        # Orquestração dos contêineres Docker (Frontend/NGINX, Backend NestJS e Postgres)
└── README.md                 # Documentação principal da raiz do monorepo
```

---

## ⚡ Stack Tecnológico

- **Frontend**: Angular 19 (Componentes Standalone, Angular Signals, RxJS, HTML5 e CSS3 Vanilla com design moderno e glassmorphism).
- **Backend**: NestJS (API RESTful em TypeScript), TypeORM, PostgreSQL, Swagger UI (`/api/docs`), Class-validator, Bcrypt e Vitest.
- **Banco de Dados**: PostgreSQL 16.
- **Containerização & Servidor Web**: Docker, Docker Compose e NGINX (servindo a SPA Angular de forma otimizada).

---

## 🔑 Credenciais Padrão de Teste (Seed Automático)

O backend realiza o cadastro automático de um usuário inicial de testes caso o banco de dados esteja limpo na primeira execução:

- **E-mail**: `userteste@hotmail.com`
- **Matrícula**: `1234`
- **Senha**: `senha123`

---

## 🚀 Como Executar o Projeto com Docker Compose

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/) com Docker Compose ativado e em execução na máquina.

### Passo a Passo

1. **Subir e compilar todos os serviços em segundo plano**:
   ```bash
   docker compose up --build -d
   ```

2. **Acessar os serviços no navegador**:
   - **Frontend Web Angular**: [http://localhost](http://localhost) (ou `http://localhost:80`)
   - **Backend API REST**: [http://localhost:3000](http://localhost:3000)
   - **Documentação Swagger UI (Interativa)**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

3. **Para encerrar os contêineres e redes**:
   ```bash
   docker compose down
   ```

---

## 📚 Documentações Específicas dos Módulos

- 📖 [Documentação Detalhada do Backend (NestJS / Swagger UI)](file:///c:/Users/Guilh/OneDrive/Documentos/codes/Avaliacao-full-stack/Avaliacao-Conecthus/backend/README.md)
- 📖 [Documentação Detalhada do Frontend (Angular 19 / Componentes)](file:///c:/Users/Guilh/OneDrive/Documentos/codes/Avaliacao-full-stack/Avaliacao-Conecthus/frontend/README.md)
