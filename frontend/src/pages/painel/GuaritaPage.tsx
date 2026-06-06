import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { AGENDAMENTOS } from '../../mocks/data'
import { StatusBadge } from '../../components/StatusBadge'
import { format } from 'date-fns'
import type { Agendamento, StatusAgendamento } from '../../types'

const ACAO: Partial<Record<StatusAgendamento, { label: string; color: string }>> = {
  agendado:      { label: 'Fazer Check-in',    color: '#22c55e' },
  em_patio:      { label: 'Iniciar Descarga',  color: '#f59e0b' },
  descarregando: { label: 'Finalizar Descarga', color: '#3b82f6' },
}

export function GuaritaPage() {
  const [busca, setBusca] = useState('')
  const [encontrado, setEncontrado] = useState<Agendamento | null>(null)
  const [erro, setErro] = useState('')
  const [agendamentos, setAgendamentos] = useState(AGENDAMENTOS)

  function buscar(e: React.FormEvent) {
    e.preventDefault()
    const t = busca.trim().toUpperCase()
    const ag = agendamentos.find(
      a => a.codigo.toUpperCase() === t ||
           a.veiculo.placa.toUpperCase().replace('-','') === t.replace('-','')
    )
    ag ? (setEncontrado(ag), setErro('')) : (setEncontrado(null), setErro('Não encontrado.'))
  }

  function avancar() {
    if (!encontrado) return
    const prox: Partial<Record<StatusAgendamento, StatusAgendamento>> = {
      agendado: 'em_patio', em_patio: 'descarregando', descarregando: 'concluido',
    }
    const novo = prox[encontrado.status]
    if (!novo) return
    const upd = { ...encontrado, status: novo }
    setEncontrado(upd)
    setAgendamentos(prev => prev.map(a => a.id === encontrado.id ? upd : a))
  }

  const emPatio = agendamentos.filter(a => ['em_patio', 'descarregando'].includes(a.status))

  return (
    <div className="p-6 max-w-5xl mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-bold mb-1" style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--earth)', letterSpacing: '-0.02em' }}>
          Guarita
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--bark)' }}>Busque por código QR ou placa do veículo</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Busca */}
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <form onSubmit={buscar} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--bark)' }}>
                Código QR ou Placa
              </label>
              <input value={busca} onChange={e => setBusca(e.target.value)}
                     placeholder="FG-2847 ou ABC-1D23" autoFocus
                     className="w-full text-center tracking-widest uppercase outline-none rounded-xl px-5 py-4 transition-all"
                     style={{ fontSize: '1.5rem', fontFamily: 'var(--font-mono)', fontWeight: 600,
                              background: 'var(--parchment)', border: '2px solid transparent', color: 'var(--earth)' }}
                     onFocus={e => (e.currentTarget.style.borderColor = 'var(--grain)')}
                     onBlur={e => (e.currentTarget.style.borderColor = 'transparent')} />
            </div>
            <button type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-sm transition-all"
                    style={{ background: 'var(--earth)', color: 'var(--cream)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--canopy)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--earth)')}>
              Buscar
            </button>
          </form>

          {erro && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="mt-4 text-sm text-center py-3 rounded-xl"
                      style={{ background: 'rgba(239,68,68,0.08)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.15)' }}>
              {erro}
            </motion.p>
          )}

          <AnimatePresence>
            {encontrado && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                          className="mt-5 space-y-4">
                <div className="p-4 rounded-xl" style={{ background: 'var(--parchment)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--earth)' }}>
                      {encontrado.codigo}
                    </span>
                    <StatusBadge status={encontrado.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[
                      ['Motorista', encontrado.motorista.nome],
                      ['Score', `${encontrado.motorista.scorePontualidade}% ⭐`],
                      ['Placa', encontrado.veiculo.placa],
                      ['Tipo', encontrado.veiculo.tipo],
                      ['Doca', encontrado.doca.nome],
                      ['Volume', `${encontrado.volumeTon}t`],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ color: 'var(--bark)' }}>{k}</div>
                        <div className="font-semibold mt-0.5" style={{ color: 'var(--earth)' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {ACAO[encontrado.status] && (
                  <button onClick={avancar}
                          className="w-full py-4 rounded-xl font-bold text-sm transition-all"
                          style={{ background: ACAO[encontrado.status]!.color, color: '#fff' }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                    {ACAO[encontrado.status]!.label}
                  </button>
                )}

                {encontrado.status === 'concluido' && (
                  <div className="text-center py-4 rounded-xl font-semibold text-sm"
                       style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
                    ✓ Descarga concluída com sucesso!
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Em pátio */}
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--earth)' }}>Em pátio agora</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
              {emPatio.length}
            </span>
          </div>
          {emPatio.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16" style={{ color: 'var(--mist)' }}>
              <div className="text-5xl mb-3 opacity-40">⬡</div>
              <p className="text-sm">Pátio vazio no momento</p>
            </div>
          ) : (
            <div className="space-y-2">
              {emPatio.map(ag => (
                <button key={ag.id} onClick={() => { setEncontrado(ag); setBusca(ag.codigo); setErro('') }}
                        className="w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all"
                        style={{ border: '1px solid transparent' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--parchment)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0"
                       style={{ background: 'var(--earth)', color: 'var(--harvest)' }}>
                    {ag.motorista.nome.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--earth)' }}>{ag.codigo}</span>
                      <StatusBadge status={ag.status} />
                    </div>
                    <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--bark)' }}>
                      {ag.motorista.nome} · {ag.veiculo.placa} · {format(new Date(ag.dataHoraAgendada), 'HH:mm')}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
