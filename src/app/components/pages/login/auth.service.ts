import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

// Interface para os dados do utilizador que guardamos
export interface UserData {
  id: number;
  email: string;
  op: number; // Nível de acesso
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://10.10.10.246:3000/api';
  private TOKEN_KEY = 'auth_token';

  // BehaviorSubject para partilhar o estado do utilizador em tempo real
  private currentUserSubject = new BehaviorSubject<UserData | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromToken();
  }

  // Descodifica o token e atualiza o estado do utilizador
  private decodeToken(token: string): UserData | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { id: payload.id, email: payload.email, op: payload.op, name: payload.name || 'Utilizador' };
    } catch (e) {
      console.error('Erro ao descodificar o token', e);
      return null;
    }
  }

  // Tenta carregar o utilizador a partir do token no localStorage ao iniciar
  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      const userData = this.decodeToken(token);
      this.currentUserSubject.next(userData);
    }
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          const userData = this.decodeToken(response.token);
          // Adiciona o nome recebido da resposta do login
          if (userData) {
            userData.name = response.userName;
          }
          this.currentUserSubject.next(userData); // Atualiza o estado
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null); // Limpa o estado
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Métodos úteis para verificar o nível de acesso em qualquer lugar da aplicação
  getUserRole(): number | null {
    return this.currentUserSubject.value?.op ?? null;
  }

  hasRole(roles: number[]): boolean {
    const userRole = this.getUserRole();
    return userRole !== null && roles.includes(userRole);
  }
}
