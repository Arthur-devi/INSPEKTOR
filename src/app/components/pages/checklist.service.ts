import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SubmissaoQualidade} from './manage-page/manage-data';

@Injectable({
  providedIn: 'root' // Isso torna o serviço disponível em toda a aplicação
})
export class ChecklistService {
  // A URL exata do seu endpoint no backend
  private apiUrl = 'http://10.10.10.246:3000/api/checklists';

  // Injetamos o HttpClient para poder fazer requisições HTTP
  constructor(private http: HttpClient) { }

  /**
   * Envia os dados de um formulário de checklist para o backend.
   * @param dadosDoFormulario O objeto contendo o título e as respostas do formulário.
   * @returns Um Observable com a resposta do servidor.
   */
  salvarChecklist(dadosDoFormulario: any): Observable<any> {
    // Realiza uma requisição POST para a nossa API, enviando os dados no corpo da requisição.
    return this.http.post(this.apiUrl, dadosDoFormulario);
  }

  getChecklists(): Observable<SubmissaoQualidade[]> {
    return this.http.get<SubmissaoQualidade[]>(this.apiUrl);
  }

}
