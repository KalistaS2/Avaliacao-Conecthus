import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../api/auth.service';
import { NotificacaoComponent } from '../../components/notificacao/notificacao.component';

/**
 * Componente da página de Login e apresentação (Splash Screen).
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificacaoComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  /** Campo de identificação (E-mail ou Matrícula) */
  public loginInput: string = '';

  /** Campo de senha de acesso */
  public passwordInput: string = '';

  /** Estado de carregamento do formulário */
  public isLoading: boolean = false;

  /** Mensagem de erro ao falhar o login */
  public errorMessage: string = '';

  /** Controla se a tela de splash inicial está sendo exibida */
  public isSplashVisible: boolean = false;

  /** Título da notificação via toast */
  public notificationTitle: string = '';

  /** Mensagem de notificação via toast */
  public notificationMessage: string = '';

  /** Tipo de notificação (info, success, warning, error) */
  public notificationType: 'success' | 'error' | 'info' | 'warning' = 'info';

  /**
   * Construtor da LoginComponent.
   * @param authService Serviço de autenticação.
   * @param router Serviço de roteamento do Angular.
   * @param route Rota ativa para leitura de parâmetros de URL.
   * @param cdr Detector de mudanças do Angular.
   */
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
  ) { }

  /**
   * Lifecycle hook inicial executado ao carregar a página de login.
   * Lê queryParams para exibir toasts (ex: confirmação de exclusão de conta).
   * @returns Void
   */
  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['message']) {
        const type = (params['type'] as 'success' | 'error' | 'info' | 'warning') || 'info';
        const title = params['title'] || (type === 'error' ? 'Erro' : (type === 'warning' ? 'Atenção' : (type === 'info' ? 'Informação' : 'Sucesso')));
        this.showNotification(params['message'], type, title);
      }
    });
  }

  /**
   * Processa o envio do formulário de autenticação.
   * @returns Void
   */
  public onSubmit(): void {
    if (!this.loginInput.trim() || !this.passwordInput.trim()) {
      this.errorMessage = 'Preencha todos os campos para prosseguir.';
      this.showNotification(this.errorMessage, 'error', 'Erro no Formulário');
      this.cdr.markForCheck();
      return;
    }

    if (this.passwordInput.trim().length < 6) {
      this.errorMessage = 'A senha deve conter no mínimo 6 dígitos.';
      this.showNotification(this.errorMessage, 'error', 'Erro de Validação');
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
          this.errorMessage = 'Servidor backend não encontrado em http://localhost:3000. Inicie o backend com "npm run start:dev".';
        } else if (err?.error?.message) {
          this.errorMessage = Array.isArray(err.error.message) ? err.error.message[0] : err.error.message;
        } else {
          this.errorMessage = 'Falha ao autenticar. Verifique seus dados e tente novamente.';
        }
        this.showNotification(this.errorMessage, 'error', 'Erro de Autenticação');
        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Exibe o banner de notificação temporário na tela.
   * @param message Texto do alerta.
   * @param type Tipo visual (success, error, info, warning).
   * @param title Título do alerta.
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
    }, 5000);
  }

  /**
   * Alterna manualmente a exibição entre o Splash e a tela de Login.
   * @returns Void
   */
  public toggleSplash(): void {
    this.isSplashVisible = !this.isSplashVisible;
    this.cdr.markForCheck();
  }
}
