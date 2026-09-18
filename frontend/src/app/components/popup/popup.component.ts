import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente modal genérico para exibição/edição de dados em janela popup.
 */
@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent {
  /** Título exibido no cabeçalho do popup */
  @Input() title: string = '';

  /** Controla a visibilidade do popup modal */
  @Input() isOpen: boolean = false;

  /** Evento emitido quando o popup é fechado */
  @Output() close = new EventEmitter<void>();

  /**
   * Dispara o evento de fechamento da modal.
   * @returns Void
   */
  public onClose(): void {
    this.close.emit();
  }
}
