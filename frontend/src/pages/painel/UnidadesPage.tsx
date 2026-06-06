import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  useUnidades, useDocas, useUnidadesMutations, useDocasMutations,
  type UnidadeApi, type DocaApi, type HorarioApi,
} from '../../hooks/useUnidades'

// ─── Types ───────────────────────────────────────────────────────────────────
type FaixaHorario = { inicio: string; fim: string }
type ConfigDia = { ativo: boolean; faixas: FaixaHorario[] }
type ConfigHorarios = Record<number, ConfigDia>

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const FAIXA_PADRAO: FaixaHorario = { inicio: '08:00', fim: '18:00' }

// ─── Page ─────────────────────────────────────────────────────────────────────
export function UnidadesPage() {
  const { unidades, loading, erro, recarregar } = useUnidades()
  const { criarUnidade, editarUnidade, removerUnidade, salvando } = useUnidadesMutations(recarregar)

  const [modalUnidade, setModalUnidade] = useState<null | Partial<UnidadeApi>>(null)
  const [confirmDelete, setConfirmDelete] = useState<null | UnidadeApi>(null)

  async function handleSalvarUnidade(dto: { nome: string; cidade: string; estado: string; endereco: string }) {
    if (modalUnidade?.id) await editarUnidade(modalUnidade.id, dto)
    else await criarUnidade(dto)
    setModalUnidade(null)
  }

  async function handleDeletarUnidade() {
    if (!confirmDelete) return
    await removerUnidade(confirmDelete.id)
    setConfirmDelete(null)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                  className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', color: 'var(--slate-900)', letterSpacing: '-0.025em' }}>
            Unidades e Docas
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--slate-500)' }}>
            {unidades.length} unidade{unidades.length !== 1 ? 's' : ''} cadastrada{unidades.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'var(--green-600)', color: '#fff', boxShadow: '0 2px 8px rgba(22,163,74,0.3)' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#15803d')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--green-600)')}
                onClick={() => setModalUnidade({})}>
          <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span> Nova unidade
        </button>
      </motion.div>

      {erro && <p className="text-xs mb-4 text-center" style={{ color: '#dc2626' }}>{erro}</p>}

      <div className="space-y-3">
        {loading && <p className="text-sm text-center animate-pulse" style={{ color: 'var(--slate-400)' }}>Carregando unidades...</p>}
        {!loading && unidades.length === 0 && (
          <div className="text-center py-12 rounded-2xl" style={{ border: '2px dashed var(--slate-200)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--slate-400)' }}>Nenhuma unidade cadastrada</p>
            <p className="text-xs mt-1" style={{ color: 'var(--slate-300)' }}>Clique em "Nova unidade" para começar</p>
          </div>
        )}
        {unidades.map((u, i) => (
          <UnidadeItem key={u.id} u={u} i={i}
            onEdit={() => setModalUnidade(u)}
            onDelete={() => setConfirmDelete(u)} />
        ))}
      </div>

      <AnimatePresence>
        {modalUnidade !== null && (
          <UnidadeModal dados={modalUnidade} salvando={salvando}
            onClose={() => setModalUnidade(null)} onSalvar={handleSalvarUnidade} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <ConfirmModal
            titulo="Remover unidade"
            mensagem={`Tem certeza que deseja remover "${confirmDelete.nome}"? Todas as docas associadas serão removidas.`}
            salvando={salvando} onConfirm={handleDeletarUnidade} onCancel={() => setConfirmDelete(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── UnidadeItem ──────────────────────────────────────────────────────────────
function UnidadeItem({ u, i, onEdit, onDelete }: {
  u: UnidadeApi; i: number; onEdit: () => void; onDelete: () => void
}) {
  const [aberta, setAberta] = useState(false)
  const { docas, loading, recarregar } = useDocas(aberta ? u.id : null)
  const { criarDoca, editarDoca, removerDoca, salvarHorarios, salvando } = useDocasMutations(recarregar)

  const [modalDoca, setModalDoca] = useState<null | Partial<DocaApi>>(null)
  const [modalHorarios, setModalHorarios] = useState<null | DocaApi>(null)
  const [confirmDeleteDoca, setConfirmDeleteDoca] = useState<null | DocaApi>(null)

  async function handleSalvarDoca(dto: { nome: string; tipoCarga: string; capacidadeTonHora: number; ativa?: boolean }) {
    if (modalDoca?.id) await editarDoca(modalDoca.id, dto)
    else await criarDoca(u.id, dto)
    setModalDoca(null)
  }

  async function handleSalvarHorarios(horarios: Array<{ diaSemana: number; horaInicio: string; horaFim: string }>) {
    if (!modalHorarios) return
    await salvarHorarios(modalHorarios.id, horarios)
    setModalHorarios(null)
  }

  async function handleDeletarDoca() {
    if (!confirmDeleteDoca) return
    await removerDoca(confirmDeleteDoca.id)
    setConfirmDeleteDoca(null)
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: '#fff',
                    border: aberta ? '1px solid var(--green-200)' : '1px solid var(--slate-200)',
                    boxShadow: aberta ? '0 4px 16px rgba(22,163,74,0.1)' : 'var(--shadow-sm)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}>
        {/* Header */}
        <div className="p-5 flex items-center justify-between"
             style={{ background: aberta ? 'var(--green-50)' : '#fff' }}>
          <button className="flex items-center gap-4 flex-1 text-left" onClick={() => setAberta(!aberta)}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                 style={{ background: aberta ? 'linear-gradient(135deg, var(--green-500), var(--green-700))' : 'var(--slate-100)' }}>
              🏢
            </div>
            <div>
              <div className="font-semibold text-sm" style={{ color: 'var(--slate-900)' }}>{u.nome}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--slate-400)' }}>
                {u.cidade}, {u.estado} · {u.endereco}
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
              {u.totalDocas} {u.totalDocas === 1 ? 'doca' : 'docas'}
            </span>
            <IconBtn title="Editar unidade" emoji="✏️"
              hoverBg="#eff6ff" hoverColor="#2563eb"
              onClick={e => { e.stopPropagation(); onEdit() }} />
            <IconBtn title="Remover unidade" emoji="🗑️"
              hoverBg="#fef2f2" hoverColor="#dc2626"
              onClick={e => { e.stopPropagation(); onDelete() }} />
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs cursor-pointer"
                  style={{
                    background: aberta ? 'var(--green-100)' : 'var(--slate-100)',
                    color: aberta ? 'var(--green-700)' : 'var(--slate-400)',
                    transform: aberta ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => setAberta(!aberta)}>▾</span>
          </div>
        </div>

        {/* Docas expandidas */}
        <AnimatePresence>
          {aberta && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}>
              <div className="px-5 pb-5 pt-2" style={{ borderTop: '1px solid var(--green-100)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--slate-400)' }}>Docas</span>
                  <button className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
                          style={{ color: 'var(--green-600)', background: 'var(--green-50)', border: '1px solid var(--green-100)' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--green-100)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'var(--green-50)')}
                          onClick={() => setModalDoca({})}>
                    + Adicionar doca
                  </button>
                </div>

                {loading && <p className="text-xs text-center animate-pulse" style={{ color: 'var(--slate-400)' }}>Carregando docas...</p>}
                {!loading && docas.length === 0 && (
                  <div className="text-center py-6 rounded-xl" style={{ border: '2px dashed var(--slate-100)' }}>
                    <p className="text-xs" style={{ color: 'var(--slate-400)' }}>Nenhuma doca cadastrada</p>
                  </div>
                )}
                {!loading && docas.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {docas.map(d => (
                      <DocaCard key={d.id} d={d}
                        onEdit={() => setModalDoca(d)}
                        onDelete={() => setConfirmDeleteDoca(d)}
                        onHorarios={() => setModalHorarios(d)} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {modalDoca !== null && (
          <DocaModal dados={modalDoca} salvando={salvando}
            onClose={() => setModalDoca(null)} onSalvar={handleSalvarDoca} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalHorarios && (
          <HorariosModal doca={modalHorarios} salvando={salvando}
            onClose={() => setModalHorarios(null)} onSalvar={handleSalvarHorarios} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDeleteDoca && (
          <ConfirmModal titulo="Remover doca"
            mensagem={`Tem certeza que deseja remover a doca "${confirmDeleteDoca.nome}"?`}
            salvando={salvando} onConfirm={handleDeletarDoca} onCancel={() => setConfirmDeleteDoca(null)} />
        )}
      </AnimatePresence>
    </>
  )
}

// ─── DocaCard ─────────────────────────────────────────────────────────────────
function DocaCard({ d, onEdit, onDelete, onHorarios }: {
  d: DocaApi; onEdit: () => void; onDelete: () => void; onHorarios: () => void
}) {
  const qtdJanelas = d.horarios?.length ?? 0
  return (
    <div className="p-3.5 rounded-xl" style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-100)' }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold truncate" style={{ color: 'var(--slate-800)' }}>{d.nome}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--slate-400)' }}>{d.capacidadeTonHora}t/h · {d.tipoCarga}</div>
          <div className="text-xs mt-0.5" style={{ color: qtdJanelas > 0 ? 'var(--green-600)' : 'var(--slate-400)' }}>
            {qtdJanelas > 0
              ? `${qtdJanelas} janela${qtdJanelas > 1 ? 's' : ''} de horário`
              : 'Sem horários definidos'}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: d.ativa ? '#f0fdf4' : '#f8fafc',
                  color: d.ativa ? '#15803d' : '#94a3b8',
                  border: `1px solid ${d.ativa ? '#bbf7d0' : '#e2e8f0'}`,
                }}>
            {d.ativa ? 'Ativa' : 'Inativa'}
          </span>
          <div className="flex items-center gap-1">
            <IconBtn title="Configurar horários" emoji="🕐" size="sm"
              hoverBg="#f0fdf4" hoverColor="#16a34a" onClick={onHorarios} />
            <IconBtn title="Editar doca" emoji="✏️" size="sm"
              hoverBg="#eff6ff" hoverColor="#2563eb" onClick={onEdit} />
            <IconBtn title="Remover doca" emoji="🗑️" size="sm"
              hoverBg="#fef2f2" hoverColor="#dc2626" onClick={onDelete} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── UnidadeModal ─────────────────────────────────────────────────────────────
function UnidadeModal({ dados, salvando, onClose, onSalvar }: {
  dados: Partial<UnidadeApi>; salvando: boolean
  onClose: () => void
  onSalvar: (dto: { nome: string; cidade: string; estado: string; endereco: string }) => Promise<void>
}) {
  const [form, setForm] = useState({ nome: dados.nome ?? '', cidade: dados.cidade ?? '', estado: dados.estado ?? '', endereco: dados.endereco ?? '' })
  const [erro, setErro] = useState('')
  const isEdicao = !!dados.id

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome || !form.cidade || !form.estado || !form.endereco) { setErro('Preencha todos os campos.'); return }
    try { await onSalvar(form) } catch { setErro('Erro ao salvar unidade.') }
  }

  return (
    <Modal titulo={isEdicao ? 'Editar unidade' : 'Nova unidade'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Campo label="Nome" value={form.nome} onChange={v => setForm(f => ({ ...f, nome: v }))} placeholder="Ex: Filial Porto Alegre" />
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Cidade" value={form.cidade} onChange={v => setForm(f => ({ ...f, cidade: v }))} placeholder="Ex: Porto Alegre" />
          <Campo label="Estado (UF)" value={form.estado} onChange={v => setForm(f => ({ ...f, estado: v.toUpperCase().slice(0, 2) }))} placeholder="RS" maxLength={2} />
        </div>
        <Campo label="Endereço" value={form.endereco} onChange={v => setForm(f => ({ ...f, endereco: v }))} placeholder="Ex: Av. Principal, 1234" />
        {erro && <p className="text-xs" style={{ color: '#dc2626' }}>{erro}</p>}
        <BotoesModal salvando={salvando} isEdicao={isEdicao} onClose={onClose} labelCriar="Criar unidade" labelEditar="Salvar alterações" />
      </form>
    </Modal>
  )
}

// ─── DocaModal ────────────────────────────────────────────────────────────────
function DocaModal({ dados, salvando, onClose, onSalvar }: {
  dados: Partial<DocaApi>; salvando: boolean
  onClose: () => void
  onSalvar: (dto: { nome: string; tipoCarga: string; capacidadeTonHora: number; ativa?: boolean }) => Promise<void>
}) {
  const [form, setForm] = useState({
    nome: dados.nome ?? '',
    tipoCarga: dados.tipoCarga ?? '',
    capacidadeTonHora: dados.capacidadeTonHora?.toString() ?? '',
    ativa: dados.ativa ?? true,
  })
  const [erro, setErro] = useState('')
  const isEdicao = !!dados.id

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome || !form.tipoCarga || !form.capacidadeTonHora) { setErro('Preencha todos os campos.'); return }
    const capacidade = parseFloat(form.capacidadeTonHora)
    if (isNaN(capacidade) || capacidade < 0.1) { setErro('Capacidade deve ser maior que 0.'); return }
    try {
      await onSalvar({ nome: form.nome, tipoCarga: form.tipoCarga, capacidadeTonHora: capacidade, ...(isEdicao && { ativa: form.ativa }) })
    } catch { setErro('Erro ao salvar doca.') }
  }

  return (
    <Modal titulo={isEdicao ? 'Editar doca' : 'Nova doca'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Campo label="Nome" value={form.nome} onChange={v => setForm(f => ({ ...f, nome: v }))} placeholder="Ex: Doca A1" />
        <Campo label="Tipo de carga" value={form.tipoCarga} onChange={v => setForm(f => ({ ...f, tipoCarga: v }))} placeholder="Ex: Soja, Milho, Trigo" />
        <CampoNumero label="Capacidade (ton/hora)" value={form.capacidadeTonHora}
          onChange={v => setForm(f => ({ ...f, capacidadeTonHora: v }))} placeholder="Ex: 50" min="0.1" step="0.1" />
        {isEdicao && (
          <div className="flex items-center gap-3">
            <Toggle ativo={form.ativa} onChange={v => setForm(f => ({ ...f, ativa: v }))} />
            <span className="text-sm" style={{ color: 'var(--slate-600)' }}>{form.ativa ? 'Doca ativa' : 'Doca inativa'}</span>
          </div>
        )}
        {erro && <p className="text-xs" style={{ color: '#dc2626' }}>{erro}</p>}
        <BotoesModal salvando={salvando} isEdicao={isEdicao} onClose={onClose} labelCriar="Criar doca" labelEditar="Salvar alterações" />
      </form>
    </Modal>
  )
}

// ─── HorariosModal ────────────────────────────────────────────────────────────
function HorariosModal({ doca, salvando, onClose, onSalvar }: {
  doca: DocaApi; salvando: boolean
  onClose: () => void
  onSalvar: (horarios: Array<{ diaSemana: number; horaInicio: string; horaFim: string }>) => Promise<void>
}) {
  const [config, setConfig] = useState<ConfigHorarios>(() => inicializarConfig(doca.horarios ?? []))
  const [erro, setErro] = useState('')

  function toggleDia(dia: number) {
    setConfig(c => ({ ...c, [dia]: { ...c[dia], ativo: !c[dia].ativo } }))
  }

  function addFaixa(dia: number) {
    setConfig(c => ({ ...c, [dia]: { ...c[dia], faixas: [...c[dia].faixas, { ...FAIXA_PADRAO }] } }))
  }

  function removeFaixa(dia: number, idx: number) {
    setConfig(c => ({ ...c, [dia]: { ...c[dia], faixas: c[dia].faixas.filter((_, i) => i !== idx) } }))
  }

  function updateFaixa(dia: number, idx: number, campo: 'inicio' | 'fim', valor: string) {
    setConfig(c => ({
      ...c,
      [dia]: { ...c[dia], faixas: c[dia].faixas.map((f, i) => i === idx ? { ...f, [campo]: valor } : f) }
    }))
  }

  async function handleSalvar() {
    const horarios: Array<{ diaSemana: number; horaInicio: string; horaFim: string }> = []
    for (let d = 0; d <= 6; d++) {
      if (!config[d].ativo) continue
      for (const f of config[d].faixas) {
        if (!f.inicio || !f.fim) { setErro('Preencha todos os horários dos dias selecionados.'); return }
        if (f.inicio >= f.fim) { setErro(`${DIAS[d]}: horário de início deve ser antes do fim.`); return }
        horarios.push({ diaSemana: d, horaInicio: f.inicio + ':00', horaFim: f.fim + ':00' })
      }
    }
    setErro('')
    try { await onSalvar(horarios) } catch { setErro('Erro ao salvar horários.') }
  }

  return (
    <Modal titulo={`Horários — ${doca.nome}`} onClose={onClose} largo>
      <div className="space-y-2">
        {DIAS.map((nomeDia, dia) => (
          <div key={dia} className="rounded-xl p-3 transition-all"
               style={{
                 background: config[dia].ativo ? 'var(--green-50)' : 'var(--slate-50)',
                 border: `1px solid ${config[dia].ativo ? 'var(--green-100)' : 'var(--slate-100)'}`,
               }}>
            <div className="flex items-center gap-3">
              <Toggle ativo={config[dia].ativo} onChange={() => toggleDia(dia)} />
              <span className="text-sm font-semibold" style={{ color: config[dia].ativo ? 'var(--slate-800)' : 'var(--slate-400)', minWidth: '4.5rem' }}>
                {nomeDia}
              </span>
              {config[dia].ativo && (
                <button onClick={() => addFaixa(dia)}
                        className="ml-auto text-xs px-2 py-0.5 rounded-lg"
                        style={{ color: 'var(--green-600)', background: 'var(--green-100)', border: '1px solid var(--green-200)' }}>
                  + Faixa
                </button>
              )}
            </div>

            {config[dia].ativo && (
              <div className="mt-2 space-y-1.5 pl-12">
                {config[dia].faixas.map((faixa, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input type="time" value={faixa.inicio} onChange={e => updateFaixa(dia, idx, 'inicio', e.target.value)}
                           className="px-2 py-1 rounded-lg text-xs border"
                           style={{ borderColor: 'var(--slate-200)', background: '#fff', color: 'var(--slate-700)' }} />
                    <span className="text-xs" style={{ color: 'var(--slate-400)' }}>até</span>
                    <input type="time" value={faixa.fim} onChange={e => updateFaixa(dia, idx, 'fim', e.target.value)}
                           className="px-2 py-1 rounded-lg text-xs border"
                           style={{ borderColor: 'var(--slate-200)', background: '#fff', color: 'var(--slate-700)' }} />
                    {config[dia].faixas.length > 1 && (
                      <button onClick={() => removeFaixa(dia, idx)}
                              className="w-5 h-5 rounded flex items-center justify-center text-xs"
                              style={{ color: '#dc2626', background: '#fef2f2' }}>✕</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {erro && <p className="text-xs pt-1" style={{ color: '#dc2626' }}>{erro}</p>}

        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--slate-100)', color: 'var(--slate-600)' }}>Cancelar</button>
          <button onClick={handleSalvar} disabled={salvando} className="flex-1 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: salvando ? 'var(--slate-300)' : 'var(--green-600)', color: '#fff' }}>
            {salvando ? 'Salvando...' : 'Salvar horários'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ─── ConfirmModal ─────────────────────────────────────────────────────────────
function ConfirmModal({ titulo, mensagem, salvando, onConfirm, onCancel }: {
  titulo: string; mensagem: string; salvando: boolean
  onConfirm: () => Promise<void>; onCancel: () => void
}) {
  return (
    <Modal titulo={titulo} onClose={onCancel}>
      <p className="text-sm mb-5" style={{ color: 'var(--slate-600)' }}>{mensagem}</p>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-2 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--slate-100)', color: 'var(--slate-600)' }}>Cancelar</button>
        <button onClick={onConfirm} disabled={salvando} className="flex-1 py-2 rounded-xl text-sm font-semibold"
                style={{ background: salvando ? 'var(--slate-300)' : '#dc2626', color: '#fff' }}>
          {salvando ? 'Removendo...' : 'Confirmar remoção'}
        </button>
      </div>
    </Modal>
  )
}

// ─── Shared UI Primitives ─────────────────────────────────────────────────────
function Modal({ titulo, onClose, largo, children }: {
  titulo: string; onClose: () => void; largo?: boolean; children: React.ReactNode
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
                style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
                onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.18 }}
                  className="w-full rounded-2xl overflow-hidden"
                  style={{ maxWidth: largo ? '36rem' : '24rem', background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--slate-100)' }}>
          <h2 className="font-semibold text-sm" style={{ color: 'var(--slate-900)' }}>{titulo}</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                  style={{ background: 'var(--slate-100)', color: 'var(--slate-500)' }}>✕</button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </motion.div>
  )
}

function Campo({ label, value, onChange, placeholder, maxLength }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--slate-600)' }}>{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
             placeholder={placeholder} maxLength={maxLength}
             className="w-full px-3 py-2 rounded-xl text-sm border"
             style={{ borderColor: 'var(--slate-200)', background: '#fff', color: 'var(--slate-800)', outline: 'none' }}
             onFocus={e => (e.currentTarget.style.borderColor = 'var(--green-400)')}
             onBlur={e => (e.currentTarget.style.borderColor = 'var(--slate-200)')} />
    </div>
  )
}

function CampoNumero({ label, value, onChange, placeholder, min, step }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; min?: string; step?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--slate-600)' }}>{label}</label>
      <input type="number" value={value} onChange={e => onChange(e.target.value)}
             placeholder={placeholder} min={min} step={step}
             className="w-full px-3 py-2 rounded-xl text-sm border"
             style={{ borderColor: 'var(--slate-200)', background: '#fff', color: 'var(--slate-800)', outline: 'none' }}
             onFocus={e => (e.currentTarget.style.borderColor = 'var(--green-400)')}
             onBlur={e => (e.currentTarget.style.borderColor = 'var(--slate-200)')} />
    </div>
  )
}

function Toggle({ ativo, onChange }: { ativo: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!ativo)}
            className="w-9 h-5 rounded-full relative transition-all shrink-0"
            style={{ background: ativo ? 'var(--green-500)' : 'var(--slate-300)' }}>
      <span className="absolute w-3.5 h-3.5 bg-white rounded-full"
            style={{ top: '3px', left: ativo ? '18px' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
    </button>
  )
}

function IconBtn({ emoji, title, onClick, size = 'md', hoverBg, hoverColor }: {
  emoji: string; title: string; onClick: (e: React.MouseEvent) => void
  size?: 'sm' | 'md'; hoverBg: string; hoverColor: string
}) {
  const dim = size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'
  return (
    <button title={title} onClick={onClick}
            className={`${dim} rounded-lg flex items-center justify-center text-xs transition-all`}
            style={{ background: 'var(--slate-100)', color: 'var(--slate-400)', border: '1px solid transparent' }}
            onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = hoverColor }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--slate-100)'; e.currentTarget.style.color = 'var(--slate-400)' }}>
      {emoji}
    </button>
  )
}

function BotoesModal({ salvando, isEdicao, onClose, labelCriar, labelEditar }: {
  salvando: boolean; isEdicao: boolean; onClose: () => void; labelCriar: string; labelEditar: string
}) {
  return (
    <div className="flex gap-2 pt-1">
      <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--slate-100)', color: 'var(--slate-600)' }}>Cancelar</button>
      <button type="submit" disabled={salvando} className="flex-1 py-2 rounded-xl text-sm font-semibold"
              style={{ background: salvando ? 'var(--slate-300)' : 'var(--green-600)', color: '#fff' }}>
        {salvando ? 'Salvando...' : isEdicao ? labelEditar : labelCriar}
      </button>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function inicializarConfig(horarios: HorarioApi[]): ConfigHorarios {
  const cfg: ConfigHorarios = {}
  for (let d = 0; d <= 6; d++) {
    const faixasDia = horarios.filter(h => h.diaSemana === d)
    cfg[d] = faixasDia.length > 0
      ? { ativo: true, faixas: faixasDia.map(h => ({ inicio: h.horaInicio.slice(0, 5), fim: h.horaFim.slice(0, 5) })) }
      : { ativo: false, faixas: [{ ...FAIXA_PADRAO }] }
  }
  return cfg
}
