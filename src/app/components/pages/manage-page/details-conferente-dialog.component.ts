import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { SubmissaoConferente } from './manage-data';

@Component({
  selector: 'app-details-conferente-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatListModule
  ],
  providers: [DatePipe],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>Detalhes do Checklist #{{ data.id }}</h2>
      <button mat-icon-button (click)="closeDialog()" matTooltip="Fechar">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <mat-dialog-content class="dialog-content">
      <div class="content-columns">
        <div class="info-column">
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-card-title>Informações Iniciais</mat-card-title>
              <mat-card-subtitle>{{ data.titulo_formulario }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="info-item"><strong>Produto:</strong><span>{{ data.dados_iniciais.produto }}</span></div>
              <div class="info-item"><strong>Lote:</strong><span>{{ data.dados_iniciais.lote }}</span></div>
              <div class="info-item"><strong>Responsável:</strong><span>{{ data.dados_iniciais.responsavel }}</span></div>
              <div class="info-item"><strong>Horário:</strong><span>{{ data.dados_iniciais.horario }}</span></div>
              <div class="info-item"><strong>Linha:</strong><span>{{ data.dados_iniciais.linha }}</span></div>
              <div class="info-item"><strong>Data de Envio:</strong><span>{{ data.data_envio | date: 'dd/MM/yyyy HH:mm' }}</span></div>
            </mat-card-content>
          </mat-card>
          <mat-card appearance="outlined" class="margin-top">
            <mat-card-header><mat-card-title>Observações e Ações</mat-card-title></mat-card-header>
            <mat-card-content>
              <p><strong>Observações:</strong> {{ data.observacoes || 'N/A' }}</p>
              <mat-divider></mat-divider>
              <p><strong>Ações Corretivas:</strong> {{ data.acoes || 'N/A' }}</p>
            </mat-card-content>
          </mat-card>
        </div>
        <div class="checklist-column">
          <mat-card appearance="outlined">
            <mat-card-header><mat-card-title>Respostas do Checklist</mat-card-title></mat-card-header>
            <mat-card-content>
              <mat-list>
                <mat-list-item *ngFor="let item of data.respostas_checklist; let i = index">
                  <span matListItemTitle><strong>P{{i+1}}:</strong> {{ item.resposta }}</span>
                </mat-list-item>
              </mat-list>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </mat-dialog-content>
  `,
  styles: [`
    .dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 0 24px; border-bottom: 1px solid #e0e0e0; }
    .dialog-content { padding: 16px; max-height: 75vh; overflow-y: auto; }
    .content-columns { display: flex; flex-wrap: wrap; gap: 16px; }
    .info-column { flex: 1; min-width: 300px; }
    .checklist-column { flex: 1; min-width: 300px; }
    .info-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
    .margin-top { margin-top: 16px; }
    p { margin-top: 0; }
  `]
})
export class DetailsConferenteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DetailsConferenteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubmissaoConferente,
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
