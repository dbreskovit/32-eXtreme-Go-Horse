/**
 * "Banco" mockado persistido em localStorage.
 * Usado no modo de apresentação (sem backend). Ver mocks/config.ts.
 */

const DB_KEY = 'fg_mock_db'
const SEED_VERSION = 6 // bump para forçar re-seed

export interface MockEmpresa {
  id: string; razaoSocial: string; cnpj: string; email: string; telefone: string; senha: string
}
export interface MockUsuario {
  id: string; nome: string; email: string; senha: string; papel: string; empresaId: string
}
export interface MockUnidade {
  id: string; nome: string; cidade: string; estado: string; endereco: string; ativa: boolean; empresaId: string
}
export interface MockDoca {
  id: string; nome: string; tipoCarga: string; capacidadeTonHora: number; ativa: boolean; unidadeId: string
}
export interface MockHorario {
  id: string; diaSemana: number; horaInicio: string; horaFim: string; docaId: string
}
export interface MockMotorista {
  id: string; nome: string; telefone: string; cnh?: string; scorePontualidade: number
}
export interface MockVeiculo {
  id: string; placa: string; tipo: string; capacidadeTon: number; motoristaId: string
}
export interface MockAgendamento {
  id: string; codigo: string; empresaId: string; docaId: string; motoristaId: string; veiculoId: string
  dataHoraAgendada: string; volumeTon: number; status: string; qrCodeUrl?: string; observacoes?: string
}

export interface MockDb {
  meta: { version: number; day: string }
  empresas: MockEmpresa[]
  usuarios: MockUsuario[]
  unidades: MockUnidade[]
  docas: MockDoca[]
  horarios: MockHorario[]
  motoristas: MockMotorista[]
  veiculos: MockVeiculo[]
  agendamentos: MockAgendamento[]
}

// ─── helpers ─────────────────────────────────────────────────────────────────
let counter = 0
export function uid(prefix = 'id'): string {
  counter += 1
  return `${prefix}-${Date.now().toString(36)}-${counter}-${Math.random().toString(36).slice(2, 7)}`
}

export function gerarCodigo(): string {
  return 'FG-' + Math.random().toString(36).slice(2, 6).toUpperCase()
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function todayAt(hour: number, minute = 0): string {
  const d = new Date()
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

function daysAgoAt(days: number, hour: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

// ─── seed ────────────────────────────────────────────────────────────────────
function seed(): MockDb {
  const empresaId = 'emp-demo'
  // Credenciais batem com as sugeridas na tela de login (LoginPage)
  const empresas: MockEmpresa[] = [{
    id: empresaId, razaoSocial: 'Cooperativa Agro XPTO', cnpj: '12.345.678/0001-99',
    email: 'carlos@empresaxpto.com.br', telefone: '(55) 3522-1000', senha: 'senha123',
  }]
  const usuarios: MockUsuario[] = [{
    id: 'usr-demo', nome: 'Carlos Henrique', email: 'carlos@empresaxpto.com.br',
    senha: 'senha123', papel: 'gerente', empresaId,
  }]

  const unidades: MockUnidade[] = [
    { id: 'uni-1', nome: 'Silo Matriz — Passo Fundo', cidade: 'Passo Fundo', estado: 'RS', endereco: 'BR-285, Km 100', ativa: true, empresaId },
    { id: 'uni-2', nome: 'Filial Cruz Alta', cidade: 'Cruz Alta', estado: 'RS', endereco: 'RS-342, Km 12', ativa: true, empresaId },
  ]

  const docas: MockDoca[] = [
    { id: 'doc-1', nome: 'Doca 1 — Soja', tipoCarga: 'Soja', capacidadeTonHora: 80, ativa: true, unidadeId: 'uni-1' },
    { id: 'doc-2', nome: 'Doca 2 — Milho', tipoCarga: 'Milho', capacidadeTonHora: 60, ativa: true, unidadeId: 'uni-1' },
    { id: 'doc-3', nome: 'Doca 3 — Trigo', tipoCarga: 'Trigo', capacidadeTonHora: 50, ativa: false, unidadeId: 'uni-1' },
    { id: 'doc-4', nome: 'Doca 1 — Soja', tipoCarga: 'Soja', capacidadeTonHora: 70, ativa: true, unidadeId: 'uni-2' },
    { id: 'doc-5', nome: 'Doca 2 — Milho', tipoCarga: 'Milho', capacidadeTonHora: 55, ativa: true, unidadeId: 'uni-2' },
  ]

  // Horários: todas as docas, todos os dias (0..6), 07:00–19:00
  const horarios: MockHorario[] = []
  for (const d of docas) {
    for (let dia = 0; dia <= 6; dia++) {
      horarios.push({ id: uid('hor'), diaSemana: dia, horaInicio: '07:00:00', horaFim: '19:00:00', docaId: d.id })
    }
  }

  const motoristas: MockMotorista[] = [
    { id: 'mot-1', nome: 'João da Silva', telefone: '(55) 99876-5432', cnh: '12345678900', scorePontualidade: 92 },
    { id: 'mot-2', nome: 'Pedro Alves', telefone: '(54) 99123-4567', cnh: '22233344455', scorePontualidade: 78 },
    { id: 'mot-3', nome: 'Marcos Teixeira', telefone: '(49) 99654-3210', cnh: '33344455566', scorePontualidade: 95 },
    { id: 'mot-4', nome: 'Roberto Souza', telefone: '(55) 98765-4321', cnh: '44455566677', scorePontualidade: 61 },
  ]
  const veiculos: MockVeiculo[] = [
    { id: 'vei-1', placa: 'ABC1D23', tipo: 'Bitrem', capacidadeTon: 45, motoristaId: 'mot-1' },
    { id: 'vei-2', placa: 'DEF4E56', tipo: 'Romeu e Julieta', capacidadeTon: 57, motoristaId: 'mot-2' },
    { id: 'vei-3', placa: 'GHI7F89', tipo: 'Carreta Simples', capacidadeTon: 30, motoristaId: 'mot-3' },
    { id: 'vei-4', placa: 'JKL0G12', tipo: 'Bitrem', capacidadeTon: 45, motoristaId: 'mot-4' },
  ]

  const qr = (c: string) => `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${c}`
  const agendamentos: MockAgendamento[] = [
    { id: 'age-1', codigo: 'FG-2847', empresaId, docaId: 'doc-1', motoristaId: 'mot-2', veiculoId: 'vei-2', dataHoraAgendada: todayAt(8),  volumeTon: 38, status: 'concluido',     qrCodeUrl: qr('FG-2847') },
    { id: 'age-2', codigo: 'FG-2848', empresaId, docaId: 'doc-1', motoristaId: 'mot-3', veiculoId: 'vei-3', dataHoraAgendada: todayAt(9),  volumeTon: 14, status: 'concluido',     qrCodeUrl: qr('FG-2848') },
    { id: 'age-3', codigo: 'FG-2849', empresaId, docaId: 'doc-2', motoristaId: 'mot-4', veiculoId: 'vei-4', dataHoraAgendada: todayAt(10), volumeTon: 40, status: 'descarregando', qrCodeUrl: qr('FG-2849') },
    { id: 'age-4', codigo: 'FG-2850', empresaId, docaId: 'doc-2', motoristaId: 'mot-1', veiculoId: 'vei-1', dataHoraAgendada: todayAt(11), volumeTon: 30, status: 'em_patio',     qrCodeUrl: qr('FG-2850'), observacoes: 'Caminhão no pátio' },
    { id: 'age-5', codigo: 'FG-2851', empresaId, docaId: 'doc-3', motoristaId: 'mot-2', veiculoId: 'vei-2', dataHoraAgendada: todayAt(14), volumeTon: 36, status: 'agendado',     qrCodeUrl: qr('FG-2851') },
    { id: 'age-6', codigo: 'FG-2852', empresaId, docaId: 'doc-1', motoristaId: 'mot-3', veiculoId: 'vei-3', dataHoraAgendada: todayAt(15), volumeTon: 20, status: 'agendado',     qrCodeUrl: qr('FG-2852') },
    { id: 'age-7', codigo: 'FG-2853', empresaId, docaId: 'doc-4', motoristaId: 'mot-4', veiculoId: 'vei-4', dataHoraAgendada: todayAt(16), volumeTon: 25, status: 'agendado',     qrCodeUrl: qr('FG-2853') },
    { id: 'age-8', codigo: 'FG-2854', empresaId, docaId: 'doc-1', motoristaId: 'mot-2', veiculoId: 'vei-2', dataHoraAgendada: todayAt(17), volumeTon: 10, status: 'cancelado',    qrCodeUrl: qr('FG-2854'), observacoes: 'Cancelado pelo motorista' },
    // Horários LOTADOS na Doca 1 (80t/h): 10:00 e 13:00 saturados por entregas → aparecem como "Lotado" no agendamento
    { id: 'age-11', codigo: 'FG-2855', empresaId, docaId: 'doc-1', motoristaId: 'mot-3', veiculoId: 'vei-3', dataHoraAgendada: todayAt(10), volumeTon: 45, status: 'concluido', qrCodeUrl: qr('FG-2855') },
    { id: 'age-12', codigo: 'FG-2856', empresaId, docaId: 'doc-1', motoristaId: 'mot-4', veiculoId: 'vei-4', dataHoraAgendada: todayAt(10), volumeTon: 35, status: 'concluido', qrCodeUrl: qr('FG-2856') },
    { id: 'age-13', codigo: 'FG-2857', empresaId, docaId: 'doc-1', motoristaId: 'mot-2', veiculoId: 'vei-2', dataHoraAgendada: todayAt(13), volumeTon: 40, status: 'agendado',  qrCodeUrl: qr('FG-2857') },
    { id: 'age-14', codigo: 'FG-2858', empresaId, docaId: 'doc-1', motoristaId: 'mot-4', veiculoId: 'vei-4', dataHoraAgendada: todayAt(13), volumeTon: 40, status: 'agendado',  qrCodeUrl: qr('FG-2858') },
    { id: 'age-9', codigo: 'FG-2840', empresaId, docaId: 'doc-1', motoristaId: 'mot-2', veiculoId: 'vei-2', dataHoraAgendada: daysAgoAt(1, 9),  volumeTon: 40, status: 'concluido', qrCodeUrl: qr('FG-2840') },
    { id: 'age-10', codigo: 'FG-2841', empresaId, docaId: 'doc-2', motoristaId: 'mot-3', veiculoId: 'vei-3', dataHoraAgendada: daysAgoAt(2, 10), volumeTon: 55, status: 'concluido', qrCodeUrl: qr('FG-2841') },
  ]

  return {
    meta: { version: SEED_VERSION, day: todayKey() },
    empresas, usuarios, unidades, docas, horarios, motoristas, veiculos, agendamentos,
  }
}

// ─── persistência ────────────────────────────────────────────────────────────
let cache: MockDb | null = null

export function getDb(): MockDb {
  if (cache) return cache
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as MockDb
      // Re-seed se versão mudou ou se virou o dia (mantém o dashboard "de hoje")
      if (parsed?.meta?.version === SEED_VERSION && parsed?.meta?.day === todayKey()) {
        cache = parsed
        return cache
      }
    }
  } catch {
    /* ignora e re-seed */
  }
  cache = seed()
  saveDb(cache)
  return cache
}

export function saveDb(db: MockDb): void {
  cache = db
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

export function resetMockDb(): void {
  cache = seed()
  localStorage.setItem(DB_KEY, JSON.stringify(cache))
}
