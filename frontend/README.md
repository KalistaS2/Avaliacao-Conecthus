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
│   ├── auth.service.ts            # Gerenciamento de sessão, login/logout e localStorage
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
│   └── auth.guard.ts              # Proteção de rotas privadas (authGuard) e rota pública (guestGuard)
├── pages/                         # Páginas/Views principais da aplicação
│   ├── login/                     # Tela de autenticação por E-mail ou Matrícula
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

- **`HeaderComponent`**: Barra superior fixa presente em todas as páginas privadas. Exibe o nome da seção ativa, um badge circular com as iniciais do usuário logado (ex: "MS" para Milena Santana) e um menu dropdown de perfil com acionamento para encerramento de sessão (Logout). Possui detecção de clique fora do componente (*click-outside listener*) para fechamento automático.
- **`SidebarComponent`**: Barra de navegação lateral retrátil. Integra-se ao `SidebarService` usando Angular Signals. Altera dinamicamente entre a logo completa e o ícone simplificado durante a animação de expansão (300ms), com botões de atalho para Home, Usuários, Cadastro e Sair.
- **`PopupComponent`**: Modal flutuante elegante para exibição detalhada de todos os campos de um usuário selecionado (ID, Nome, E-mail, Matrícula, Data de Criação e Última Atualização).
- **`PopupConfirmacaoComponent`**: Modal de confirmação reutilizável com tratamento de ações críticas (como confirmação de exclusão de usuários ou descarte de alterações no formulário).
- **`NotificacaoComponent`**: Toast reativo de alertas visuais posicionado no canto da tela. Suporta 4 estilos (`success`, `error`, `info`, `warning`) com temporizador de auto-dismiss inteligente e sem vazamento de memória.

---

## 🔒 Guardas de Rota (`/guards`)

- **`authGuard`**: Impede o acesso de usuários não autenticados a páginas restritas (`/home`, `/usuarios`, `/cadastro-usuario`), redirecionando-os para a página de login com mensagem de aviso.
- **`guestGuard`**: Impede que usuários já logados acessem a página de `/login`, redirecionando-os automaticamente para o painel inicial (`/home`).

---

## 📄 Páginas da Aplicação (`/pages`)

1. **`LoginComponent` (`/login`)**:
   - Tela de apresentação institucional da Conecthus com formulário de autenticação.
   - Permite autenticação por **E-mail** ou **Matrícula** e **Senha**.
   - Redireciona automaticamente para o dashboard (`/home`) ao efetuar login com sucesso.

2. **`HomeComponent` (`/home`)**:
   - Dashboard principal com saudação personalizada utilizando o primeiro nome do usuário logado.
   - Exibe a data atual formatada em português.
   - Cards de acesso rápido para navegação direta para a lista ou cadastro de novos usuários.

3. **`UsuariosComponent` (`/usuarios`)**:
   - Tabela de dados moderna para gerenciamento completo dos usuários.
   - **Pesquisa em tempo real**: Filtro instantâneo por nome.
   - **Controle de Paginação**: Seletor dinâmico de quantidade de itens por página (ex: 5, 10, 20) e navegação entre páginas.
   - **Ações**:
     - *Visualizar*: Abre a modal `PopupComponent` com dados completos.
     - *Editar*: Redireciona para o formulário `/cadastro-usuario?id=X`.
     - *Excluir*: Dispara a modal `PopupConfirmacaoComponent`. Caso o usuário logado exclua seu próprio perfil, a sessão é encerrada de forma segura e o usuário é redirecionado à página de login.

4. **`CadastroUsuarioComponent` (`/cadastro-usuario`)**:
   - Formulário unificado para **Criação** e **Edição** de usuários.
   - **Validações Reativas Estritas**:
     - **Nome**: Apenas letras e espaços (higienização em tempo de digitação via regex).
     - **E-mail**: Formato de e-mail válido.
     - **Matrícula**: Apenas números (higienização em tempo de digitação via regex).
     - **Senha**: Mínimo de 6 caracteres alfanuméricos com controle de ocultar/exibir texto.
     - **Confirmar Senha**: Validador customizado (`passwordMatchValidator`) exigindo igualdade perfeita com a senha informada.
   - **Cancelamento Seguro**: Botão de cancelar aciona modal de confirmação antes de descartar dados preenchidos.

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
