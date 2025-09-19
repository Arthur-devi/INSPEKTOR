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
    CommonModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatCardModule, MatDividerModule, MatListModule
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
              <div class="checklist-items-container">
                <div *ngFor="let item of data.respostas_checklist; let i = index" class="checklist-item">
                  <span class="pergunta">{{ i + 1 }}. {{ getPergunta(item) }}</span>
                  <span class="resposta" [ngClass]="getRespostaClass(item)">
                    {{ getResposta(item) }}
                  </span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </mat-dialog-content>
  `,
  // ESTILOS TOTALMENTE SUBSTITUÍDOS PARA ACOMODAR A NOVA ESTRUTURA
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8px;
    }

    .dialog-content {
      padding-top: 16px;
      max-height: 75vh; /* Limita a altura máxima do conteúdo do diálogo */
    }

    .content-columns {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 16px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .margin-top {
      margin-top: 16px;
    }

    mat-card-content p {
      margin: 8px 0;
    }

    .checklist-column mat-card-content {
      padding: 8px 16px; /* Ajuste no padding do card de checklist */
    }

    .checklist-items-container {
      display: flex;
      flex-direction: column;
      gap: 12px; /* Espaço entre cada item do checklist */
    }

    /* Cada item da lista de checklist (pergunta + resposta) */
    .checklist-item {
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .checklist-item:last-child {
      border-bottom: none;
    }

    /* Estilo da pergunta */
    .pergunta {
      font-weight: 500;
      color: #333;
      line-height: 1.4;
      margin-bottom: 8px; /* Espaço entre a pergunta e a resposta */
      /* As propriedades de quebra de linha já estão implícitas, mas podemos ser explícitos */
      white-space: normal;
      word-break: break-word;
    }

    /* Estilo da resposta */
    .resposta {
      font-weight: bold;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.9em;
      line-height: 1.5; /* Garante altura de linha suficiente para o texto */
      /* Assegura que a resposta ocupe a largura necessária e quebre a linha */
      white-space: normal;
      word-break: break-word;
      max-width: 100%; /* Garante que não ultrapasse o contêiner */
    }

    /* Cores para as respostas */
    .resposta-sim {
      background-color: #d1fae5;
      color: #065f46;
    }

    .resposta-nao {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .resposta-neutra {
      background-color: #f3f4f6;
      color: #4b5563;
    }
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

  // Função para pegar a pergunta (a chave do objeto)
  getPergunta(item: { [key: string]: string }): string {
    return Object.keys(item)[0];
  }

  // Função para pegar a resposta (o valor do objeto)
  getResposta(item: { [key: string]: string }): string {
    return Object.values(item)[0];
  }

  // Função para aplicar uma classe CSS com base no conteúdo da resposta
  getRespostaClass(item: { [key: string]: string }): string {
    const resposta = this.getResposta(item)?.toLowerCase();
    if (resposta === 'sim') return 'resposta-sim';
    if (resposta === 'não' || resposta === 'nao') return 'resposta-nao'; // Aceita com e sem acento
    return 'resposta-neutra';
  }
}
