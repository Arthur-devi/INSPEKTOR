import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormularioService } from './formulario.service';
import { Formulario } from '../manage-page/manage-data';
import { AuthService } from '../login/auth.service'; // 1. IMPORTAR O AUTHSERVICE

@Component({
  selector: 'app-forms-selection',
  standalone: true,
  imports: [ CommonModule, RouterModule, MatCardModule, MatIconModule, MatListModule ],
  templateUrl: './forms-selection.component.html',
  styleUrls: ['./forms-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('stepAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
    ])
  ]
})
export class FormsSelectionComponent implements OnInit {
  formularios: Formulario[] = [];

  constructor(
    private formularioService: FormularioService,
    private authService: AuthService, // 2. INJETAR O AUTHSERVICE
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // 3. ATUALIZAR A LÓGICA DE FILTRAGEM
    const userRole = this.authService.getUserRole();
    if (userRole === null) {
      console.error("Não foi possível obter o nível de acesso do utilizador.");
      return;
    }

    this.formularioService.getFormularios().subscribe(todosOsFormularios => {
      this.formularios = todosOsFormularios.filter(form => {
        // Assegura que a propriedade 'permission' existe antes de a usar
        if (!form.permission) {
          return false;
        }
        // Converte a string de permissões (ex: '1,5') num array de números
        const permissoes = form.permission.split(',').map(Number);
        // O formulário aparece se estiver ativo E o nível do utilizador estiver na lista de permissões
        return form.ativo && permissoes.includes(userRole);
      });
      this.cdr.detectChanges();
    });
  }
}
