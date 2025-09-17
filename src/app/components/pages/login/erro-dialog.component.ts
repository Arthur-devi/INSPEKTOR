import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-erro-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-header">
      <mat-icon color="warn">warning</mat-icon>
      <h2 mat-dialog-title>Erro de Autenticação</h2>
    </div>
    <mat-dialog-content>
      <p>{{ data.mensagem }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" [mat-dialog-close]="true">Entendido</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #dc2626; /* Vermelho */
    }
    .dialog-header mat-icon {
      font-size: 28px;
      height: 28px;
      width: 28px;
    }
    h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
    p {
      margin-top: 16px;
      font-size: 1rem;
      color: #334155;
    }
  `]
})
export class ErroDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensagem: string }
  ) {}
}
