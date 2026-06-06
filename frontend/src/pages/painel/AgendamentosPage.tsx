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
          <h1 className="font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--earth)', letterSpacing: '-0.02em' }}>
            Agendamentos
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--bark)' }}>{lista.length} registros</p>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTS.map(o => (
            <button key={o.value} onClick={() => setFiltro(o.value)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={{
                      background: filtro === o.value ? 'var(--earth)' : 'var(--parchment)',
                      color: filtro === o.value ? 'var(--cream)' : 'var(--bark)',
                    }}>
              {o.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              {['Código', 'Motorista', 'Placa', 'Doca', 'Horário', 'Volume', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--bark)', background: 'var(--parchment)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lista.map((ag, i) => (
              <motion.tr key={ag.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                         style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}
                         onMouseEnter={e => (e.currentTarget.style.background = 'var(--parchment)')}
                         onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td className="px-4 py-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.8rem', color: 'var(--earth)' }}>
                  {ag.codigo}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-xs" style={{ color: 'var(--earth)' }}>{ag.motorista.nome}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--bark)' }}>Score {ag.motorista.scorePontualidade}%</div>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--bark)' }}>{ag.veiculo.placa}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--bark)' }}>{ag.doca.nome}</td>
                <td className="px-4 py-3 text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--bark)' }}>
                  {format(new Date(ag.dataHoraAgendada), 'HH:mm')}
                </td>
                <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--earth)' }}>{ag.volumeTon}t</td>
                <td className="px-4 py-3"><StatusBadge status={ag.status} /></td>
                <td className="px-4 py-3">
                  {PROX[ag.status] && (
                    <button onClick={() => avancar(ag)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            style={{ background: 'var(--parchment)', color: 'var(--earth)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--mist)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'var(--parchment)')}>
                      {PROX[ag.status]}
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {lista.length === 0 && (
          <div className="text-center py-16" style={{ color: 'var(--mist)' }}>
            <div className="text-5xl mb-3 opacity-40">≡</div>
            <p className="text-sm font-medium">Nenhum agendamento encontrado</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
