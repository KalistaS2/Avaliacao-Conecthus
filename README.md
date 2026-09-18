# Sistema CRUD Avaliação Conecthus (Monorepo)

Sistema Full Stack completo para gerenciamento de usuários (**Conecthus**), englobando backend em **NestJS**, frontend em **Angular** e infraestrutura automatizada com **Docker Compose** e **PostgreSQL**.

---

## 🏗️ Arquitetura do Projeto

O projeto é estruturado no formato de Monorepo com dois diretórios principais:

```text
Avaliacao-Conecthus/
├── backend/                  # Aplicação Backend NestJS (API RESTful + Swagger UI + TypeORM)
├── frontend/                 # Aplicação Frontend Angular (Arquitetura modular em /components, /pages, /api, /environments)
├── docker-compose.yml        # Orquestração dos contêineres Docker (Frontend, Backend e Postgres)
└── README.md                 # Documentação principal da raiz
```

---

## ⚡ Stack Tecnológico
- **Frontend**: Angular 19, HTML5, CSS3 vanilla (design moderno, animações e glassmorphism)
- **Backend**: NestJS (API RESTful), TypeScript, Swagger UI (`/api/docs`), Class-validator, Bcrypt
- **Banco de Dados**: PostgreSQL 16
- **Containerização**: Docker, Docker Compose e NGINX (para SPA Angular)

---

## 🚀 Como Executar o Projeto com Docker Compose

### Pré-requisitos
- [Docker](https://www.docker.com/) e Docker Compose instalados na máquina.

### Passo a Passo

1. **Subir todos os serviços simultaneamente**:
   ```bash
   docker-compose up --build -d
   ```

2. **Acessar as aplicações no navegador**:
   - **Frontend Angular**: [http://localhost](http://localhost) (ou `http://localhost:80`)
   - **Backend API REST**: [http://localhost:3000](http://localhost:3000)
   - **Swagger UI (Documentação)**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

3. **Para encerrar os contêineres**:
   ```bash
   docker-compose down
   ```

---

## 📚 Documentações Específicas
- 📖 [Documentação Detalhada do Backend](file:///c:/Users/Guilh/OneDrive/Documentos/codes/Avaliacao-full-stack/Avaliacao-Conecthus/backend/README.md)
- 📖 [Documentação Detalhada do Frontend](file:///c:/Users/Guilh/OneDrive/Documentos/codes/Avaliacao-full-stack/Avaliacao-Conecthus/frontend/README.md)
