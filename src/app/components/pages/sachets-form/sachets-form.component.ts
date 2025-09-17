import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Imports do Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import {animate, style, transition, trigger} from '@angular/animations';
import { ChecklistService } from '../checklist.service';

@Component({
  selector: 'app-sachets-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Módulos do Angular Material
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatDividerModule
  ],
  templateUrl: './sachets-form.component.html',
  styleUrls: ['./sachets-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('stepAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(10px)' }),
        animate('300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in',
          style({ opacity: 0, transform: 'translateX(-10px)' }))
      ])
    ])
  ]
})
export class SachetsFormComponent implements OnInit {
  sachetsForm!: FormGroup;
  panelEspecificacoesAberto = false;

  previews: { [key: string]: string | ArrayBuffer | null } = {};

  // --- Dados para os campos de seleção ---
  linhas: string[] = ["Bossar", "Pasteurizada", "Automatica", "Snacks", "Frutas secas", "Descaroçadeira/Densimetro", "Azeite", "Plana", "Carrossel 01", "Carrossel 02", "Carrossel 03", "Carrossel 04", "Carrossel 05", "Carrossel 06", "Carrossel 07", "Baldes"];
  nomes: string[] = ["Suzan Brittes", "Micheli Proença", "Ana Claudia Andrade", "Raquel Furman", "Juliana Medeiros", "Cintia Bueno", "Rosa Vanessa Silvetti", "Carolini Santana", "Lauren Vicki", "Marcela Dominguez"];
  calibres: any[] = [
    { numero: 8, descricao: '8/12' }, { numero: 7, descricao: '12/14' },
    { numero: 6, descricao: '14/16' }, { numero: 5, descricao: '16/20' },
    { numero: 4, descricao: '20/24' }, { numero: 2, descricao: '24/28' },
    { numero: 1, descricao: '28/32' }, { numero: 0, descricao: '32/36' },
    { numero: 'P', descricao: '36/40' }, { numero: 'M', descricao: '40/60' }
  ];
  produtos: string[] = ['PROD001', 'PROD002', 'PROD003', 'PROD004'];

  constructor(
    private fb: FormBuilder,
    private checklistService: ChecklistService
  ) { }

  ngOnInit(): void {
    this.sachetsForm = this.fb.group({
      linha: ['', Validators.required],
      data: [new Date(), Validators.required],
      nome: ['', Validators.required],
      produto: ['', Validators.required],
      variedade: [''],
      codBarrica: [''],
      nf: [''],
      calibre: [''],
      fornecedor: [''],
      avaliacaoMateriaPrima: [''],
      fotoMateriaPrima: [null],
      numAmostras: [''],
      hora: [this.getFormattedTime(), Validators.required],
      pesoDrenado: [''],
      pesoLiquido: [''],
      pesoSemSalmoura: [''],
      desvioMaquina: [''],
      selecaoDefeitos: [''],
      pcc1f: [''],
      desvio: this.fb.group({
        destinoProdutoInterditado: [false],
        acaoTrocaFornecedor: [false],
        acaoOrientacaoFuncionario: [false],
        acaoMaisPessoas: [false],
        acaoAbaixarSuporte: [false],
        eficienciaAcao: [''],
        novaAcaoDesvio: [''],
        acaoCorretivaEficaz: ['']
      }),
      encaixotamento: [''],
      selagem: [''],
      codificacaoLote: [''],
      codificacaoCaixa: [''],
      observacoes: [''],
      fotoObservacoes: [null],
      formulario: "Saches"
    });
  }

  getFormattedTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onSubmit(): void {
    if (this.sachetsForm.invalid) {
      this.sachetsForm.markAllAsTouched();
      alert('Formulário inválido. Por favor, verifique os campos obrigatórios.');
      return;
    }

    // 1. Criar um novo FormData. É isso que será enviado na requisição.
    const formData = new FormData();
    const formValue = this.sachetsForm.value;

    // 2. Criar um objeto apenas com os dados de texto para ser convertido em JSON.
    const dadosDeTexto = { ...formValue };
    // Removemos as propriedades que são arquivos, pois elas serão enviadas separadamente.
    delete dadosDeTexto.fotoMateriaPrima;
    delete dadosDeTexto.fotoObservacoes;

    // 3. Anexar os dados de texto ao FormData.
    // O backend espera um campo chamado 'dados' que contém uma string JSON.
    formData.append('dados', JSON.stringify({
      titulo_formulario: 'Formulário 01: Sachês',
      dados_respostas: dadosDeTexto
    }));

    // 4. Anexar os arquivos de imagem ao FormData, se eles existirem.
    // O nome do campo ('fotoMateriaPrima') deve ser o mesmo que o backend espera.
    if (formValue.fotoMateriaPrima) {
      formData.append('fotoMateriaPrima', formValue.fotoMateriaPrima);
    }
    if (formValue.fotoObservacoes) {
      formData.append('fotoObservacoes', formValue.fotoObservacoes);
    }

    // 5. Enviar o FormData para o serviço.
    this.checklistService.salvarChecklist(formData).subscribe({
      next: (res) => {
        alert('Formulário e imagens salvos com sucesso!');
        this.sachetsForm.reset(); // Limpa o formulário
        Object.keys(this.sachetsForm.controls).forEach(key => {
          this.sachetsForm.get(key)?.setErrors(null) ;
        });
        this.previews = {}; // Limpa os previews das imagens
      },
      error: (err) => {
        console.error('Erro no upload:', err);
        alert('Falha ao salvar o formulário.');
      }
    });
  }

  onFileSelected(event: Event, controlName: string): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.sachetsForm.patchValue({ [controlName]: file });
      this.sachetsForm.get(controlName)?.updateValueAndValidity(); // Atualiza o estado do controle

      // Lógica para o preview da imagem
      const reader = new FileReader();
      reader.onload = () => { this.previews[controlName] = reader.result; };
      reader.readAsDataURL(file);
    }
  }
}
