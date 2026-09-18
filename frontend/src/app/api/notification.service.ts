import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationState {
  title: string;
  message: string;
  type: NotificationType;
}

/**
 * Serviço reativo global para gerenciamento centralizado de Notificações / Toasts no sistema.
 * Utiliza Angular Signals para fornecer reatividade limpa e gerencia o tempo de exibição (auto-dismiss),
 * evitando vazamento de memória por timers acumulados.
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  /** Signal reativo contendo o estado da notificação ativa ou null */
  public readonly notification = signal<NotificationState | null>(null);

  /** Referência do timer para auto-dismiss */
  private timer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Exibe uma notificação temporária no sistema.
   * Cancela automaticamente notificações e timers anteriores.
   * @param message Texto principal da notificação.
   * @param type Tipo visual da notificação (success, error, info, warning).
   * @param title Título opcional. Se omitido, é gerado um título padrão baseado no tipo.
   * @param durationMs Tempo em milissegundos para auto-dismiss (padrão: 4000ms).
   */
  public show(
    message: string,
    type: NotificationType = 'success',
    title: string = '',
    durationMs: number = 4000
  ): void {
    this.clearTimer();

    const resolvedTitle =
      title ||
      (type === 'error'
        ? 'Erro'
        : type === 'warning'
        ? 'Atenção'
        : type === 'info'
        ? 'Informação'
        : 'Sucesso');

    this.notification.set({
      message,
      type,
      title: resolvedTitle,
    });

    this.timer = setTimeout(() => {
      this.dismiss();
    }, durationMs);
  }

  /**
   * Limpa a notificação ativa imediatamente e cancela o timer pendente.
   */
  public dismiss(): void {
    this.clearTimer();
    this.notification.set(null);
  }

  /**
   * Cancela a execução do setTimeout pendente, se houver.
   */
  private clearTimer(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
