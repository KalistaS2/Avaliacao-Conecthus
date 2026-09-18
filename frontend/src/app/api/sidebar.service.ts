import { Injectable, signal } from '@angular/core';

/**
 * Serviço global para controle do estado retrátil (expandido/recolhido) da Sidebar.
 */
@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  /** Signal que controla se a sidebar está recolhida */
  public isCollapsed = signal<boolean>(false);

  /**
   * Alterna o estado da sidebar entre expandido e recolhido.
   * @returns Void
   */
  public toggle(): void {
    this.isCollapsed.update((val) => !val);
  }

  /**
   * Define explicitamente o estado de recolhimento da sidebar.
   * @param collapsed Booleano indicando se deve estar recolhida.
   * @returns Void
   */
  public setCollapsed(collapsed: boolean): void {
    this.isCollapsed.set(collapsed);
  }
}
