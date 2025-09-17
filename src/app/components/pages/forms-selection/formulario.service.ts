import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formulario } from '../manage-page/manage-data'; // Ajuste o caminho conforme sua estrutura

@Injectable({
  providedIn: 'root'
})
export class FormularioService {
  private apiUrl = 'http://10.10.10.246:3000/api/formularios';

  constructor(private http: HttpClient) { }

  // Busca todos os formulários do backend
  getFormularios(): Observable<Formulario[]> {
    return this.http.get<Formulario[]>(this.apiUrl);
  }

  // Atualiza o status (ativo/inativo) de um formulário específico
  updateFormularioStatus(id: number, ativo: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { ativo });
  }

  addFormulario(form: Formulario): Observable<any> {
    return this.http.post(this.apiUrl, form);
  }

  updateFormulario(id: number, form: Formulario): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, form);
  }

  deleteFormulario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
