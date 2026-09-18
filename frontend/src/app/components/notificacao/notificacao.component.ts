import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente Toast / Notification Banner para mensagens de feedback.
 */
@Component({
  selector: 'app-notificacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificacao.component.html',
  styleUrls: ['./notificacao.component.css'],
})
export class NotificacaoComponent {
  /** Título opcional da notificação (ex: "Erro no Formulário") */
  @Input() title: string = '';

  /** Mensagem a ser exibida no Toast */
  @Input() message: string = '';

  /** Tipo de notificação: success, error, info, warning */
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'success';

  /** Evento disparado quando o Toast é fechado */
  @Output() dismiss = new EventEmitter<void>();

  /**
   * Dispara o fechamento da notificação.
   * @returns Void
   */
  public onDismiss(): void {
    this.dismiss.emit();
  }
}
