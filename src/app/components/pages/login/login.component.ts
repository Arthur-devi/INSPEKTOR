import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {animate, style, transition, trigger} from '@angular/animations'; // 👈 Importar aqui
import { AuthService } from './auth.service'; // 1. IMPORTAR O SERVIÇO
import { ErroDialogComponent } from './erro-dialog.component';
import {MatDialog} from '@angular/material/dialog'; // 2. IMPORTAR O DIÁLOGO DE ERRO



@Component({
  selector: 'app-login-page',
  imports: [
    FormsModule // 👈 Adicionar aqui também
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'], // pode deixar vazio por enquanto
  animations: [
    trigger('stepAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('1000ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in',
          style({ opacity: 0, transform: 'translateX(-10px)' }))
      ])
    ])
  ]
})


export class LoginComponent {
  email = '';
  password = '';
  //errorMessage = ''; // Para exibir erros de login

  constructor(
    private router: Router,
    private authService: AuthService, // 2. INJETAR O SERVIÇO
    private dialog: MatDialog // 4. INJETAR O MATDIALOG
  ) {}

  login() {
    if (!this.email || !this.password) {
      this.abrirErroDialog('Por favor, preencha todos os campos.');
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        // Sucesso
        this.router.navigate(['/']); // Redireciona para a home
      },
      error: (err) => {
        // Agora, em vez de definir uma variável de texto, abrimos o pop-up
        this.abrirErroDialog('Credenciais inválidas. Tente novamente.');
        console.error('Erro de login:', err);
      }
    });
  }

  abrirErroDialog(mensagem: string): void {
    this.dialog.open(ErroDialogComponent, {
      width: '350px',
      data: { mensagem: mensagem } // Passa a mensagem de erro para o diálogo
    });
  }
}
