import type { StatusAgendamento } from '../types'

const CONFIG: Record<StatusAgendamento, { label: string; classes: string }> = {
  agendado:     { label: 'Agendado',     classes: 'bg-blue-100 text-blue-700' },
  em_patio:     { label: 'Em Pátio',     classes: 'bg-yellow-100 text-yellow-700' },
  descarregando:{ label: 'Descarregando',classes: 'bg-orange-100 text-orange-700' },
  concluido:    { label: 'Concluído',    classes: 'bg-green-100 text-green-700' },
  cancelado:    { label: 'Cancelado',    classes: 'bg-gray-100 text-gray-500' },
}

export function StatusBadge({ status }: { status: StatusAgendamento }) {
  const { label, classes } = CONFIG[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {label}
    </span>
  )
}
