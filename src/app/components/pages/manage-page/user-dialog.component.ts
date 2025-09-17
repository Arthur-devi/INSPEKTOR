import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { User } from './manage-data';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.isEdit ? 'Editar Utilizador' : 'Adicionar Novo Utilizador' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="userForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" required type="email">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Senha</mat-label>
          <input matInput formControlName="password" [required]="!data.isEdit" type="password" placeholder="Deixe em branco para não alterar">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nível de Acesso (op)</mat-label>
          <mat-select formControlName="op" required>
            <mat-option [value]="1">1 - Qualidade</mat-option>
            <mat-option [value]="2">2 - Conferente</mat-option>
            <mat-option [value]="3">3 - Gestor Qualidade</mat-option>
            <mat-option [value]="4">4 - Gestor Conferente</mat-option>
            <mat-option [value]="5">5 - Admin</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="userForm.invalid" (click)="onSave()">Salvar</button>
    </mat-dialog-actions>
  `,
  styles: ['.full-width { width: 100%; margin-bottom: 16px; }']
})
export class UserDialogComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User, isEdit: boolean }
  ) {
    this.userForm = this.fb.group({
      name: [data.user?.name || '', Validators.required],
      email: [data.user?.email || '', [Validators.required, Validators.email]],
      password: [''],
      op: [data.user?.op || '', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }
}
