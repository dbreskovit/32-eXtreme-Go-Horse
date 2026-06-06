import { useState } from 'react'
import { motion } from 'motion/react'
import { AGENDAMENTOS } from '../../mocks/data'
import { StatusBadge } from '../../components/StatusBadge'
import { format } from 'date-fns'
import type { Agendamento, StatusAgendamento } from '../../types'

const PROX: Partial<Record<StatusAgendamento, string>> = {
  agendado: 'Check-in', em_patio: 'Descarregar', descarregando: 'Finalizar',
}

const STATUS_OPTS = [
  { value: '', label: 'Todos' },
  { value: 'agendado', label: 'Agendado' },
  { value: 'em_patio', label: 'Em Pátio' },
  { value: 'descarregando', label: 'Descarregando' },
  { value: 'concluido', label: 'Concluído' },
  { value: 'cancelado', label: 'Cancelado' },
]

const CHIP_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  '':            { bg: '#1e293b',    color: '#fff',     border: '#1e293b' },
  agendado:      { bg: '#eff6ff',    color: '#1d4ed8',  border: '#bfdbfe' },
  em_patio:      { bg: '#fffbeb',    color: '#92400e',  border: '#fde68a' },
  descarregando: { bg: '#fff7ed',    color: '#c2410c',  border: '#fed7aa' },
  concluido:     { bg: '#f0fdf4',    color: '#15803d',  border: '#bbf7d0' },
  cancelado:     { bg: '#f8fafc',    color: '#475569',  border: '#e2e8f0' },
}

export function AgendamentosPage() {
  const [filtro, setFiltro] = useState('')
  const [agendamentos, setAgendamentos] = useState(AGENDAMENTOS)

  const lista = filtro ? agendamentos.filter(a => a.status === filtro) : agendamentos

  function avancar(ag: Agendamento) {
    const m: Partial<Record<StatusAgendamento, StatusAgendamento>> = {
      agendado: 'em_patio', em_patio: 'descarregando', descarregando: 'concluido',
    }
    const s = m[ag.status]
    if (s) setAgendamentos(prev => prev.map(a => a.id === ag.id ? { ...a, status: s } : a))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                  className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', color: 'var(--slate-900)', letterSpacing: '-0.025em' }}>
            Agendamentos
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--slate-500)' }}>{lista.length} registros encontrados</p>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTS.map(o => {
            const active = filtro === o.value
            const c = CHIP_COLORS[o.value]
            return (
              <button key={o.value} onClick={() => setFiltro(o.value)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                      style={{
                        background: active ? c.bg : 'var(--cream)',
                        color: active ? c.color : 'var(--slate-500)',
                        border: active ? `1px solid ${c.border}` : '1px solid var(--slate-200)',
                        boxShadow: active ? 'var(--shadow-xs)' : 'none',
                      }}>
                {o.label}
              </button>
            )
          })}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: '#fff', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--slate-100)' }}>
              {['Código', 'Motorista', 'Placa', 'Doca', 'Horário', 'Volume', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--slate-400)', background: 'var(--slate-50)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lista.map((ag, i) => (
              <motion.tr key={ag.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                         style={{ borderBottom: '1px solid var(--slate-50)' }}
                         onMouseEnter={e => (e.currentTarget.style.background = 'var(--slate-50)')}
                         onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td className="px-4 py-3"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.8rem', color: 'var(--slate-700)' }}>
                  {ag.codigo}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                         style={{ background: 'linear-gradient(135deg, #22c55e, #15803d)', color: '#fff' }}>
                      {ag.motorista.nome.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-xs" style={{ color: 'var(--slate-800)' }}>{ag.motorista.nome}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--slate-400)' }}>Score {ag.motorista.scorePontualidade}%</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-mono font-semibold" style={{ color: 'var(--slate-600)' }}>{ag.veiculo.placa}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--slate-500)' }}>{ag.doca.nome}</td>
                <td className="px-4 py-3 text-xs font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--slate-700)' }}>
                  {format(new Date(ag.dataHoraAgendada), 'HH:mm')}
                </td>
                <td className="px-4 py-3 text-xs font-bold" style={{ color: 'var(--slate-800)' }}>{ag.volumeTon}t</td>
                <td className="px-4 py-3"><StatusBadge status={ag.status} /></td>
                <td className="px-4 py-3">
                  {PROX[ag.status] && (
                    <button onClick={() => avancar(ag)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            style={{ background: 'var(--green-50)', color: 'var(--green-700)', border: '1px solid var(--green-100)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--green-600)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--green-600)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'var(--green-50)'; e.currentTarget.style.color = 'var(--green-700)'; e.currentTarget.style.borderColor = 'var(--green-100)' }}>
                      {PROX[ag.status]}
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {lista.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3 opacity-20">≡</div>
            <p className="text-sm font-medium" style={{ color: 'var(--slate-400)' }}>Nenhum agendamento encontrado</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
