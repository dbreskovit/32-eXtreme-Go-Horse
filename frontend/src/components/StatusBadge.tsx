import type { StatusAgendamento } from '../types'

const CONFIG: Record<StatusAgendamento, { label: string; bg: string; color: string; dot: string; border: string }> = {
  agendado:      { label: 'Agendado',      bg: '#eff6ff', color: '#1d4ed8', dot: '#3b82f6', border: '#bfdbfe' },
  em_patio:      { label: 'Em Pátio',      bg: '#fffbeb', color: '#92400e', dot: '#f59e0b', border: '#fde68a' },
  descarregando: { label: 'Descarregando', bg: '#fff7ed', color: '#c2410c', dot: '#f97316', border: '#fed7aa' },
  concluido:     { label: 'Concluído',     bg: '#f0fdf4', color: '#15803d', dot: '#22c55e', border: '#bbf7d0' },
  cancelado:     { label: 'Cancelado',     bg: '#f8fafc', color: '#475569', dot: '#94a3b8', border: '#e2e8f0' },
}

export function StatusBadge({ status }: { status: StatusAgendamento }) {
  const c = CONFIG[status]
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
          style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.dot }} />
      {c.label}
    </span>
  )
}
