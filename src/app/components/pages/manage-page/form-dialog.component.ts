import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Formulario } from './manage-data';

@Component({
  selector: 'app-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.isEdit ? 'Editar Formulário' : 'Adicionar Novo Formulário' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome do Formulário</mat-label>
          <input matInput formControlName="nome" required>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descrição</mat-label>
          <input matInput formControlName="descricao" required>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Ícone (Material Icons)</mat-label>
          <input matInput formControlName="icone" required>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Rota (ex: ./sachets)</mat-label>
          <input matInput formControlName="rota" required>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Permissões (níveis 'op' separados por vírgula)</mat-label>
          <input matInput formControlName="permission" required placeholder="Ex: 1,5">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="onSave()">Salvar</button>
    </mat-dialog-actions>
  `,
  styles: ['.full-width { width: 100%; margin-bottom: 16px; }']
})
export class FormDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { form?: Formulario, isEdit: boolean }
  ) {
    this.form = this.fb.group({
      nome: [data.form?.nome || '', Validators.required],
      descricao: [data.form?.descricao || '', Validators.required],
      icone: [data.form?.icone || '', Validators.required],
      rota: [data.form?.rota || '', Validators.required],
      permission: [data.form?.permission || '', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
