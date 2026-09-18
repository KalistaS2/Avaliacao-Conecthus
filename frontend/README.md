# Frontend - Conecthus SPA (Angular 19)

Interface web responsiva, moderna e dinâmica desenvolvida em **Angular 19** para a aplicação de gerenciamento de usuários e autenticação da plataforma Conecthus.

---

## 🛠️ Tecnologias Utilizadas

- **Angular 19** (Componentes Standalone, Angular Signals e Formulários Reativos)
- **TypeScript 5**
- **RxJS** (Programação reativa para requisições HTTP)
- **HTML5 & CSS3 Vanilla** (Design System customizado com glassmorphism, animações fluidas e suporte a responsividade)
- **NGINX & Docker** (Servidor web de alto desempenho para servir a SPA em produção)

---

## 📁 Arquitetura e Organização de Diretórios

O projeto segue rigorosamente uma arquitetura modular, limpa e padronizada:

```text
frontend/src/app/
├── api/                           # Serviços HTTP de integração e Gerenciadores de Estado
│   ├── auth.service.ts            # Gerenciamento de sessão, login/logout, recuperação e localStorage
│   ├── user.service.ts            # Consumo da API RESTful de usuários (/users)
│   ├── notification.service.ts    # Serviço reativo global de Toasts/Notificações (Signals)
│   ├── sidebar.service.ts         # Controle reativo global do estado recolhido/expandido da Sidebar
│   └── models.ts                  # Interfaces TypeScript e DTOs da aplicação
├── components/                    # Componentes UI reutilizáveis e isolados
│   ├── header/                    # Top Navbar com iniciais do perfil e menu dropdown
│   ├── sidebar/                   # Menu de navegação lateral retrátil com transição animada
│   ├── popup/                     # Modal genérico para visualização detalhada do usuário
│   ├── popup-confirmacao/         # Modal de confirmação para exclusão e cancelamentos
│   └── notificacao/               # Banner Toast de feedback visual (Sucesso, Erro, Info, Alerta)
├── guards/                        # Route Guards funcionais do Angular
│   └── auth.guard.ts              # Proteção de rotas privadas (authGuard) e rotas públicas (guestGuard)
├── pages/                         # Páginas/Views principais da aplicação
│   ├── login/                     # Tela de autenticação e fluxo de Esqueci minha senha
│   ├── recuperar-senha/           # Tela de redefinição de nova senha do usuário
│   ├── home/                      # Painel inicial / Dashboard com mensagem personalizada
│   ├── usuarios/                  # Tabela de usuários, pesquisa por nome, paginação e ações
│   └── cadastro-usuario/          # Formulário reativo de cadastro e edição de usuários
├── environments/                  # Configurações de endpoints por ambiente
│   ├── environment.ts             # Configuração de produção
│   └── environment.development.ts # Configuração de desenvolvimento local
├── app.component.ts               # Componente raiz da aplicação
├── app.config.ts                  # Provedores globais e rotas do Angular
└── app.routes.ts                  # Mapeamento e proteção de rotas com títulos
```

---

## 🎨 Componentes Reutilizáveis (`/components`)

- **`HeaderComponent`**: Barra superior fixa presente em todas as páginas privadas. Exibe o nome da seção ativa, um badge circular com as iniciais do usuário logado (ex: "MS" para Milena Santana) e um menu dropdown de perfil com acionamento para encerramento de sessão (Logout).
- **`SidebarComponent`**: Barra de navegação lateral retrátil com animação fluida e transição de logo.
- **`PopupComponent`**: Modal flutuante elegante para exibição detalhada dos campos do usuário.
- **`PopupConfirmacaoComponent`**: Modal de confirmação reutilizável com tratamento de ações críticas.
- **`NotificacaoComponent`**: Toast reativo de alertas visuais posicionado no canto da tela com temporizador inteligente.

---

## 🔒 Guardas de Rota (`/guards`)

- **`authGuard`**: Impede o acesso de usuários não autenticados a páginas restritas (`/home`, `/usuarios`, `/cadastro-usuario`), redirecionando-os para a página de login com mensagem de aviso.
- **`guestGuard`**: Impede que usuários já logados acessem a página de `/login` ou `/recuperar-senha`, redirecionando-os automaticamente para o painel inicial (`/home`).

---

## 📄 Páginas da Aplicação (`/pages`)

1. **`LoginComponent` (`/login`)**:
   - Tela de apresentação institucional da Conecthus com formulário de autenticação por **E-mail** ou **Matrícula** e **Senha**.
   - **Fluxo "Esqueci minha senha"**:
     - Botão integrado no formulário de login para alternar para a tela de solicitação de e-mail.
     - Validação do e-mail digitado no backend (`POST /auth/forgot-password`).
     - Exibição do modal Popup estilizado em caso de sucesso:
       - **Título**: `feature de envio de e-mail não implementada.`
       - **Descrição**: `acesso a pagina de recuperação de senha do usuario {matricula}.`
       - **Ação**: Botão e link direto para direcionar o usuário à tela de redefinição de senha (`/recuperar-senha`).

2. **`RecuperarSenhaComponent` (`/recuperar-senha`)**:
   - Tela dedicada de redefinição de senha utilizando o mesmo layout visual da tela de login (ilustração do cadeado no lado esquerdo e card com formulário no lado direito).
   - Exibe a matrícula do usuário a ser atualizado.
   - Formulário com campos **Nova Senha** e **Confirmar Nova Senha**:
     - Botões para mostrar/ocultar senha.
     - Validação de formato alfanumérico com no mínimo 6 dígitos.
     - Validador de igualdade entre senha e confirmação (`passwordMatchValidator`).
   - Atualiza a senha no banco via `POST /auth/reset-password` e redireciona para a tela de login com toast de confirmação.

3. **`HomeComponent` (`/home`)**:
   - Dashboard principal com saudação personalizada utilizando o primeiro nome do usuário logado.

4. **`UsuariosComponent` (`/usuarios`)**:
   - Tabela de dados para gerenciamento completo dos usuários com pesquisa por nome, paginação e ações.

5. **`CadastroUsuarioComponent` (`/cadastro-usuario`)**:
   - Formulário unificado para criação e edição de usuários com validações estritas.

---

## 🚀 Scripts de Execução

```bash
# Navegar até a pasta frontend
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento local (http://localhost:4200)
npm run start

# Compilar para produção (gera os arquivos estáticos na pasta /dist)
npm run build
```
