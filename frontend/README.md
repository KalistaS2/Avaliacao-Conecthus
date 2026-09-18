# Frontend - Conecthus SPA (Angular)

Interface web responsiva e moderna desenvolvida em **Angular** para a aplicação de gerenciamento de usuários Conecthus.

## 📁 Arquitetura e Organização de Diretórios
O projeto segue rigorosamente a estrutura modular delimitada no edital:

```text
src/app/
├── api/                      # Services HTTP de integração com o backend (/users, /auth)
├── components/               # Componentes reutilizáveis e isolados (Sidebar, Popup, Notificacao, etc.)
├── pages/                    # Páginas principais da aplicação (Login, Home, Usuarios, Cadastro-Usuario)
└── environments/             # Configurações de variáveis de ambiente (environment.ts, environment.development.ts)
```

---

## 🎨 Componentes Reutilizáveis (`/components`)
- **`SidebarComponent`**: Menu de navegação lateral fixa com logotipo Conecthus, destaques de rotas e logout.
- **`PopupComponent`**: Modal genérico para visualização e edição rápida dos detalhes do usuário.
- **`PopupConfirmacaoComponent`**: Modal de confirmação para ações de cancelamento/exclusão com botões ("Não" / "Sim").
- **`NotificacaoComponent`**: Banner Toast de alerta/feedback visual para o usuário (sucesso, erro, info).

---

## 📄 Páginas da Aplicação (`/pages`)
1. **`LoginComponent` (`/login`)**:
   - Tela de apresentação (Splash/Logo Conecthus).
   - Formulário de login com E-mail/Matrícula e Senha.
2. **`HomeComponent` (`/home`)**:
   - Painel inicial com mensagem personalizada de boas-vindas ao usuário logado e data.
3. **`UsuariosComponent` (`/usuarios`)**:
   - Tabela de listagem com pesquisa por nome em tempo real, paginação e botões de ação (Visualizar, Editar, Excluir).
   - Trata o estado com dados e o estado de "Nenhum Resultado Encontrado".
4. **`CadastroUsuarioComponent` (`/cadastro-usuario`)**:
   - Formulário de cadastro/edição contendo validações reativas estritas:
     - **Nome**: Apenas letras
     - **E-mail**: Formato de e-mail válido
     - **Matrícula**: Apenas números
     - **Senha**: Alfanuméricos de 6 dígitos
     - **Todos os campos são obrigatórios**
   - Botão de salvar apenas habilitado quando todos os campos estiverem válidos.

---

## 🚀 Scripts do Angular

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (http://localhost:4200)
npm run start

# Executar a compilação de produção
npm run build
```
