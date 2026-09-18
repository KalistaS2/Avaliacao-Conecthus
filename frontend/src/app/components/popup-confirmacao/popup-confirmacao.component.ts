import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente modal de confirmação para ações de confirmação/cancelamento/exclusão.
 */
@Component({
  selector: 'app-popup-confirmacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-confirmacao.component.html',
  styleUrls: ['./popup-confirmacao.component.css'],
})
export class PopupConfirmacaoComponent {
  /** Visibilidade da modal */
  @Input() isOpen: boolean = false;

  /** Título/Pergunta principal */
  @Input() title: string = 'Deseja cancelar?';

  /** Subtítulo descritivo */
  @Input() description: string = 'Os dados inseridos não serão salvos';

  /** Evento emitido se o usuário confirmar ("Sim") */
  @Output() confirm = new EventEmitter<void>();

  /** Evento emitido se o usuário rejeitar ("Não") */
  @Output() cancel = new EventEmitter<void>();

  /**
   * Trata o clique no botão de confirmação ("Sim").
   * @returns Void
   */
  public onConfirm(): void {
    this.confirm.emit();
  }

  /**
   * Trata o clique no botão de cancelamento ("Não").
   * @returns Void
   */
  public onCancel(): void {
    this.cancel.emit();
  }
}
