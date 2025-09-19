import {Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { animate, style, transition, trigger, query, stagger } from '@angular/animations'; // Importar query e stagger
import { AuthService } from '../login/auth.service';

// Modelos de dados
import { Formulario, SubmissaoQualidade, SubmissaoConferente } from './manage-data';

import { ManageUsersComponent } from './manage-users.component';

// Serviços
import { ChecklistService } from '../checklist.service';
import { FormularioService } from '../forms-selection/formulario.service';
import { WizardService } from '../checklist-wizard/wizard.service';
import { FormDialogComponent } from './form-dialog.component';

// Componentes de Diálogo
import { DetailsDialogComponent } from './details-dialog.component';
import { DetailsConferenteDialogComponent } from './details-conferente-dialog.component';

@Component({
  selector: 'app-manage-page',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatTabsModule, MatIconModule, MatTableModule,
    MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSlideToggleModule, MatTooltipModule, MatDialogModule, ManageUsersComponent
  ],
  templateUrl: './manage-page.component.html',
  styleUrls: ['./manage-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('tabContentAnimation', [
      transition(':enter', [
        query('.tab-content > *', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('50ms', [
            animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ])
    ])
  ]
})
export class ManagePageComponent implements OnInit, AfterViewInit {
  // Dados para a Aba 1: Gerenciar Formulários
  displayedColumnsFormularios: string[] = ['nome', 'rota', 'permission', 'ativo', 'acoes'];
  dataSourceFormularios: MatTableDataSource<Formulario>;

  formularios: Formulario[] = [];
  // Dados e colunas para a tabela de Qualidade
  displayedColumnsQualidade: string[] = ['id', 'codBarrica', 'produto', 'responsavel', 'data', 'acoes'];
  dataSourceQualidade: MatTableDataSource<SubmissaoQualidade>;

  // Dados e colunas para a tabela de Conferentes
  displayedColumnsConferentes: string[] = ['id', 'lote', 'produto', 'responsavel', 'data_envio', 'acoes'];
  dataSourceConferentes: MatTableDataSource<SubmissaoConferente>;

  @ViewChild('paginatorQualidade') paginatorQualidade!: MatPaginator;
  @ViewChild('sortQualidade') sortQualidade!: MatSort;
  @ViewChild('paginatorFormularios') paginatorFormularios!: MatPaginator;
  @ViewChild('sortFormularios') sortFormularios!: MatSort;

  @ViewChild('paginatorConferentes') paginatorConferentes!: MatPaginator;
  @ViewChild('sortConferentes') sortConferentes!: MatSort;

  constructor(
    public authService: AuthService,
    private checklistService: ChecklistService,
    private formularioService: FormularioService,
    private wizardService: WizardService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
    this.dataSourceFormularios = new MatTableDataSource<Formulario>([]);
    this.dataSourceQualidade = new MatTableDataSource<SubmissaoQualidade>([]);
    this.dataSourceConferentes = new MatTableDataSource<SubmissaoConferente>([]);
  }

  ngOnInit(): void {
    this.carregarDadosFormularios();
    this.carregarDadosQualidade();
    this.carregarDadosConferentes();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setupTabelaFormularios();
      this.setupTabelaQualidade();
      this.setupTabelaConferentes();
    });
  }

  setupTabelaFormularios(): void {
    if (this.paginatorFormularios && this.sortFormularios) {
      this.dataSourceFormularios.paginator = this.paginatorFormularios;
      this.dataSourceFormularios.sort = this.sortFormularios;
    }
  }

  openFormDialog(form?: Formulario): void {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '500px',
      data: { form, isEdit: !!form }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (form && form.id) {
          this.formularioService.updateFormulario(form.id, { ...form, ...result }).subscribe(() => this.carregarDadosFormularios());
        } else {
          this.formularioService.addFormulario(result).subscribe(() => this.carregarDadosFormularios());
        }
      }
    });
  }

  deleteForm(form: Formulario): void {
    if (confirm(`Tem a certeza que quer apagar o formulário "${form.nome}"? Esta ação não pode ser desfeita.`)) {
      this.formularioService.deleteFormulario(form.id).subscribe(() => this.carregarDadosFormularios());
    }
  }

  onStatusChange(formulario: Formulario, event: MatSlideToggleChange): void {
    this.formularioService.updateFormularioStatus(formulario.id, event.checked).subscribe({
      next: () => {
        const data = this.dataSourceFormularios.data;
        const formIndex = data.findIndex(f => f.id === formulario.id);
        if (formIndex > -1) {
          data[formIndex].ativo = event.checked;
          this.dataSourceFormularios.data = data;
        }
      },
      error: (err) => {
        event.source.toggle();
      }
    });
  }

  carregarDadosFormularios(): void {
    this.formularioService.getFormularios().subscribe(dados => {
      this.dataSourceFormularios.data = dados;
      this.cdr.detectChanges();
    });
  }

  carregarDadosQualidade(): void {
    this.checklistService.getChecklists().subscribe((dados: SubmissaoQualidade[]) => {
      this.dataSourceQualidade.data = dados;
      this.cdr.detectChanges();
    });
  }

  carregarDadosConferentes(): void {
    this.wizardService.getChecklistsConferentes().subscribe(dados => {
      this.dataSourceConferentes.data = dados;
      this.cdr.detectChanges();
    });
  }

  setupTabelaQualidade(): void {
    if (this.paginatorQualidade && this.sortQualidade) {
      this.dataSourceQualidade.paginator = this.paginatorQualidade;
      this.dataSourceQualidade.sort = this.sortQualidade;

      this.dataSourceQualidade.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'responsavel': return item.dados_respostas.nome;
          case 'produto': return item.dados_respostas.produto;
          case 'data': return new Date(item.dados_respostas.data).getTime();
          case 'codBarrica': return item.dados_respostas.codBarrica || '';
          default: return (item as any)[property];
        }
      };

      // 🔑 Aqui está o filtro customizado
      this.dataSourceQualidade.filterPredicate = (data: any, filter: string): boolean => {
        const str = `
        ${data.id}
        ${data.dados_respostas.codBarrica || ''}
        ${data.dados_respostas.produto || ''}
        ${data.dados_respostas.nome || ''}
        ${data.dados_respostas.data || ''}
      `.toLowerCase();
        return str.includes(filter);
      };
    }
  }

  setupTabelaConferentes(): void {
    if (this.paginatorConferentes && this.sortConferentes) {
      this.dataSourceConferentes.paginator = this.paginatorConferentes;
      this.dataSourceConferentes.sort = this.sortConferentes;

      this.dataSourceConferentes.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'responsavel': return item.dados_iniciais.responsavel;
          case 'produto': return item.dados_iniciais.produto;
          case 'lote': return item.dados_iniciais.lote;
          case 'data_envio': return new Date(item.data_envio).getTime();
          default: return (item as any)[property];
        }
      };

      // 🔑 Filtro customizado para incluir campos aninhados
      this.dataSourceConferentes.filterPredicate = (data: any, filter: string): boolean => {
        const str = `
        ${data.id}
        ${data.dados_iniciais.lote || ''}
        ${data.dados_iniciais.produto || ''}
        ${data.dados_iniciais.responsavel || ''}
        ${data.data_envio || ''}
      `.toLowerCase();
        return str.includes(filter);
      };
    }
  }



  applyFilterQualidade(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceQualidade.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceQualidade.paginator) this.dataSourceQualidade.paginator.firstPage();
  }

  applyFilterConferentes(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceConferentes.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceConferentes.paginator) this.dataSourceConferentes.paginator.firstPage();
  }

  verDetalhesQualidade(row: SubmissaoQualidade): void {
    this.dialog.open(DetailsDialogComponent, {
      width: '80vw',
      maxWidth: '900px',
      data: row
    });
  }

  verDetalhesConferente(row: SubmissaoConferente): void {
    this.dialog.open(DetailsConferenteDialogComponent, {
      width: '80vw',
      maxWidth: '900px',
      data: row
    });
  }
}
