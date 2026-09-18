import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../api/auth.service';
import { NotificationService } from '../../api/notification.service';
import { NotificacaoComponent } from '../../components/notificacao/notificacao.component';

/**
 * Componente da Página de Redefinição/Recuperação de Senha.
 * Exibe a interface com o mesmo layout da tela de login e processa a nova senha do usuário.
 */
@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NotificacaoComponent],
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.css'],
})
export class RecuperarSenhaComponent implements OnInit {
  /** Formulário reativo de redefinição de senha */
  public resetForm!: FormGroup;

  /** Identificador do usuário (e-mail ou matrícula) vindo da URL */
  public userLogin: string = '';

  /** Matrícula do usuário exibida no subtítulo */
  public registrationNumber: string = '';

  /** Token de verificação de recuperação */
  public token: string = '';

  /** Controla o estado de envio do formulário */
  public isLoading: boolean = false;

  /** Controla a exibição da senha */
  public showPassword: boolean = false;

  /** Controla a exibição da confirmação de senha */
  public showRepeatPassword: boolean = false;

  /** Mensagem de erro ao falhar o envio */
  public errorMessage: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    public readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.initForm();
  }

  /**
   * Lifecycle hook inicial. Lê os parâmetros de URL da recuperação de senha.
   * @returns Void
   */
  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.userLogin = params['login'] || params['email'] || '';
      this.token = params['token'] || '';
      this.registrationNumber = params['registrationNumber'] || '';
    });
  }

  /**
   * Inicializa o formulário com regras de validação para nova senha.
   * @returns Void
   */
  private initForm(): void {
    this.resetForm = this.fb.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
            Validators.pattern(/^[a-zA-Z0-9]{6}$/),
          ],
        ],
        repeatPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
          ],
        ],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  /**
   * Validador de correspondência entre senha e confirmação de senha.
   * @param group FormGroup com os campos de senha.
   * @returns Objeto de erro ou null.
   */
  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('newPassword')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { passwordMismatch: true };
  }

  /**
   * Alterna a visibilidade da nova senha.
   * @returns Void
   */
  public toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Alterna a visibilidade da confirmação de senha.
   * @returns Void
   */
  public toggleShowRepeatPassword(): void {
    this.showRepeatPassword = !this.showRepeatPassword;
  }

  /**
   * Envia a redefinição de senha para o backend.
   * @returns Void
   */
  public onSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      this.notificationService.show('Preencha os campos de senha corretamente.', 'error', 'Erro de Validação');
      return;
    }

    const { newPassword } = this.resetForm.value;
    const loginTarget = this.userLogin || this.registrationNumber;

    if (!loginTarget || !this.token) {
      this.errorMessage = 'Link de recuperação inválido ou expirado. Solicite a recuperação novamente.';
      this.notificationService.show(this.errorMessage, 'error', 'Erro de Link');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.authService.resetPassword(loginTarget, this.token, newPassword).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.cdr.markForCheck();
        this.router.navigate(['/login'], {
          queryParams: {
            message: res.message || 'Senha redefinida com sucesso! Faça login com sua nova senha.',
            type: 'success',
          },
        });
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err?.error?.message || 'Erro ao redefinir a senha. Tente novamente.';
        this.errorMessage = Array.isArray(msg) ? msg[0] : msg;
        this.notificationService.show(this.errorMessage, 'error', 'Erro no Envio');
        this.cdr.markForCheck();
      },
    });
  }
}
