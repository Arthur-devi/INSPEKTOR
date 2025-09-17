export interface Desvio {
  destinoProdutoInterditado: boolean;
  acaoTrocaFornecedor: boolean;
  acaoOrientacaoFuncionario: boolean;
  acaoMaisPessoas: boolean;
  acaoAbaixarSuporte: boolean;
  eficienciaAcao: string;
  novaAcaoDesvio: string;
  acaoCorretivaEficaz: string;
}

// Renomeado de DadosRespostas para ser mais específico
export interface DadosRespostasQualidade {
  linha: string;
  data: string;
  nome: string;
  produto: string;
  variedade?: string;
  codBarrica?: string;
  nf?: string;
  calibre?: string | number;
  fornecedor?: string;
  avaliacaoMateriaPrima?: string;
  numAmostras?: number;
  hora?: string;
  pesoDrenado?: number;
  pesoLiquido?: number;
  pesoSemSalmoura?: number;
  desvioMaquina?: string;
  selecaoDefeitos?: string;
  pcc1f?: number;
  encaixotamento?: string;
  selagem?: string;
  codificacaoLote?: string;
  codificacaoCaixa?: string;
  observacoes?: string;
  desvio?: Desvio;
  formulario?: string;
}

// Renomeado de SubmissaoCompleta para ser mais específico
export interface SubmissaoQualidade {
  id: number;
  titulo_formulario: string;
  dados_respostas: DadosRespostasQualidade;
  data_envio: string;
  path_foto_materia_prima?: string;
  path_foto_observacoes?: string;
}

// --- NOVAS INTERFACES PARA FORMULÁRIOS DE CONFERENTES ---
export interface DadosIniciaisConferente {
  produto: string;
  lote: string;
  responsavel: string;
  horario: string;
  linha: string;
}

export interface SubmissaoConferente {
  id: number;
  titulo_formulario: string;
  dados_iniciais: DadosIniciaisConferente;
  respostas_checklist: { resposta: string }[];
  observacoes: string;
  acoes: string;
  data_envio: string;
}


// --- INTERFACE UNIVERSAL PARA GERENCIAMENTO DE FORMULÁRIOS ---

export interface Formulario {
  id: number;
  nome: string;
  descricao: string;
  icone: string;
  rota: string;
  ativo: boolean;
  permission: string;
}


// ... (suas interfaces existentes) ...

// NOVA INTERFACE PARA UTILIZADORES
export interface User {
  id: number;
  name: string;
  email: string;
  op: number;
  password?: string; // Opcional, usado apenas ao criar/editar
}
