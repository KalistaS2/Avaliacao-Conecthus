import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NotificacaoComponent } from '../../components/notificacao/notificacao.component';
import { AuthService } from '../../api/auth.service';
import { SidebarService } from '../../api/sidebar.service';

/**
 * Componente da Página Inicial (Home / Dashboard).
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, NotificacaoComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  /** Data atual formatada em português */
  public currentDate: string;

  /** Título do toast de notificação */
  public notificationTitle: string = '';

  /** Mensagem do toast de notificação */
  public notificationMessage: string = '';

  /** Tipo visual da notificação */
  public notificationType: 'success' | 'error' | 'info' | 'warning' = 'info';

  /**
   * Construtor da HomeComponent.
   * @param authService Serviço de autenticação para dados do usuário logado.
   * @param sidebarService Serviço do estado da sidebar retrátil.
   * @param route Rota ativa para leitura de parâmetros de URL.
   * @param cdr Detector de mudanças do Angular.
   */
  constructor(
    public readonly authService: AuthService,
    public readonly sidebarService: SidebarService,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
  ) {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    this.currentDate = today.toLocaleDateString('pt-BR', options);
  }

  /**
   * Lifecycle hook inicial. Lê queryParams para exibir notificações se houver.
   * @returns Void
   */
  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['message']) {
        const type = (params['type'] as 'success' | 'error' | 'info' | 'warning') || 'info';
        const title = params['title'] || '';
        this.showNotification(params['message'], type, title);
      }
    });
  }

  /**
   * Exibe o banner de notificação temporário na tela.
   * @param message Texto do alerta.
   * @param type Tipo visual (success, error, info, warning).
   * @param title Título opcional do alerta.
   * @returns Void
   */
  public showNotification(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'success',
    title: string = ''
  ): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.notificationTitle = title || (type === 'error' ? 'Erro' : (type === 'warning' ? 'Atenção' : (type === 'info' ? 'Informação' : 'Sucesso')));
    this.cdr.markForCheck();
    setTimeout(() => {
      this.notificationMessage = '';
      this.notificationTitle = '';
      this.cdr.markForCheck();
    }, 4000);
  }

  /**
   * Retorna o primeiro nome do usuário logado para saudação.
   * @returns Nome do usuário ou 'Usuário'.
   */
  public getUserFirstName(): string {
    const user = this.authService.currentUser();
    if (!user || !user.name) return 'Usuário';
    return user.name.split(' ')[0];
  }
}
