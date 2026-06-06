import type {
  Plano, Empresa, UsuarioEmpresa, Unidade, Doca,
  Motorista, Veiculo, Agendamento, DashboardHoje, FluxoHora, Slot,
} from '../types'

export const PLANOS: Plano[] = [
  {
    id: '1', nome: 'Gratuito', maxUnidades: 1, precoMensal: 0,
    descricao: 'Ideal para testar a plataforma com 1 unidade',
  },
  {
    id: '2', nome: 'Regional', maxUnidades: 5, precoMensal: 690,
    descricao: 'Para cooperativas com até 5 unidades de recebimento',
  },
  {
    id: '3', nome: 'Enterprise', maxUnidades: 999, precoMensal: -1,
    descricao: 'Tradings e portos — API dedicada + SLA garantido',
  },
]

export const EMPRESA: Empresa = {
  id: 'emp-1',
  razaoSocial: 'Cooperativa Tritícola Três Passos Ltda.',
  cnpj: '12.345.678/0001-90',
  email: 'operacoes@cotripal.com.br',
  telefone: '(55) 3522-1234',
  plano: PLANOS[1],
}

export const USUARIO_LOGADO: UsuarioEmpresa = {
  id: 'usr-1',
  nome: 'Carlos Henrique',
  email: 'carlos@cotripal.com.br',
  papel: 'gerente',
  empresaId: 'emp-1',
}

export const MOTORISTA_LOGADO: Motorista = {
  id: 'mot-1',
  nome: 'João da Silva',
  telefone: '(55) 99876-5432',
  cnh: '12345678901',
  scorePontualidade: 92,
}

export const VEICULO_MOTORISTA: Veiculo = {
  id: 'vei-1',
  placa: 'ABC-1D23',
  tipo: 'Bitrem',
  capacidadeTon: 45,
}

export const UNIDADES: Unidade[] = [
  { id: 'uni-1', nome: 'Silo Matriz — Três Passos', cidade: 'Três Passos', estado: 'RS', endereco: 'RS-155, Km 42', totalDocas: 3 },
  { id: 'uni-2', nome: 'Filial Tiradentes do Sul', cidade: 'Tiradentes do Sul', estado: 'RS', endereco: 'Av. Brasil, 800', totalDocas: 2 },
]

export const DOCAS: Doca[] = [
  { id: 'doc-1', nome: 'Doca 1 — Soja', tipoCarga: 'Soja', capacidadeTonHora: 120, unidadeId: 'uni-1', ativa: true },
  { id: 'doc-2', nome: 'Doca 2 — Milho', tipoCarga: 'Milho', capacidadeTonHora: 100, unidadeId: 'uni-1', ativa: true },
  { id: 'doc-3', nome: 'Doca 3 — Trigo', tipoCarga: 'Trigo', capacidadeTonHora: 80, unidadeId: 'uni-1', ativa: false },
  { id: 'doc-4', nome: 'Doca 1 — Soja/Milho', tipoCarga: 'Soja/Milho', capacidadeTonHora: 110, unidadeId: 'uni-2', ativa: true },
  { id: 'doc-5', nome: 'Doca 2 — Trigo', tipoCarga: 'Trigo', capacidadeTonHora: 70, unidadeId: 'uni-2', ativa: true },
]

const MOTORISTAS: Motorista[] = [
  { id: 'mot-1', nome: 'João da Silva', telefone: '(55) 99876-5432', cnh: '12345678901', scorePontualidade: 92 },
  { id: 'mot-2', nome: 'Pedro Alves', telefone: '(54) 99123-4567', cnh: '98765432100', scorePontualidade: 78 },
  { id: 'mot-3', nome: 'Marcos Teixeira', telefone: '(49) 99654-3210', cnh: '45678901234', scorePontualidade: 95 },
  { id: 'mot-4', nome: 'Roberto Souza', telefone: '(55) 98765-4321', cnh: '56789012345', scorePontualidade: 61 },
]

const VEICULOS: Veiculo[] = [
  { id: 'vei-1', placa: 'ABC-1D23', tipo: 'Bitrem', capacidadeTon: 45 },
  { id: 'vei-2', placa: 'DEF-4E56', tipo: 'Romeu e Julieta', capacidadeTon: 57 },
  { id: 'vei-3', placa: 'GHI-7F89', tipo: 'Carreta Simples', capacidadeTon: 30 },
  { id: 'vei-4', placa: 'JKL-0G12', tipo: 'Bitrem', capacidadeTon: 45 },
]

export const AGENDAMENTOS: Agendamento[] = [
  {
    id: 'age-1', codigo: 'FG-2847', doca: DOCAS[0], unidade: UNIDADES[0],
    motorista: MOTORISTAS[0], veiculo: VEICULOS[0],
    dataHoraAgendada: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    volumeTon: 42, status: 'em_patio',
  },
  {
    id: 'age-2', codigo: 'FG-2848', doca: DOCAS[1], unidade: UNIDADES[0],
    motorista: MOTORISTAS[1], veiculo: VEICULOS[1],
    dataHoraAgendada: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    volumeTon: 55, status: 'descarregando',
  },
  {
    id: 'age-3', codigo: 'FG-2849', doca: DOCAS[0], unidade: UNIDADES[0],
    motorista: MOTORISTAS[2], veiculo: VEICULOS[2],
    dataHoraAgendada: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    volumeTon: 28, status: 'agendado',
  },
  {
    id: 'age-4', codigo: 'FG-2850', doca: DOCAS[1], unidade: UNIDADES[0],
    motorista: MOTORISTAS[3], veiculo: VEICULOS[3],
    dataHoraAgendada: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    volumeTon: 44, status: 'agendado',
  },
  {
    id: 'age-5', codigo: 'FG-2845', doca: DOCAS[0], unidade: UNIDADES[0],
    motorista: MOTORISTAS[0], veiculo: VEICULOS[0],
    dataHoraAgendada: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    volumeTon: 41, status: 'concluido',
  },
  {
    id: 'age-6', codigo: 'FG-2846', doca: DOCAS[1], unidade: UNIDADES[0],
    motorista: MOTORISTAS[1], veiculo: VEICULOS[1],
    dataHoraAgendada: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    volumeTon: 50, status: 'concluido',
  },
]

export const DASHBOARD_HOJE: DashboardHoje = {
  totalAgendados: 18,
  emPatio: 2,
  descarregando: 1,
  concluidos: 7,
  cancelados: 1,
  proximasChegadas: AGENDAMENTOS.filter(a =>
    ['agendado', 'em_patio', 'descarregando'].includes(a.status)
  ).slice(0, 5),
}

export const FLUXO_HORA: FluxoHora[] = [
  { hora: '06h', total: 1, concluidos: 1 },
  { hora: '07h', total: 2, concluidos: 2 },
  { hora: '08h', total: 4, concluidos: 3 },
  { hora: '09h', total: 6, concluidos: 5 },
  { hora: '10h', total: 5, concluidos: 4 },
  { hora: '11h', total: 3, concluidos: 2 },
  { hora: '12h', total: 1, concluidos: 1 },
  { hora: '13h', total: 2, concluidos: 0 },
  { hora: '14h', total: 4, concluidos: 0 },
  { hora: '15h', total: 3, concluidos: 0 },
  { hora: '16h', total: 2, concluidos: 0 },
  { hora: '17h', total: 1, concluidos: 0 },
]

export const SLOTS: Slot[] = [
  { horaInicio: '06:00', horaFim: '07:00', capacidadeDisponivel: 120, ocupado: true },
  { horaInicio: '07:00', horaFim: '08:00', capacidadeDisponivel: 40, ocupado: false },
  { horaInicio: '08:00', horaFim: '09:00', capacidadeDisponivel: 0, ocupado: true },
  { horaInicio: '09:00', horaFim: '10:00', capacidadeDisponivel: 0, ocupado: true },
  { horaInicio: '10:00', horaFim: '11:00', capacidadeDisponivel: 80, ocupado: false },
  { horaInicio: '11:00', horaFim: '12:00', capacidadeDisponivel: 120, ocupado: false },
  { horaInicio: '13:00', horaFim: '14:00', capacidadeDisponivel: 120, ocupado: false },
  { horaInicio: '14:00', horaFim: '15:00', capacidadeDisponivel: 30, ocupado: false },
  { horaInicio: '15:00', horaFim: '16:00', capacidadeDisponivel: 0, ocupado: true },
  { horaInicio: '16:00', horaFim: '17:00', capacidadeDisponivel: 120, ocupado: false },
  { horaInicio: '17:00', horaFim: '18:00', capacidadeDisponivel: 90, ocupado: false },
]
