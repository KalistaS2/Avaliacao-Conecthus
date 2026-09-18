import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../api/auth.service';
import { SidebarService } from '../../api/sidebar.service';

/**
 * Componente isolado de navegação lateral (Sidebar) retrátil.
 * Exibido em todas as páginas da aplicação para usuários autenticados.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  /** Controla se a logo completa deve ser exibida (troca diferida para expansão) */
  public showFullLogo: boolean = true;

  /** Timer para atrasar a exibição da logo até o fim da transição de expansão */
  private logoTimer: any = null;

  /**
   * Construtor da SidebarComponent.
   * @param authService Serviço de autenticação.
   * @param sidebarService Serviço do estado retrátil da sidebar.
   * @param router Roteador do Angular para navegação.
   * @param cdr Detector de mudanças do Angular.
   */
  constructor(
    public readonly authService: AuthService,
    public readonly sidebarService: SidebarService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  /**
   * Lifecycle hook de inicialização.
   * @returns Void
   */
  public ngOnInit(): void {
    this.showFullLogo = !this.sidebarService.isCollapsed();
  }

  /**
   * Lifecycle hook de destruição.
   * @returns Void
   */
  public ngOnDestroy(): void {
    if (this.logoTimer) {
      clearTimeout(this.logoTimer);
    }
  }

  /**
   * Alterna a expansão ou recolhimento da sidebar.
   * Troca a imagem para logo completa apenas após o término da animação de expansão (300ms).
   * Para recolher, altera a imagem imediatamente.
   * @returns Void
   */
  public toggleSidebar(): void {
    if (this.logoTimer) {
      clearTimeout(this.logoTimer);
    }

    const currentlyCollapsed = this.sidebarService.isCollapsed();
    this.sidebarService.toggle();

    if (currentlyCollapsed) {
      // Expandindo: mantém o ícone durante a transição e troca para a logo completa ao finalizar (300ms)
      this.showFullLogo = false;
      this.logoTimer = setTimeout(() => {
        this.showFullLogo = true;
        this.cdr.markForCheck();
      }, 300);
    } else {
      // Recolhendo: troca imediatamente para o ícone
      this.showFullLogo = false;
      this.cdr.markForCheck();
    }
  }

  /**
   * Executa a saída (logout) do usuário logado e redireciona para a tela de login.
   * @returns Void
   */
  public onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
