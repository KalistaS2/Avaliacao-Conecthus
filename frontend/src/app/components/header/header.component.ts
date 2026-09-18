import { Component, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../api/auth.service';

/**
 * Componente do cabeçalho superior (Header / Top Navbar).
 * Exibe títulos/breadcrumbs na esquerda e perfil de usuário com menu dropdown no canto superior direito.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  /** Estado de abertura do menu dropdown do perfil */
  public isDropdownOpen: boolean = false;

  constructor(
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly elementRef: ElementRef,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  /**
   * Alterna a visibilidade do menu dropdown de perfil.
   * @param event Evento do clique.
   */
  public toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
    this.cdr.markForCheck();
  }

  /**
   * Listener global para fechar o dropdown se o usuário clicar fora do componente.
   * @param event Evento do clique no documento.
   */
  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    if (this.isDropdownOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
      this.cdr.markForCheck();
    }
  }

  /**
   * Gera as iniciais a partir do nome do usuário.
   * Exemplo: "Milena Santana Borges" -> "MS"
   * @param name Nome completo do usuário.
   * @returns Iniciais em letras maiúsculas.
   */
  public getUserInitials(name?: string): string {
    if (!name || !name.trim()) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  /**
   * Executa a saída do usuário e redireciona para a tela de login.
   */
  public onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
