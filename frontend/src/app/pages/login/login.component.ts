import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../api/auth.service';
import { NotificationService, NotificationType } from '../../api/notification.service';
import { NotificacaoComponent } from '../../components/notificacao/notificacao.component';

/**
 * Componente da página de Login e Recuperação de Senha (Fluxo Esqueci minha senha).
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NotificacaoComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  /** Modo de visualização ativo ('login' ou 'forgot') */
  public viewMode: 'login' | 'forgot' = 'login';

  /** Campo de identificação do login (E-mail ou Matrícula) */
  public loginInput: string = '';

  /** Campo de senha de acesso */
  public passwordInput: string = '';

  /** Campo de e-mail para a recuperação de senha */
  public forgotEmailInput: string = '';

  /** Estado de carregamento do formulário */
  public isLoading: boolean = false;

  /** Mensagem de erro ao falhar */
  public errorMessage: string = '';

  /** Controle de exibição do popup de notificação de e-mail não implementado */
  public isPopupOpen: boolean = false;

  /** Título exibido no Popup */
  public popupTitle: string = '';

  /** Descrição exibida no Popup */
  public popupDescription: string = '';

  /** URL do link de recuperação para o botão do Popup */
  public popupResetUrl: string = '';

  /**
   * Construtor da LoginComponent.
   * @param authService Serviço de autenticação.
   * @param notificationService Serviço global de notificações/toasts.
   * @param router Serviço de roteamento do Angular.
   * @param route Rota ativa para leitura de parâmetros de URL.
   * @param cdr Detector de mudanças do Angular.
   */
  constructor(
    private readonly authService: AuthService,
    public readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
  ) { }

  /**
   * Lifecycle hook inicial. Lê queryParams para toasts.
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
   * Alterna entre a tela de Login e a tela de Esqueci minha Senha.
   * @param mode Modo desejado ('login' ou 'forgot').
   */
  public toggleViewMode(mode: 'login' | 'forgot'): void {
    this.viewMode = mode;
    this.errorMessage = '';
    this.cdr.markForCheck();
  }

  /**
   * Processa o envio do formulário de autenticação (Login).
   * @returns Void
   */
  public onSubmit(): void {
    if (!this.loginInput.trim() || !this.passwordInput.trim()) {
      this.errorMessage = 'Preencha todos os campos para prosseguir.';
      this.notificationService.show(this.errorMessage, 'error', 'Erro no Formulário');
      this.cdr.markForCheck();
      return;
    }

    if (this.passwordInput.trim().length !== 6) {
      this.errorMessage = 'deve conter 6 caracteres';
      this.notificationService.show(this.errorMessage, 'error', 'Erro de Validação');
      this.cdr.markForCheck();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.authService.login(this.loginInput.trim(), this.passwordInput.trim()).subscribe({
      next: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err?.status === 0) {
          this.errorMessage =
            'Servidor backend não encontrado em http://localhost:3000. Inicie o backend com "npm run start:dev".';
        } else if (err?.error?.message) {
          this.errorMessage = Array.isArray(err.error.message)
            ? err.error.message[0]
            : err.error.message;
        } else {
          this.errorMessage = 'Falha ao autenticar. Verifique seus dados e tente novamente.';
        }
        this.notificationService.show(this.errorMessage, 'error', 'Erro de Autenticação');
        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Processa a solicitação do formulário "Esqueci minha senha".
   * Caso o e-mail exista no banco de dados, exibe a modal Popup com o link da página de recuperação.
   * @returns Void
   */
  public onForgotPasswordSubmit(): void {
    if (!this.forgotEmailInput.trim()) {
      this.errorMessage = 'Informe o seu e-mail para recuperar a senha.';
      this.notificationService.show(this.errorMessage, 'error', 'Erro de Validação');
      this.cdr.markForCheck();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.authService.forgotPassword(this.forgotEmailInput.trim()).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.popupTitle = 'feature de envio de e-mail não implementada.';
        this.popupDescription = `acesso a pagina de recuperação de senha do usuario ${res.registrationNumber}.`;
        this.popupResetUrl = res.resetUrl;
        this.isPopupOpen = true;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err?.error?.message || 'Nenhum usuário foi encontrado com o e-mail informado.';
        this.errorMessage = Array.isArray(msg) ? msg[0] : msg;
        this.notificationService.show(this.errorMessage, 'error', 'Erro de Busca');
        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Fecha o modal Popup e navega para a página de recuperação de senha.
   * @returns Void
   */
  public closePopupAndNavigate(): void {
    this.isPopupOpen = false;
    if (this.popupResetUrl) {
      this.router.navigateByUrl(this.popupResetUrl);
    }
  }

  /**
   * Fecha o modal Popup sem navegar.
   * @returns Void
   */
  public closePopup(): void {
    this.isPopupOpen = false;
  }
}
