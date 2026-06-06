/**
 * Adapter de mock para o axios. Intercepta todas as chamadas de `api` e
 * responde usando o "banco" em localStorage (mocks/db.ts). Nenhum hook ou
 * página precisa mudar — eles continuam chamando api.get/post/patch/put/delete.
 */
import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { getDb, saveDb, uid, gerarCodigo, type MockAgendamento } from './db'

const LATENCIA_MS = 140

// ─── respostas ───────────────────────────────────────────────────────────────
function ok<T>(data: T, config: InternalAxiosRequestConfig, status = 200): AxiosResponse<T> {
  return { data, status, statusText: 'OK', headers: {}, config, request: {} }
}

function fail(status: number, message: string, config: InternalAxiosRequestConfig) {
  return Promise.reject({
    isAxiosError: true,
    message,
    config,
    response: { status, statusText: 'Error', headers: {}, config, data: { message, statusCode: status } },
  })
}

// ─── auth ────────────────────────────────────────────────────────────────────
function tokenFor(tipo: 'empresa' | 'motorista', id: string) {
  return `mock.${tipo}.${id}`
}

function currentAuth(config: InternalAxiosRequestConfig): { tipo: string; id: string } | null {
  const raw = (config.headers?.Authorization ?? (config.headers as any)?.authorization) as string | undefined
  if (!raw) return null
  const [pfx, tipo, id] = raw.replace('Bearer ', '').split('.')
  if (pfx !== 'mock' || !tipo || !id) return null
  return { tipo, id }
}

const soDigitos = (s: string) => (s ?? '').replace(/\D/g, '')

// ─── hidratação ──────────────────────────────────────────────────────────────
function hydrateUnidade(unidadeId: string) {
  const db = getDb()
  const u = db.unidades.find(x => x.id === unidadeId)
  if (!u) return undefined
  return { id: u.id, nome: u.nome, cidade: u.cidade, estado: u.estado, endereco: u.endereco, totalDocas: db.docas.filter(d => d.unidadeId === u.id).length }
}

function hydrateAgendamento(a: MockAgendamento) {
  const db = getDb()
  const doca = db.docas.find(d => d.id === a.docaId)
  const mot = db.motoristas.find(m => m.id === a.motoristaId)
  const vei = db.veiculos.find(v => v.id === a.veiculoId)
  return {
    id: a.id, codigo: a.codigo, status: a.status, dataHoraAgendada: a.dataHoraAgendada,
    volumeTon: a.volumeTon, observacoes: a.observacoes, qrCodeUrl: a.qrCodeUrl,
    doca: doca
      ? { id: doca.id, nome: doca.nome, tipoCarga: doca.tipoCarga, capacidadeTonHora: doca.capacidadeTonHora, unidadeId: doca.unidadeId, ativa: doca.ativa }
      : { id: a.docaId, nome: '—', tipoCarga: '', capacidadeTonHora: 0, unidadeId: '', ativa: false },
    motorista: mot
      ? { id: mot.id, nome: mot.nome, telefone: mot.telefone, cnh: mot.cnh, scorePontualidade: mot.scorePontualidade }
      : { id: a.motoristaId, nome: '—', telefone: '' },
    veiculo: vei
      ? { id: vei.id, placa: vei.placa, tipo: vei.tipo, capacidadeTon: vei.capacidadeTon }
      : { id: a.veiculoId, placa: '—', tipo: '', capacidadeTon: 0 },
    unidade: doca ? hydrateUnidade(doca.unidadeId) : undefined,
  }
}

// ─── slots (mesma lógica do backend) ─────────────────────────────────────────
function calcularSlots(docaId: string, dataStr: string) {
  const db = getDb()
  const doca = db.docas.find(d => d.id === docaId && d.ativa)
  if (!doca) return []
  const data = new Date(dataStr + 'T00:00:00')
  const diaSemana = data.getDay()
  const horarios = db.horarios.filter(h => h.docaId === docaId && h.diaSemana === diaSemana)
  if (horarios.length === 0) return []

  const doDia = db.agendamentos.filter(a =>
    a.docaId === docaId &&
    a.status !== 'cancelado' &&
    new Date(a.dataHoraAgendada).toISOString().slice(0, 10) === dataStr,
  )

  const slots: Array<{ horaInicio: string; horaFim: string; capacidadeDisponivel: number; ocupado: boolean }> = []
  for (const h of horarios) {
    let hora = parseInt(h.horaInicio.split(':')[0], 10)
    const fim = parseInt(h.horaFim.split(':')[0], 10)
    while (hora < fim) {
      const volumeOcupado = doDia
        .filter(a => new Date(a.dataHoraAgendada).getHours() === hora)
        .reduce((s, a) => s + Number(a.volumeTon), 0)
      const disp = Number(doca.capacidadeTonHora) - volumeOcupado
      slots.push({
        horaInicio: `${String(hora).padStart(2, '0')}:00`,
        horaFim: `${String(hora + 1).padStart(2, '0')}:00`,
        capacidadeDisponivel: Math.max(0, disp),
        ocupado: disp <= 0,
      })
      hora++
    }
  }
  return slots
}

// ─── roteador ────────────────────────────────────────────────────────────────
type Ctx = {
  config: InternalAxiosRequestConfig
  body: any
  query: URLSearchParams
  auth: { tipo: string; id: string } | null
}

interface Rota {
  method: string
  re: RegExp
  handler: (m: RegExpMatchArray, ctx: Ctx) => any
}

const rotas: Rota[] = [
  // ── AUTH ──
  { method: 'post', re: /^\/auth\/empresa\/login$/, handler: (_m, { body, config }) => {
    const db = getDb()
    const u = db.usuarios.find(x => x.email.toLowerCase() === String(body.email).toLowerCase() && x.senha === body.senha)
    if (!u) throw fail(401, 'Credenciais inválidas', config)
    return { access_token: tokenFor('empresa', u.id) }
  } },

  { method: 'post', re: /^\/auth\/empresa\/register$/, handler: (_m, { body }) => {
    const db = getDb()
    const empresaId = uid('emp')
    db.empresas.push({ id: empresaId, razaoSocial: body.razaoSocial, cnpj: body.cnpj, email: body.email, telefone: body.telefone ?? '', senha: body.senhaGerente })
    const usr = { id: uid('usr'), nome: body.nomeGerente ?? body.email.split('@')[0], email: body.email, senha: body.senhaGerente, papel: 'gerente', empresaId }
    db.usuarios.push(usr)
    saveDb(db)
    return { access_token: tokenFor('empresa', usr.id) }
  } },

  { method: 'post', re: /^\/auth\/motorista\/login$/, handler: (_m, { body }) => {
    const db = getDb()
    let mot = db.motoristas.find(m => soDigitos(m.telefone) === soDigitos(body.telefone))
    if (!mot) {
      mot = { id: uid('mot'), nome: 'Motorista', telefone: body.telefone, scorePontualidade: 100 }
      db.motoristas.push(mot)
    }
    let vei = db.veiculos.find(v => soDigitos(v.placa).toUpperCase() === soDigitos(body.placa).toUpperCase() || v.placa.toUpperCase() === String(body.placa).toUpperCase())
    if (!vei) {
      vei = { id: uid('vei'), placa: String(body.placa).toUpperCase(), tipo: 'Desconhecido', capacidadeTon: 0, motoristaId: mot.id }
      db.veiculos.push(vei)
    } else if (vei.motoristaId !== mot.id) {
      vei.motoristaId = mot.id
    }
    saveDb(db)
    return { access_token: tokenFor('motorista', mot.id) }
  } },

  { method: 'get', re: /^\/auth\/me$/, handler: (_m, { auth, config }) => {
    if (!auth) throw fail(401, 'Não autenticado', config)
    const db = getDb()
    if (auth.tipo === 'empresa') {
      const u = db.usuarios.find(x => x.id === auth.id)
      if (!u) throw fail(401, 'Sessão inválida', config)
      return { id: u.id, nome: u.nome, email: u.email, papel: u.papel, empresaId: u.empresaId }
    }
    const m = db.motoristas.find(x => x.id === auth.id)
    if (!m) throw fail(401, 'Sessão inválida', config)
    return {
      id: m.id, nome: m.nome, telefone: m.telefone, cnh: m.cnh, scorePontualidade: m.scorePontualidade,
      veiculos: db.veiculos.filter(v => v.motoristaId === m.id).map(v => ({ id: v.id, placa: v.placa, tipo: v.tipo, capacidadeTon: v.capacidadeTon })),
    }
  } },

  // ── UNIDADES ──
  { method: 'get', re: /^\/unidades\/publicas$/, handler: () => {
    const db = getDb()
    return db.unidades.map(u => {
      const docas = db.docas.filter(d => d.unidadeId === u.id && d.ativa)
      return {
        id: u.id, nome: u.nome, cidade: u.cidade, estado: u.estado, endereco: u.endereco,
        totalDocas: docas.length,
        docas: docas.map(d => ({ id: d.id, nome: d.nome, tipoCarga: d.tipoCarga, capacidadeTonHora: d.capacidadeTonHora, ativa: d.ativa })),
      }
    })
  } },

  { method: 'get', re: /^\/unidades$/, handler: (_m, { auth, config }) => {
    const empresaId = empresaIdDe(auth, config)
    const db = getDb()
    return db.unidades.filter(u => u.empresaId === empresaId).map(u => ({
      ...u, contagemDocas: db.docas.filter(d => d.unidadeId === u.id).length,
    }))
  } },

  { method: 'post', re: /^\/unidades$/, handler: (_m, { auth, config, body }) => {
    const empresaId = empresaIdDe(auth, config)
    const db = getDb()
    const nova = { id: uid('uni'), nome: body.nome, cidade: body.cidade, estado: body.estado, endereco: body.endereco, ativa: true, empresaId }
    db.unidades.push(nova)
    saveDb(db)
    return nova
  } },

  { method: 'get', re: /^\/unidades\/([^/]+)\/docas$/, handler: (m) => {
    const db = getDb()
    return db.docas.filter(d => d.unidadeId === m[1]).map(d => ({
      ...d, horarios: db.horarios.filter(h => h.docaId === d.id),
    }))
  } },

  { method: 'post', re: /^\/unidades\/([^/]+)\/docas$/, handler: (m, { body }) => {
    const db = getDb()
    const nova = { id: uid('doc'), nome: body.nome, tipoCarga: body.tipoCarga, capacidadeTonHora: Number(body.capacidadeTonHora), ativa: true, unidadeId: m[1] }
    db.docas.push(nova)
    saveDb(db)
    return nova
  } },

  { method: 'patch', re: /^\/unidades\/([^/]+)$/, handler: (m, { body }) => {
    const db = getDb()
    const u = db.unidades.find(x => x.id === m[1])
    if (u) { Object.assign(u, body); saveDb(db) }
    return u
  } },

  { method: 'delete', re: /^\/unidades\/([^/]+)$/, handler: (m) => {
    const db = getDb()
    const docasDaUni = db.docas.filter(d => d.unidadeId === m[1]).map(d => d.id)
    db.horarios = db.horarios.filter(h => !docasDaUni.includes(h.docaId))
    db.docas = db.docas.filter(d => d.unidadeId !== m[1])
    db.unidades = db.unidades.filter(u => u.id !== m[1])
    saveDb(db)
    return { success: true }
  } },

  // ── DOCAS ──
  { method: 'patch', re: /^\/docas\/([^/]+)$/, handler: (m, { body }) => {
    const db = getDb()
    const d = db.docas.find(x => x.id === m[1])
    if (d) {
      if (body.capacidadeTonHora != null) body.capacidadeTonHora = Number(body.capacidadeTonHora)
      Object.assign(d, body); saveDb(db)
    }
    return d
  } },

  { method: 'delete', re: /^\/docas\/([^/]+)$/, handler: (m) => {
    const db = getDb()
    db.horarios = db.horarios.filter(h => h.docaId !== m[1])
    db.docas = db.docas.filter(d => d.id !== m[1])
    saveDb(db)
    return { success: true }
  } },

  { method: 'put', re: /^\/docas\/([^/]+)\/horarios$/, handler: (m, { body }) => {
    const db = getDb()
    db.horarios = db.horarios.filter(h => h.docaId !== m[1])
    for (const h of body.horarios ?? []) {
      db.horarios.push({ id: uid('hor'), diaSemana: h.diaSemana, horaInicio: h.horaInicio, horaFim: h.horaFim, docaId: m[1] })
    }
    saveDb(db)
    const doca = db.docas.find(d => d.id === m[1])
    return { ...doca, horarios: db.horarios.filter(h => h.docaId === m[1]) }
  } },

  // ── SLOTS ──
  { method: 'get', re: /^\/slots$/, handler: (_m, { query, config }) => {
    const docaId = query.get('docaId')
    const data = query.get('data')
    if (!docaId || !data) throw fail(400, 'docaId e data são obrigatórios', config)
    return calcularSlots(docaId, data)
  } },

  // ── AGENDAMENTOS ──
  { method: 'post', re: /^\/agendamentos$/, handler: (_m, { auth, config, body }) => {
    if (!auth || auth.tipo !== 'motorista') throw fail(403, 'Apenas motoristas agendam', config)
    const db = getDb()
    const doca = db.docas.find(d => d.id === body.docaId)
    if (!doca) throw fail(404, 'Doca não encontrada', config)
    const unidade = db.unidades.find(u => u.id === doca.unidadeId)
    const codigo = gerarCodigo()
    const novo: MockAgendamento = {
      id: uid('age'), codigo, empresaId: unidade?.empresaId ?? '', docaId: body.docaId,
      motoristaId: auth.id, veiculoId: body.veiculoId, dataHoraAgendada: body.dataHoraAgendada,
      volumeTon: Number(body.volumeTon), status: 'agendado',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${codigo}`,
      observacoes: body.observacoes,
    }
    db.agendamentos.push(novo)
    saveDb(db)
    return hydrateAgendamento(novo)
  } },

  { method: 'get', re: /^\/agendamentos\/me$/, handler: (_m, { auth, config }) => {
    if (!auth) throw fail(401, 'Não autenticado', config)
    const db = getDb()
    return db.agendamentos
      .filter(a => a.motoristaId === auth.id)
      .sort((a, b) => +new Date(b.dataHoraAgendada) - +new Date(a.dataHoraAgendada))
      .map(hydrateAgendamento)
  } },

  { method: 'get', re: /^\/agendamentos\/qr\/([^/]+)$/, handler: (m, { auth, config }) => {
    const empresaId = empresaIdDe(auth, config)
    const db = getDb()
    const a = db.agendamentos.find(x => x.codigo === m[1] && x.empresaId === empresaId)
    if (!a) throw fail(404, 'Agendamento não encontrado', config)
    return hydrateAgendamento(a)
  } },

  { method: 'get', re: /^\/agendamentos$/, handler: (_m, { auth, config, query }) => {
    const empresaId = empresaIdDe(auth, config)
    const db = getDb()
    let lista = db.agendamentos.filter(a => a.empresaId === empresaId)
    const status = query.get('status'); const docaId = query.get('docaId'); const data = query.get('data')
    if (status) lista = lista.filter(a => a.status === status)
    if (docaId) lista = lista.filter(a => a.docaId === docaId)
    if (data) lista = lista.filter(a => new Date(a.dataHoraAgendada).toISOString().slice(0, 10) === data)
    lista = lista.sort((a, b) => +new Date(a.dataHoraAgendada) - +new Date(b.dataHoraAgendada))
    const page = Number(query.get('page') ?? 1)
    const limit = Number(query.get('limit') ?? 20)
    const items = lista.slice((page - 1) * limit, page * limit).map(hydrateAgendamento)
    return { items, total: lista.length, page, limit }
  } },

  { method: 'patch', re: /^\/agendamentos\/([^/]+)\/(checkin|descarregando|finalizar|cancelar)$/, handler: (m, { config }) => {
    const mapa: Record<string, string> = { checkin: 'em_patio', descarregando: 'descarregando', finalizar: 'concluido', cancelar: 'cancelado' }
    const db = getDb()
    const a = db.agendamentos.find(x => x.id === m[1])
    if (!a) throw fail(404, 'Agendamento não encontrado', config)
    a.status = mapa[m[2]]
    saveDb(db)
    return hydrateAgendamento(a)
  } },

  { method: 'get', re: /^\/agendamentos\/([^/]+)$/, handler: (m, { config }) => {
    const db = getDb()
    const a = db.agendamentos.find(x => x.id === m[1])
    if (!a) throw fail(404, 'Agendamento não encontrado', config)
    return hydrateAgendamento(a)
  } },

  // ── DASHBOARD ──
  { method: 'get', re: /^\/dashboard\/hoje$/, handler: (_m, { auth, config }) => {
    const empresaId = empresaIdDe(auth, config)
    const db = getDb()
    const hoje = new Date().toISOString().slice(0, 10)
    const doDia = db.agendamentos.filter(a => a.empresaId === empresaId && new Date(a.dataHoraAgendada).toISOString().slice(0, 10) === hoje)
    const agora = Date.now()
    return {
      totalAgendados: doDia.filter(a => a.status === 'agendado').length,
      emPatio: doDia.filter(a => a.status === 'em_patio').length,
      descarregando: doDia.filter(a => a.status === 'descarregando').length,
      concluidos: doDia.filter(a => a.status === 'concluido').length,
      cancelados: doDia.filter(a => a.status === 'cancelado').length,
      proximasChegadas: doDia
        .filter(a => a.status === 'agendado' && +new Date(a.dataHoraAgendada) >= agora)
        .sort((a, b) => +new Date(a.dataHoraAgendada) - +new Date(b.dataHoraAgendada))
        .slice(0, 5)
        .map(hydrateAgendamento),
    }
  } },

  { method: 'get', re: /^\/dashboard\/fluxo-hora$/, handler: (_m, { auth, config }) => {
    const empresaId = empresaIdDe(auth, config)
    const db = getDb()
    const hoje = new Date().toISOString().slice(0, 10)
    const doDia = db.agendamentos.filter(a => a.empresaId === empresaId && new Date(a.dataHoraAgendada).toISOString().slice(0, 10) === hoje && a.status !== 'cancelado')
    const out: Array<{ hora: string; total: number; concluidos: number }> = []
    for (let h = 6; h <= 18; h++) {
      const naHora = doDia.filter(a => new Date(a.dataHoraAgendada).getHours() === h)
      out.push({ hora: `${String(h).padStart(2, '0')}h`, total: naHora.length, concluidos: naHora.filter(a => a.status === 'concluido').length })
    }
    return out
  } },
]

function empresaIdDe(auth: { tipo: string; id: string } | null, config: InternalAxiosRequestConfig): string {
  if (!auth || auth.tipo !== 'empresa') throw fail(403, 'Acesso restrito à empresa', config)
  const db = getDb()
  const u = db.usuarios.find(x => x.id === auth.id)
  if (!u) throw fail(401, 'Sessão inválida', config)
  return u.empresaId
}

// ─── adapter ─────────────────────────────────────────────────────────────────
export const mockAdapter: AxiosAdapter = (config) => {
  const method = (config.method ?? 'get').toLowerCase()
  const full = config.url ?? ''
  const [rawPath, qs] = full.split('?')
  const path = rawPath.replace(/^.*\/api/, '').replace(/\/$/, '') || '/'

  const query = new URLSearchParams(qs ?? '')
  if (config.params) for (const [k, v] of Object.entries(config.params)) query.set(k, String(v))

  let body: any = config.data
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { /* ignore */ } }

  const auth = currentAuth(config)
  const ctx: Ctx = { config, body: body ?? {}, query, auth }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rota = rotas.find(r => r.method === method && r.re.test(path))
      if (!rota) { fail(404, `Rota mock não encontrada: ${method.toUpperCase()} ${path}`, config).catch(reject); return }
      try {
        const data = rota.handler(path.match(rota.re)!, ctx)
        if (data && typeof (data as any).then === 'function') { (data as Promise<any>).then(reject, reject); return }
        resolve(ok(data, config))
      } catch (e) {
        if (e && typeof (e as any).then === 'function') { (e as Promise<any>).catch(reject); return }
        reject(e)
      }
    }, LATENCIA_MS)
  })
}
