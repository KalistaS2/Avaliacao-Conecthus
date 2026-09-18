import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { PopupComponent } from '../../components/popup/popup.component';
import { PopupConfirmacaoComponent } from '../../components/popup-confirmacao/popup-confirmacao.component';
import { NotificacaoComponent } from '../../components/notificacao/notificacao.component';
import { UserService } from '../../api/user.service';
import { SidebarService } from '../../api/sidebar.service';
import { AuthService } from '../../api/auth.service';
import { NotificationService, NotificationType } from '../../api/notification.service';
import { User } from '../../api/models';

/**
 * Componente da página de Listagem de Usuários (Tabela, Pesquisa, Paginação e Ações).
 */
@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    SidebarComponent,
    HeaderComponent,
    PopupComponent,
    PopupConfirmacaoComponent,
    NotificacaoComponent,
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  /** Termo de pesquisa por nome */
  public searchTerm: string = '';

  /** Lista de usuários exibidos na página atual */
  public users: User[] = [];

  /** Total de registros encontrados */
  public totalUsers: number = 0;

  /** Página atual da paginação */
  public currentPage: number = 1;

  /** Quantidade de itens por página */
  public pageSize: number = 5;

  /** Total de páginas disponíveis */
  public totalPages: number = 1;

  /** Estado de carregamento dos dados da API */
  public isLoading: boolean = false;

  /** Usuário selecionado para visualização no modal Popup */
  public selectedUser: User | null = null;

  /** Controle de exibição do popup de detalhes do usuário */
  public isDetailModalOpen: boolean = false;

  /** Usuário selecionado para exclusão */
  public userToDelete: User | null = null;

  /** Controle de exibição do popup de confirmação de exclusão */
  public isDeleteModalOpen: boolean = false;

  /**
   * Construtor da UsuariosComponent.
   * @param userService Serviço de requisições de usuários.
   * @param sidebarService Serviço do estado da sidebar retrátil.
   * @param authService Serviço de autenticação e sessão do usuário.
   * @param notificationService Serviço global de notificações/toasts.
   * @param router Roteador do Angular.
   * @param route Rota ativa para leitura de parâmetros de URL.
   * @param cdr Detector de mudanças do Angular.
   */
  constructor(
    private readonly userService: UserService,
    public readonly sidebarService: SidebarService,
    private readonly authService: AuthService,
    public readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  /**
   * Lifecycle hook inicial executado ao carregar a página.
   * Exibe avisos via Toast caso haja mensagem via parâmetros de navegação (ex: após cadastro/edição/cancelamento).
   * @returns Void
   */
  public ngOnInit(): void {
    this.loadUsers();
    this.route.queryParams.subscribe((params) => {
      if (params['message']) {
        const type = (params['type'] as NotificationType) || 'success';
        const title = params['title'] || '';
        this.notificationService.show(params['message'], type, title);
      }
    });
  }

  /**
   * Carrega a lista de usuários paginada e filtrada a partir do backend.
   * @returns Void
   */
  public loadUsers(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.userService.getUsers(this.searchTerm, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.users = res.data;
        this.totalUsers = res.total;
        this.currentPage = res.page;
        this.totalPages = res.totalPages;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.show('Erro ao carregar lista de usuários.', 'error');
        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Executa a filtragem por nome ao digitar na caixa de busca.
   * @returns Void
   */
  public onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  /**
   * Trata a alteração da quantidade de itens exibidos por página no dropdown.
   * Exibe notificação informando a alteração da quantidade por página.
   * @returns Void
   */
  public onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadUsers();
    this.notificationService.show(`Exibindo ${this.pageSize} itens por página`, 'info');
  }

  /**
   * Altera a página atual da listagem.
   * Exibe notificação informando a alteração da página.
   * @param page Número da nova página desejada.
   * @returns Void
   */
  public changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.loadUsers();
    this.notificationService.show(`Página ${page} de ${this.totalPages}`, 'info');
  }

  /**
   * Abre o modal Popup para visualização detalhada do usuário.
   * @param user Usuário a ser visualizado.
   * @returns Void
   */
  public viewUserDetails(user: User): void {
    this.selectedUser = user;
    this.isDetailModalOpen = true;
  }

  /**
   * Fecha o modal de detalhes do usuário.
   * @returns Void
   */
  public closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedUser = null;
  }

  /**
   * Redireciona para a página de edição de usuário com os dados preenchidos.
   * @param user Usuário a ser editado.
   * @returns Void
   */
  public editUser(user: User): void {
    this.router.navigate(['/cadastro-usuario'], { queryParams: { id: user.id } });
  }

  /**
   * Abre o modal de confirmação para a exclusão do usuário.
   * @param user Usuário que se deseja excluir.
   * @returns Void
   */
  public openDeleteModal(user: User): void {
    this.userToDelete = user;
    this.isDeleteModalOpen = true;
  }

  /**
   * Cancela a exclusão e fecha o modal de confirmação.
   * @returns Void
   */
  public cancelDelete(): void {
    this.isDeleteModalOpen = false;
    this.userToDelete = null;
  }

  /**
   * Verifica se o usuário selecionado para exclusão é o próprio usuário atualmente logado.
   * @returns Booleano indicando se é uma auto-exclusão.
   */
  public isDeletingSelf(): boolean {
    if (!this.userToDelete) return false;
    const currentUser = this.authService.currentUser();
    return !!currentUser && String(currentUser.id) === String(this.userToDelete.id);
  }

  /**
   * Retorna o título da modal de confirmação de exclusão.
   * @returns String com o título personalizado.
   */
  public getDeleteModalTitle(): string {
    return this.isDeletingSelf()
      ? 'Deseja excluir o seu próprio usuário?'
      : 'Deseja excluir este usuário?';
  }

  /**
   * Retorna a descrição detalhada da modal de confirmação de exclusão.
   * @returns String com a mensagem personalizada de impacto.
   */
  public getDeleteModalDescription(): string {
    if (!this.userToDelete) return '';
    return this.isDeletingSelf()
      ? 'Sua conta será encerrada e deslogada, e seus dados serão removidos permanentemente.'
      : `O usuário ${this.userToDelete.name} será removido permanentemente.`;
  }

  /**
   * Confirma e executa a remoção do usuário no backend.
   * Caso o usuário esteja excluindo o próprio perfil, efetua o logout primeiro e depois remove o registro no banco.
   * @returns Void
   */
  public confirmDelete(): void {
    if (!this.userToDelete) return;

    const userToDelete = this.userToDelete;
    const currentUser = this.authService.currentUser();
    const isSelfDelete = !!currentUser && String(currentUser.id) === String(userToDelete.id);

    this.isDeleteModalOpen = false;

    if (isSelfDelete) {
      this.authService.logout();

      this.userService.deleteUser(userToDelete.id).subscribe({
        next: () => {
          this.userToDelete = null;
          this.router.navigate(['/login'], {
            queryParams: { message: 'Sua conta foi excluída com sucesso.', type: 'info' },
          });
        },
        error: () => {
          this.userToDelete = null;
          this.router.navigate(['/login'], {
            queryParams: { message: 'Erro ao excluir usuário no banco.', type: 'error' },
          });
        },
      });
    } else {
      this.userService.deleteUser(userToDelete.id).subscribe({
        next: () => {
          this.notificationService.show('Usuário excluído com sucesso!', 'success');
          this.userToDelete = null;
          this.loadUsers();
          this.cdr.markForCheck();
        },
        error: () => {
          this.notificationService.show('Erro ao excluir usuário.', 'error');
          this.userToDelete = null;
          this.cdr.markForCheck();
        },
      });
    }
  }

  /**
   * Formata uma string de data para o formato DD/MM/YYYY.
   * @param dateStr Data no formato ISO.
   * @returns Data formatada em português.
   */
  public formatDate(dateStr?: string): string {
    if (!dateStr) {
      const today = new Date();
      return today.toLocaleDateString('pt-BR');
    }
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('pt-BR');
  }

  /**
   * Retorna a data da última edição formatada ou 'Nenhuma' se o registro nunca tiver sido editado.
   * @param createdStr Data de criação.
   * @param updatedStr Data de atualização.
   * @returns Data de atualização ou 'Nenhuma'.
   */
  public formatUpdateDate(createdStr?: string, updatedStr?: string): string {
    if (!updatedStr || !createdStr) return 'Nenhuma';
    const created = new Date(createdStr).getTime();
    const updated = new Date(updatedStr).getTime();

    if (Math.abs(updated - created) < 2000) {
      return 'Nenhuma';
    }
    return this.formatDate(updatedStr);
  }
}
