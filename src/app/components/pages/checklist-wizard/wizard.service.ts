import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SubmissaoConferente} from '../manage-page/manage-data';

@Injectable({
  providedIn: 'root'
})
export class WizardService {
  // Novo endpoint no backend
  private apiUrl = 'http://10.10.10.246:3000/api/checklists-conferentes';

  constructor(private http: HttpClient) { }

  /**
   * Envia os dados completos do checklist wizard para o backend.
   * @param dadosCompletos Objeto contendo todas as informações do formulário.
   */
  salvarChecklist(dadosCompletos: any): Observable<any> {
    return this.http.post(this.apiUrl, dadosCompletos);
  }

  getChecklistsConferentes(): Observable<SubmissaoConferente[]> {
    return this.http.get<SubmissaoConferente[]>(this.apiUrl);
  }
}
