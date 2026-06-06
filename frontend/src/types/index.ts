export type StatusAgendamento =
  | 'agendado'
  | 'em_patio'
  | 'descarregando'
  | 'concluido'
  | 'cancelado'

export type PapelUsuario = 'gerente' | 'operador'
export type TipoUsuario = 'empresa' | 'motorista'

export interface Plano {
  id: string
  nome: string
  maxUnidades: number
  precoMensal: number
  descricao: string
}

export interface Empresa {
  id: string
  razaoSocial: string
  cnpj: string
  email: string
  telefone: string
  plano: Plano
}

export interface UsuarioEmpresa {
  id: string
  nome: string
  email: string
  papel: PapelUsuario
  empresaId: string
}

export interface Unidade {
  id: string
  nome: string
  cidade: string
  estado: string
  endereco: string
  totalDocas: number
}

export interface Doca {
  id: string
  nome: string
  tipoCarga: string
  capacidadeTonHora: number
  unidadeId: string
  ativa: boolean
}

export interface Motorista {
  id: string
  nome: string
  telefone: string
  cnh: string
  scorePontualidade: number
}

export interface Veiculo {
  id: string
  placa: string
  tipo: string
  capacidadeTon: number
}

export interface Agendamento {
  id: string
  codigo: string
  doca: Doca
  unidade: Unidade
  motorista: Motorista
  veiculo: Veiculo
  dataHoraAgendada: string
  volumeTon: number
  status: StatusAgendamento
  qrCodeUrl?: string
  observacoes?: string
}

export interface DashboardHoje {
  totalAgendados: number
  emPatio: number
  descarregando: number
  concluidos: number
  cancelados: number
  proximasChegadas: Agendamento[]
}

export interface FluxoHora {
  hora: string
  total: number
  concluidos: number
}

export interface Slot {
  horaInicio: string
  horaFim: string
  capacidadeDisponivel: number
  ocupado: boolean
}
