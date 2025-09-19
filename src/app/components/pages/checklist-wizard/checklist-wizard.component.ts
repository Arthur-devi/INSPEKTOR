import {
  Component,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import {
  GridModule,
  ButtonModule,
  FormModule
} from '@coreui/angular';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { ErroDialogComponent} from '../../../dialogs/erro-dialog/erro-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { WizardService } from './wizard.service'; // 1. IMPORTAR O NOVO SERVIÇO

@Component({
  selector: 'app-checklist-wizard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GridModule,
    ButtonModule,
    FormModule
  ],
  templateUrl: './checklist-wizard.component.html',
  styleUrls: ['./checklist-wizard.component.scss'],
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
export class ChecklistWizardComponent implements OnInit {
  infoGroup: FormGroup;
  form: FormGroup;
  currentStep = 1;
  totalSteps = 4;
  perguntas: string[] = [];
  categorias: string[] = [];

  linhasDisponiveis: string[] = [
    'LINEAR 06',
    'PASTEURIZADA',
    'AUTOMATICA',
    'CARROSSEL',
    'PLANA',
    'AZEITE',
    'SNACKS',
    'BALDES',
    'BOSSAR',
    'DESCAROÇADEIRA E RECHEADORA'
  ];

  perguntasPorLinha: Record<string, string[]> = {
    // ... (seu objeto gigante de perguntas permanece aqui, sem alterações)
    'LINEAR 06': ['PARAFUSOS DA ESCOTILHA DA MESA DE SELEÇÃO',
      'PARAFUSOS DA BICA DA ESTEIRA DE SELEÇÃO',
      'PARAFUSOS DA TOLVA ALIMENTADORA DA BALANÇA',
      'PARAFUSOS DO RASPADOR',
      'PARAFUSOS DA BICA DE MESA DE SELEÇÃO',
      'PARAFUSOS E MOLAS DAS BALANÇAS',
      'ROLETES DAS CAÇAMBAS',
      'PARAFUSOS DO FUNIL DA BALANÇA',
      'PARAFUSOS DO FUNIL DE ENVASE',
      'PARAFUSO DO DOSADOR DE SALMOURA',
      'PARAFUSOS E MANCAL DA BICA',
      'A MÁQUINA FOI CALIBRADA - PESO LÍQUIDO E PESO DRENADO?',
      'O DATADOR ESTÁ CORRETO EM RELAÇÃO AO LOTE?',
      'AS TEMPERATURAS DAS SOLDAS ESTÃO CORRETAS EM RELAÇÃO AO FILME?',
      'O FILME ESTÁ ALINHADO?',
      'AS BALANÇAS ESTÃO REGULADAS?',
      'A PRESSÃO DO AR ESTÁ CORRETA?',
      'O SACHÊ ESTÁ SEM VAZAMENTO?',
      'O CICLO/MIN ESTÁ CONFORME EM RELAÇÃO AO PROGRAMADO NA MÁQUINA?',
      'O BOTÃO DE EMERGÊNCIA ESTÁ FUNCIONANDO REGULARMENTE?',
      'AS PORTAS ESTÃO DEVIDAMENTE FECHADAS?'],
    'PASTEURIZADA': ['MANOPLAS E GUIAS',
      'PARAFUSOS DO RASPADOR DA ESTEIRA DE SELEÇÃO',
      'PARAFUSOS DAS GUIAS DA ESTEIRA DE RETORNO',
      'PARAFUSO DA BICA ENVASADORA',
      'PARAFUSOS DA ESTEIRA DE ELEVAÇÃO',
      'PARAFUSOS E MANIPULA DA ESTEIRA DE RETORNO',
      'TAMPA DO DOSIFICADOR DE SALMOURA',
      'SPRAY DE LAVAGEM DE AZEITONAS',
      'PARAFUSOS DA ESCOTILHA DA ESTEIRA DE SELEÇÃO',
      'PARAFUSOS DA BICA DA SELEÇÃO',
      'OS VIDROS ESTÃO LIMPOS?',
      'HÁ PRESENÇA DE CACOS DE VIDRO NO PRODUTO A SER ENVASADO?',
      'O PASTEURIZADOR ESTÁ LIGADO CORRETAMENTE E A TEMPERATURA INDICADA NO MOSTRADOR É ADEQUADA?',
      'O PRODUTO A SER ENVASADO ESTÁ DE ACORDO COM A ORDEM DE PRODUÇÃO?',
      'A REGULAGEM DO RÓTULO ESTÁ CORRETA?',
      'REGULAGEM E PESO FOI FEITO CORRETAMENTE?',
      'A TAMPADORA ESTÁ REGULADA?',
      'A SALMOURA UTILIZADA ESTA CORRETA?',
      'O BOTÃO DE EMERGÊNCIA ESTÁ FUNCIONANDO REGULARMENTE?',
      'AS PORTAS ESTÃO DEVIDAMENTE FECHADAS?',
      'Seguir a IT-PD001 00'],
    'AUTOMATICA': ['PARAFUSOS DA ESCOTILHA DE MESA DE SELEÇÃO',
      'PARAFUSOS DO SUPORTE DO SENSOR',
      'PARAFUSO DA BICA DE ESTEIRA DE SELEÇÃO',
      'PARAFUSOS DO SUPORTE FUNIL DA ESTEIRA DE SELEÇÃO',
      'PARAFUSOS DO FUNIL DA ESTEIRA DE SELEÇÃO',
      'PARAFUSOS DA BICA ENVASADORA',
      'PARAFUSOS DA BICA ENVASADORA',
      'PARAFUSOS DO FLAP DA ENVASADORA',
      'OS VIDROS ESTÃO LIMPOS?',
      'HÁ PRESENÇA DE CACOS DE VIDRO NO PRODUTO A SER ENVASADO?',
      'O PRODUTO A SER ENVASADO ESTÁ DE ACORDO COM A ORDEM DE PRODUÇÃO?',
      'A REGULAGEM DO RÓTULO ESTÁ CORRETA?',
      'REGULAGEM E PESO FOI FEITO CORRETAMENTE?',
      'A TAMPADORA ESTÁ REGULADA?',
      'O BOTÃO DE EMERGÊNCIA ESTÁ FUNCIONANDO REGULARMENTE?',
      'SALMOURA UTILIZADA ESTÁ CORRETAS?',
      'AS PORTAS ESTÃO DEVIDAMENTE FECHADAS?',
      'Seguir a IT-PD003 00'],
    'CARROSSEL': ['PARAFUSOS DA ESCOTILHA DA MESA DE SELEÇÃO',
      'PARAFUSOS DA BICA DA ESTEIRA DE SELEÇÃO',
      'PARAFUSOS DA TOLVA ALIMENTADORA DA BALANÇA',
      'PARAFUSOS DO FUNIL DA BALANÇA',
      'PARAFUSOS E MOLAS DAS BALANÇAS',
      'ROLETES DAS CAÇAMBAS',
      'PARAFUSO DO DOSADOR DE SALMOURA',
      'PARAFUSOS DO FUNIL DE ENVASE',
      'PESO LÍQUIDO E PESO DRENADO?',
      'O DATADOR ESTÁ CORRETO EM RELAÇÃO AO LOTE?',
      'AS TEMPERATURAS DAS SOLDAS ESTÃO CORRETAS EM RELAÇÃO AO FILME?',
      'O FILME ESTÁ ALINHADO?',
      'AS BALANÇAS ESTÃO REGULADAS?',
      'A PRESSÃO DO AR ESTÁ CORRETA?',
      'O SACHÊ ESTÁ SEM VAZAMENTO?',
      'Seguir a IT-PD008 00 ao IT-PD012 00'],
    'PLANA': ['PARAFUSOS DA ESCOTILHA DA MESA DE SELEÇÃO',
      'PARAFUSOS DA BICA DA ESTEIRA DE SELEÇÃO',
      'PARAFUSOS DA TOLVA ALIMENTADORA DA BALANÇA',
      'PARAFUSOS DO FUNIL DA BALANÇA',
      'PARAFUSOS E MOLAS DAS BALANÇAS',
      'ROLETES DAS CAÇAMBAS',
      'PARAFUSO DO DOSADOR DE SALMOURA',
      'PARAFUSOS DO FUNIL DE ENVASE',
      'A MÁQUINA FOI CALIBRADA - PESO LÍQUIDO E PESO DRENADO?',
      'O DATADOR ESTÁ CORRETO EM RELAÇÃO AO LOTE?',
      'AS TEMPERATURAS DAS SOLDAS ESTÃO CORRETAS EM RELAÇÃO AO FILME?',
      'O FILME ESTÁ ALINHADO?',
      'AS BALANÇAS ESTÃO REGULADAS?',
      'A PRESSÃO DO AR ESTÁ CORRETA?',
      'O SACHÊ ESTÁ SEM VAZAMENTO?',
      'O CICLO/MIN ESTÁ CONFORME EM RELAÇÃO AO PROGRAMADO NA MÁQUINA?',
      'O BOTÃO DE EMERGÊNCIA ESTÁ FUNCIONANDO REGULARMENTE?',
      'AS PORTAS ESTÃO DEVIDAMENTE FECHADAS?',
      'Seguir a IT-PD007 00'],
    'AZEITE': ['A EMBALAGEM A SER ENVASADA ESTÁ DEVIDAMENTE LIMPA E LIVRE DE CONTAMINAÇÃO COM MATERIAIS ESTRANHOS?',
      'HÁ PRESENÇA DE CACOS DE VIDRO NO PRODUTO A SER ENVASADO?',
      'O ajuste de peças que possam soltar durante o processo da envasadora foi realizado corretamente?',
      'PARAFUSOS DA LIMPADORA DE VIDROS',
      'PARAFUSOS DA LIMPADORA DE VIDROS',
      'PARAFUSOS DO DOSADOR DE NITROGÊNIO',
      'PARAFUSOS DO DOSADOR DE AZEITE',
      'PARAFUSOS DO SISTEMA DE VÁCUO',
      'PARAFUSOS DO ALIMENTADOR DE TAMPAS',
      'PARAFUSOS DO ALIMENTADOR DE TAMPAS',
      'FOI CALIBRADO NA MÁQUINA, O VOLUME LÍQUIDO E PESO DO PRODUTO?',
      'OS BICOS DOSADORES ESTÃO ENVASANDO CORRETAMENTE?',
      'A TAMPADORA ESTÁ REGULADA?',
      'A CÁPSULA ESTÁ FECHANDO CORRETAMENTE?',
      'O RÓTULO E CONTRA-RÓTULO ESTÃO DEVIDAMENTE POSICIONADOS?',
      'O BOTÃO DE EMERGÊNCIA ESTÁ FUNCIONANDO REGULARMENTE?',
      'seguir a IT-PD003 00'],
    'SNACKS': ['O ajuste de peças que possam soltar durante o processo da envasadora foi realizado corretamente?',
      'SUPORTE DE ACIONAMENTO DA ESTEIRA DE SELEÇÃO',
      'PARAFUSOS DO FLAP DE SELEÇÃO',
      'PARAFUSOS DA GUIA DE SELEÇÃO',
      'PARAFUSOS DA BICA DA SELEÇÃO',
      'PARAFUSOS DA BICA DA SELEÇÃO',
      'PARAFUSOS DO MANCAL DO MISTURADOR',
      'PARAFUSOS DA TOLVA',
      'PARAFUSOS DA TOLVA',
      'PARAFUSOS DO SUPORTE DO SENSOR',
      'PARAFUSOS E MOLAS DAS CAÇAMBAS',
      'ROLETES DAS CAÇAMBAS',
      'O REGISTRO DO GÁS ESTÁ ABERTO E NAS CONCENTRAÇÕES ADQUADAS CONFORME ESPECIFICAÇÃO?',
      'A MÁQUINA FOI CALIBRADA - PESO DRENADO?',
      'O DATADOR ESTÁ CORRETO EM RELAÇÃO AO LOTE?',
      'AS TEMPERATURAS DAS SOLDAS ESTÃO CORRETAS EM RELAÇÃO AO FILME?',
      'O FILME ESTÁ ALINHADO?',
      'AS BALANÇAS ESTÃO REGULADAS?',
      'O SACHÊ ESTÁ SEM VAZAMENTO?',
      'O CICLO/MIN ESTÁ CONFORME EM RELAÇÃO AO PROGRAMADO NA MÁQUINA?',
      'O BOTÃO DE EMERGÊNCIA ESTÁ FUNCIONANDO REGULARMENTE?',
      'AS PORTAS ESTÃO DEVIDAMENTE FECHADAS?',
      'Seguir a IT-PD006 00'],
    'BALDES': ['O ajuste de peças que possam soltar durante o processo da envasadora foi realizado corretamente?',
      'PARAFUSOS DA ESCOTILHA DA MESA SELEÇÃO',
      'PARAFUSOS DA BICA DA ESTEIRA DE SELEÇÃO',
      'MANCAL DA TOLVA ALIMENTADORA DA BALANÇA',
      'PARAFUSOS DA BICA',
      'PARAFUSOS DA CORTINA DO FUNIL DA BALANÇA',
      'PARAFUSOS DO FUNIL DA BALANÇA',
      'PARAFUSOS E MOLAS DAS CAÇAMBAS',
      'PARAFUSOS DO DOSADOR DE SALMOURA',
      'PARAFUSOS DO SUPORTE DO SENSOR',
      'FOI CALIBRADA A MÁQUINA COM O PESO LÍQUIDO E DRENADO? ESTÁ CORRETO?',
      'A MÁQUINA ESTÁ AJUSTADA DE ACORDO COM O FORMATO DO BALDE?',
      'A TAMPADORA ESTÁ REGULADA EM RELAÇÃO AO FORMATO DA TAMPA?',
      'O BOTÃO DE EMERGÊNCIA ESTÁ FUNCIONANDO REGULARMENTE?',
      'AS PORTAS ESTÃO DEVIDAMENTE FECHADAS?',
      'Seguir a IT-PD014 00'],
    'BOSSAR': ['O ajuste de peças que possam soltar durante o processo da envasadora foi realizado corretamente?',
      'PARAFUSOS DA ESCOTILHA DA ESTEIRA DE SELEÇÃO',
      'PARAFUSOS DA BICA DE ALIMENTAÇÃO CISNE',
      'PARAFUSOS DO SUPORTE DA LUMINÁRIA NA MESA DE SELEÇÃO',
      'PARAFUSOS DO SUPORTE DE LUMINÁRIAS DA MESA DE SELEÇÃO',
      'PARAFUSOS DAS CAÇAMBAS COLETORAS E PESADORAS DA BALANÇA',
      'PARAFUSOS DAS VARETAS DE NÍVEL DA ESTEIRA DA BALANÇA',
      'PARAFUSOS E PORCAS DO FUNIL DA BALANÇA',
      'PARAFUSOS DA BICA DA ESTEIRA DO CISNE',
      'PARAFUSOS DA ESTEIRA DE ALIMENTADORA DA BALANÇA',
      'PARAFUSOS DO TIMER HOLP',
      'A MÁQUINA FOI CALIBRADA - PESO LÍQUIDO E PESO DRENADO?',
      'O DATADOR ESTÁ CORRETO EM RELAÇÃO AO LOTE?',
      'AS TEMPERATURAS DAS SOLDAS ESTÃO CORRETAS EM RELAÇÃO AO FILME?',
      'O FILME ESTÁ ALINHADO?',
      'AS BALANÇAS ESTÃO REGULADAS?',
      'A PRESSÃO DO AR ESTÁ CORRETA?',
      'O SACHÊ ESTÁ SEM VAZAMENTO?',
      'O CICLO/MIN ESTÁ CONFORME EM RELAÇÃO AO PROGRAMADO NA MÁQUINA?',
      'O BOTÃO DE EMERGÊNCIA ESTÁ FUNCIONANDO REGULARMENTE?',
      'AS PORTAS ESTÃO DEVIDAMENTE FECHADAS?',
      'Seguir a IT-PD002 00'],
    'DESCAROÇADEIRA E RECHEADORA': ['A MAQUINA ESTÁ REGULADA?',
      'O BOTÃO DE EMERGÊNCIA ESTÁ FUNCIONANDO REGULARMENTE?',
      'RECEITA DA PASTA ESTÁ CORRETA?',
      'PERCENTUAL DE AZEITONAS COM CAROÇO ESTÁ DENTRO DO ESPECIFICADO?',
      'CONCENTRAÇÃO DE SAL NO DENSIMETRO ESTÁ CORRETA?',
      'ESTÁ SENDO UTILIZADO ÁGUA BLANDA NO PREPARO DA PASTA ?']
  };

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private wizardService: WizardService // 2. INJETAR O SERVIÇO
  ) {
    this.infoGroup = this.fb.group({
      produto: ['', Validators.required],
      lote: ['', Validators.required],
      responsavel: ['', Validators.required],
      horario: ['', Validators.required],
      linha: ['', Validators.required]
    });

    this.form = this.fb.group({
      respostas: this.fb.array([]),
      observacoes: [''],
      acoes: ['']
    });
  }

  abrirErro(mensagem: string) {
    this.dialog.open(ErroDialogComponent, {
      data: { mensagem },
      width: '350px'
    });
  }

  ngOnInit(): void {
    this.infoGroup.get('linha')?.valueChanges.subscribe((linhaSelecionada) => {
      this.perguntas = this.perguntasPorLinha[linhaSelecionada] || [];
      this.recriarFormArray();
    });
  }

  recriarFormArray() {
    const respostasArray: FormArray = this.fb.array(
      this.perguntas.map(() =>
        this.fb.group({
          resposta: this.fb.control('', Validators.required)
        })
      )
    );
    this.form.setControl('respostas', respostasArray);
  }

  get respostas(): FormArray {
    return this.form.get('respostas') as FormArray;
  }

// checklist-wizard.component.ts

  next(): void {
    if (this.currentStep < this.totalSteps) {
      if (this.currentStep === 1 && this.infoGroup.invalid) {
        this.infoGroup.markAllAsTouched();
        this.abrirErro("Preencha todas as informações iniciais antes de continuar.");
        return;
      }

      if (this.currentStep === 2 || this.currentStep === 3) {
        const respostasArray = this.form.get('respostas') as FormArray;
        const start = this.currentStep === 2 ? 0 : 14;

        // AQUI ESTÁ A CORREÇÃO!
        // Usamos Math.min para garantir que o 'end' não ultrapasse o número total de perguntas.
        const end = this.currentStep === 2 ? Math.min(14, respostasArray.length) : respostasArray.length;

        for (let i = start; i < end; i++) {
          const group = respostasArray.at(i) as FormGroup;

          // Adicionamos uma verificação para ter certeza que o 'group' existe antes de usá-lo
          if (group && group.invalid) {
            group.markAllAsTouched();
            this.abrirErro("Responda todas as perguntas obrigatórias antes de continuar.");
            return;
          }
        }
      }

      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.submit();
    }
  }
  prev() {
    if (this.currentStep > 1) this.currentStep--;
  }

  // 4. NOVA FUNÇÃO PARA ENVIAR OS DADOS
  submit(): void {
    if (this.infoGroup.invalid || this.form.invalid) {
      this.infoGroup.markAllAsTouched();
      this.form.markAllAsTouched();
      this.abrirErro("Existem campos inválidos. Por favor, revise todos os passos.");
      return;
    }

    // 1. Transforma o array de respostas para o formato desejado
    const respostasFormatadas = this.form.value.respostas.map((item: any, index: number) => {
      const pergunta = this.perguntas[index]; // Pega o texto da pergunta correspondente
      return { [pergunta]: item.resposta }; // Cria um objeto com a pergunta como chave
    });

    // Estrutura os dados para envio
    const dadosParaEnviar = {
      titulo_formulario: 'Checklist de Conferentes',
      dados_iniciais: this.infoGroup.value,
      respostas_checklist: respostasFormatadas, // <-- USA A VARIÁVEL NOVA AQUI
      observacoes: this.form.value.observacoes,
      acoes: this.form.value.acoes
    };

    this.wizardService.salvarChecklist(dadosParaEnviar).subscribe({
      next: (response) => {
        console.log('Checklist salvo com sucesso!', response);
        alert('Formulário enviado com sucesso!');
        this.currentStep = 1;
        this.infoGroup.reset();
        this.form.reset();
      },
      error: (err) => {
        console.error('Erro ao salvar o checklist:', err);
        this.abrirErro('Ocorreu um erro ao enviar o formulário. Tente novamente.');
      }
    });
  }
}
