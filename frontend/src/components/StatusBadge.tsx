import type { StatusAgendamento } from '../types'

const CONFIG: Record<StatusAgendamento, { label: string; bg: string; color: string; dot: string }> = {
  agendado:      { label: 'Agendado',      bg: 'rgba(59,130,246,0.1)',  color: '#93c5fd', dot: '#3b82f6' },
  em_patio:      { label: 'Em Pátio',      bg: 'rgba(245,158,11,0.1)',  color: '#fcd34d', dot: '#f59e0b' },
  descarregando: { label: 'Descarregando', bg: 'rgba(234,88,12,0.1)',   color: '#fdba74', dot: '#ea580c' },
  concluido:     { label: 'Concluído',     bg: 'rgba(34,197,94,0.1)',   color: '#86efac', dot: '#22c55e' },
  cancelado:     { label: 'Cancelado',     bg: 'rgba(107,114,128,0.1)', color: '#9ca3af', dot: '#6b7280' },
}

export function StatusBadge({ status }: { status: StatusAgendamento }) {
  const c = CONFIG[status]
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: c.bg, color: c.color }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.dot }} />
      {c.label}
    </span>
  )
}
