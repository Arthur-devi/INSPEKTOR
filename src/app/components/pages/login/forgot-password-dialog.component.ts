import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ForgotPasswordDialogComponent {

  constructor(public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>) {}

  // Esta função será chamada pelo botão "Ligar"
  ligarParaSuporte(): void {
    // Cria um link "tel:" que abre o discador no celular
    this.dialogRef.close();
  }

  chamado(): void{
    window.open("http://glpi.grupovalefertil.com.br/");
    this.dialogRef.close();
  }

  // Para o botão "Abrir chamado", você pode adicionar a lógica
  // de navegação para a página de tickets ou outra ação.
  // Por enquanto, ele apenas fechará o diálogo.
}
