import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { animate, style, transition, trigger } from '@angular/animations';

import { AuthService } from '../login/auth.service';
import { DashboardService } from './dashboard.service'; // 1. IMPORTAR O NOVO SERVIÇO

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
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
export class DashboardComponent implements OnInit {
  isGestorQualidade = false;
  isGestorConferentes = false;
  isAdmin = false;

  // Variáveis para guardar os dados reais
  dadosQualidade: any = { kpis: {}, producaoPorLinha: [], eficienciaOperadores: [] };
  dadosConferentes: any = { kpis: {}, checklistsPorLinha: [] };

  // Propriedades dos gráficos (sem alterações)
  gradient: boolean = true;
  colorScheme: Color = {
    name: 'inspektorCool',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4f46e5', '#ec4899', '#22c55e', '#f59e0b', '#3b82f6', '#ef4444'],
  };

  constructor(
    public authService: AuthService,
    private dashboardService: DashboardService, // 2. INJETAR O SERVIÇO
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole([5]);
    this.isGestorQualidade = this.authService.hasRole([3]);
    this.isGestorConferentes = this.authService.hasRole([4]);

    // 3. CARREGAR OS DADOS REAIS
    if (this.isGestorQualidade || this.isAdmin) {
      this.dashboardService.getQualidadeData().subscribe(data => {
        this.dadosQualidade = data;
        this.cdr.detectChanges(); // Notifica o Angular para atualizar a tela
      });
    }

    if (this.isGestorConferentes || this.isAdmin) {
      this.dashboardService.getConferentesData().subscribe(data => {
        this.dadosConferentes = data;
        this.cdr.detectChanges();
      });
    }
  }

  formatAsInteger(value: number = 0): string {
    return value.toLocaleString('pt-BR');
  }
}
