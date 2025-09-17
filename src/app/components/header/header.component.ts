// header.component.ts (VERSÃO FINAL CORRETA)

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule }                        from '@angular/common';
import { RouterModule }                        from '@angular/router';

// Componentes e diretivas do Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // <<-- IMPORTE AQUI


// Componentes e diretivas do CoreUI, baseados no seu exemplo
import {
  ContainerComponent,
  NavbarBrandDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  CollapseDirective
} from '@coreui/angular';

// Seu serviço de autenticação
import { AuthService } from '../pages/login/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    ContainerComponent,
    HeaderComponent,
    HeaderNavComponent,
    HeaderTogglerDirective,
    CollapseDirective,
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponents {
  // Propriedade para controlar o menu responsivo
  public isNavCollapsed = true;

  constructor(public authService: AuthService) {}

  // Função para abrir/fechar o menu
  toggleNav(): void {
    this.isNavCollapsed = !this.isNavCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}
