import { Component, Inject } from '@angular/core';
import { CommonModule, KeyValuePipe, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { SubmissaoQualidade } from './manage-data'; // Ajuste o caminho se necessário

@Component({
  selector: 'app-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    KeyValuePipe,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule
  ],
  providers: [DatePipe],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>Detalhes da Submissão #{{ data.id }}</h2>
      <button mat-icon-button (click)="closeDialog()" matTooltip="Fechar">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <mat-dialog-content class="dialog-content">
      <div class="content-columns">
        <!-- Coluna de Informações -->
        <div class="info-column">
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-card-title>Dados do Formulário</mat-card-title>
              <mat-card-subtitle>{{ data.titulo_formulario }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div *ngFor="let item of $any(data.dados_respostas) | keyvalue" class="info-item">
                <ng-container *ngIf="item.key !== 'desvio'">
                  <!-- Template Limpo: A lógica de tipo está agora na classe do componente -->
                  <strong class="info-key">{{ formatKey(item.key) }}:</strong>
                  <span class="info-value">{{ formatValue(item.key, item.value) }}</span>
                </ng-container>
              </div>

              <ng-container *ngIf="data.dados_respostas.desvio as desvio">
                <mat-divider></mat-divider>
                <h4 class="nested-title">Ações de Desvio</h4>
                <div *ngFor="let item of $any(desvio) | keyvalue" class="info-item nested-item">
                  <strong class="info-key">{{ formatKey(item.key) }}:</strong>
                  <span class="info-value">{{ formatValue(item.key, item.value) }}</span>
                </div>
              </ng-container>

            </mat-card-content>
          </mat-card>
        </div>

        <!-- Coluna de Anexos -->
        <div class="attachments-column">
          <mat-card appearance="outlined">
            <mat-card-header><mat-card-title>Anexos</mat-card-title></mat-card-header>
            <mat-card-content>
              <div *ngIf="data.path_foto_materia_prima; else noImage">
                <p><strong>Foto da Matéria-Prima:</strong></p>
                <img [src]="getImageUrl(data.path_foto_materia_prima)" alt="Foto da Matéria-Prima">
              </div>
              <ng-template #noImage><p>Nenhuma imagem de matéria-prima.</p></ng-template>
              <mat-divider></mat-divider>
              <div *ngIf="data.path_foto_observacoes; else noImageObs">
                <p><strong>Foto das Observações:</strong></p>
                <img [src]="getImageUrl(data.path_foto_observacoes)" alt="Foto das Observações">
              </div>
              <ng-template #noImageObs><p>Nenhuma imagem de observação.</p></ng-template>
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
    .info-column { flex: 2; min-width: 300px; }
    .attachments-column { flex: 1; min-width: 250px; }
    .info-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
    .info-key { text-transform: capitalize; color: #333; padding-right: 8px; }
    .info-value { color: #666; text-align: right; word-break: break-all; }
    img { width: 100%; border-radius: 8px; margin-top: 8px; }
    mat-divider { margin: 16px 0; }
    .nested-title { margin-top: 20px; margin-bottom: 0; font-weight: 500; }
    .nested-item { padding-left: 16px; }
  `]
})
export class DetailsDialogComponent {
  private backendUrl = 'http://10.10.10.246:3000';

  constructor(
    public dialogRef: MatDialogRef<DetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubmissaoQualidade,
    private datePipe: DatePipe
  ) {}

  getImageUrl(path: string | undefined): string {
    if (!path) return '';
    const correctedPath = path.replace(/\\/g, '/');
    return `${this.backendUrl}/${correctedPath}`;
  }

  // --- CORREÇÃO APLICADA AQUI ---
  // A função agora aceita 'unknown' e converte para string de forma segura
  formatKey(key: unknown): string {
    const keyAsString = String(key);
    return keyAsString.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  // --- E AQUI ---
  // A função agora aceita a chave como 'unknown'
  formatValue(key: unknown, value: unknown): string {
    const keyAsString = String(key);
    if (keyAsString && keyAsString.toLowerCase().includes('data') && typeof value === 'string' && value && !isNaN(Date.parse(value))) {
      return this.datePipe.transform(value, 'dd/MM/yyyy HH:mm') || value;
    }
    if (typeof value === 'boolean') { return value ? 'Sim' : 'Não'; }
    if (value === null || value === undefined || value === '') { return 'N/A'; }
    if (typeof value === 'object' && value !== null) { return '(Dados aninhados)'; }
    return String(value);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

