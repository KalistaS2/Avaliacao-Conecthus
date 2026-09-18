import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { NotificacaoComponent } from '../../components/notificacao/notificacao.component';
import { AuthService } from '../../api/auth.service';
import { SidebarService } from '../../api/sidebar.service';
import { NotificationService, NotificationType } from '../../api/notification.service';

/**
 * Componente da Página Inicial (Home / Dashboard).
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent, NotificacaoComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  /** Data atual formatada em português */
  public currentDate: string;

  /**
   * Construtor da HomeComponent.
   * @param authService Serviço de autenticação para dados do usuário logado.
   * @param sidebarService Serviço do estado da sidebar retrátil.
   * @param notificationService Serviço global de notificações/toasts.
   * @param route Rota ativa para leitura de parâmetros de URL.
   * @param cdr Detector de mudanças do Angular.
   */
  constructor(
    public readonly authService: AuthService,
    public readonly sidebarService: SidebarService,
    public readonly notificationService: NotificationService,
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
        const type = (params['type'] as NotificationType) || 'info';
        const title = params['title'] || '';
        this.notificationService.show(params['message'], type, title);
      }
    });
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
