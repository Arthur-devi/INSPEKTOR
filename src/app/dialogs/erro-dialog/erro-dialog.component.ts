import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-erro-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './erro-dialog.component.html',
  styleUrls: ['./erro-dialog.component.scss']
})
export class ErroDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensagem: string }
  ) {}

  fechar(): void {
    this.dialogRef.close();
  }
}
