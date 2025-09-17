import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://10.10.10.246:3000/api/dashboard';

  constructor(private http: HttpClient) { }

  // Busca os dados processados para o dashboard de Qualidade
  getQualidadeData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/qualidade`);
  }

  // Busca os dados processados para o dashboard de Conferentes
  getConferentesData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/conferentes`);
  }
}
