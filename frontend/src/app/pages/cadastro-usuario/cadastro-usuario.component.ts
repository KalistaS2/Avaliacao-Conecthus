import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { PopupConfirmacaoComponent } from '../../components/popup-confirmacao/popup-confirmacao.component';
import { NotificacaoComponent } from '../../components/notificacao/notificacao.component';
import { UserService } from '../../api/user.service';
import { SidebarService } from '../../api/sidebar.service';
import { NotificationService } from '../../api/notification.service';

/**
 * Componente da página de Cadastro e Edição de Usuários com validações de formulário.
 */
@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    SidebarComponent,
    HeaderComponent,
    PopupConfirmacaoComponent,
    NotificacaoComponent,
  ],
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css'],
})
export class CadastroUsuarioComponent implements OnInit {
  /** Grupo de formulário reativo */
  public userForm!: FormGroup;

  /** Modo de edição ativado se um ID for fornecido nos queryParams */
  public isEditMode: boolean = false;

  /** ID do usuário sendo editado */
  public userId: number | null = null;

  /** Estado de envio do formulário */
  public isLoading: boolean = false;

  /** Controle de exibição da modal de confirmação de cancelamento */
  public isCancelModalOpen: boolean = false;

  /** Controla a visibilidade do campo de senha */
  public showPassword: boolean = false;

  /** Controla a visibilidade do campo de repetição de senha */
  public showRepeatPassword: boolean = false;

  /**
   * Construtor da CadastroUsuarioComponent.
   * @param fb FormBuilder do Angular para construção de formulários reativos.
   * @param userService Serviço de operações com a API de Usuários.
   * @param sidebarService Serviço do estado da sidebar retrátil.
   * @param notificationService Serviço global de notificações/toasts.
   * @param router Roteador do Angular.
   * @param route Rota ativa para leitura de parâmetros de URL.
   * @param cdr Detector de mudanças do Angular.
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    public readonly sidebarService: SidebarService,
    public readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.initForm();
  }

  /**
   * Lifecycle hook inicial para verificação de modo edição.
   * @returns Void
   */
  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.userId = parseInt(params['id'], 10);
        this.isEditMode = true;
        this.loadUserData(this.userId);
      }
    });
  }

  /**
   * Alterna a visibilidade da senha no campo de texto.
   * @returns Void
   */
  public toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Alterna a visibilidade da confirmação de senha no campo de texto.
   * @returns Void
   */
  public toggleShowRepeatPassword(): void {
    this.showRepeatPassword = !this.showRepeatPassword;
  }

  /**
   * Restringe a entrada do campo Nome para permitir apenas letras e espaços.
   * Sanitiza reativamente no FormControl do formulário.
   * @param event Evento de entrada de texto.
   * @returns Void
   */
  public onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s]/g, '');
    if (input.value !== sanitized) {
      this.userForm.get('name')?.setValue(sanitized);
    }
  }

  /**
   * Restringe a entrada do campo Matrícula para permitir apenas números.
   * Sanitiza reativamente no FormControl do formulário.
   * @param event Evento de entrada de texto.
   * @returns Void
   */
  public onRegistrationNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/\D/g, '');
    if (input.value !== sanitized) {
      this.userForm.get('registrationNumber')?.setValue(sanitized);
    }
  }

  /**
   * Inicializa o formulário com as regras de validação estritas exigidas.
   * @returns Void
   */
  private initForm(): void {
    this.userForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
          ],
        ],
        registrationNumber: [
          '',
          [
            Validators.required,
            Validators.pattern(/^\d+$/),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^[a-zA-Z0-9]+$/),
          ],
        ],
        repeatPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
          ],
        ],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  /**
   * Validador customizado para garantir que 'Senha' e 'Repetir Senha' sejam idênticas.
   * @param group Grupo de formulário contendo os campos de senha.
   * @returns Objeto de erro se não coincidirem ou null.
   */
  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { passwordMismatch: true };
  }

  /**
   * Carrega os dados do usuário para preenchimento no formulário de edição.
   * @param id Identificador do usuário.
   * @returns Void
   */
  private loadUserData(id: number): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          registrationNumber: user.registrationNumber,
          password: 'senha123',
          repeatPassword: 'senha123',
        });
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.show('Erro ao carregar dados do usuário.', 'error');
        this.cdr.markForCheck();
        this.router.navigate(['/usuarios']);
      },
    });
  }

  /**
   * Processa o envio do formulário de criação ou atualização.
   * @returns Void
   */
  public onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.notificationService.show(
        'Preencha os campos obrigatórios corretamente antes de enviar.',
        'error',
        'Erro no Formulário'
      );
      return;
    }

    this.isLoading = true;
    this.cdr.markForCheck();
    const { repeatPassword, ...payload } = this.userForm.value;

    if (this.isEditMode && this.userId) {
      this.userService.updateUser(this.userId, payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.cdr.markForCheck();
          this.router.navigate(['/usuarios'], {
            queryParams: { message: 'Usuário atualizado com sucesso!' },
          });
        },
        error: (err) => {
          this.isLoading = false;
          const msg = err?.error?.message || 'Erro ao atualizar usuário.';
          this.notificationService.show(
            Array.isArray(msg) ? msg[0] : msg,
            'error',
            'Erro na Atualização'
          );
          this.cdr.markForCheck();
        },
      });
    } else {
      this.userService.createUser(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.cdr.markForCheck();
          this.router.navigate(['/usuarios'], {
            queryParams: { message: 'Cadastro Realizado!' },
          });
        },
        error: (err) => {
          this.isLoading = false;
          const msg = err?.error?.message || 'Erro ao cadastrar usuário.';
          this.notificationService.show(
            Array.isArray(msg) ? msg[0] : msg,
            'error',
            'Erro no Cadastro'
          );
          this.cdr.markForCheck();
        },
      });
    }
  }

  /**
   * Abre o modal de confirmação ao clicar em Cancelar.
   * @returns Void
   */
  public openCancelModal(): void {
    this.isCancelModalOpen = true;
  }

  /**
   * Fecha a modal de confirmação e permanece na tela.
   * @returns Void
   */
  public dismissCancelModal(): void {
    this.isCancelModalOpen = false;
  }

  /**
   * Confirma o cancelamento e navega de volta para a lista de usuários.
   * @returns Void
   */
  public confirmCancel(): void {
    this.isCancelModalOpen = false;
    const msg = this.isEditMode ? 'Edição cancelada' : 'Cadastro cancelado';
    this.router.navigate(['/usuarios'], {
      queryParams: { message: msg, type: 'warning' },
    });
  }
}
