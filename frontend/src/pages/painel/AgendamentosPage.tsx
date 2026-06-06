import { useState } from 'react'
import { AGENDAMENTOS } from '../../mocks/data'
import { StatusBadge } from '../../components/StatusBadge'
import { format } from 'date-fns'
import type { Agendamento, StatusAgendamento } from '../../types'

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Todos os status' },
  { value: 'agendado', label: 'Agendado' },
  { value: 'em_patio', label: 'Em Pátio' },
  { value: 'descarregando', label: 'Descarregando' },
  { value: 'concluido', label: 'Concluído' },
  { value: 'cancelado', label: 'Cancelado' },
]

const PROXIMA_ACAO: Partial<Record<StatusAgendamento, string>> = {
  agendado: 'Check-in',
  em_patio: 'Iniciar descarga',
  descarregando: 'Finalizar',
}

export function AgendamentosPage() {
  const [filtroStatus, setFiltroStatus] = useState('')
  const [agendamentos, setAgendamentos] = useState(AGENDAMENTOS)

  const filtrados = filtroStatus
    ? agendamentos.filter(a => a.status === filtroStatus)
    : agendamentos

  function avancarStatus(ag: Agendamento) {
    const proximo: Partial<Record<StatusAgendamento, StatusAgendamento>> = {
      agendado: 'em_patio',
      em_patio: 'descarregando',
      descarregando: 'concluido',
    }
    const novoStatus = proximo[ag.status]
    if (!novoStatus) return
    setAgendamentos(prev =>
      prev.map(a => a.id === ag.id ? { ...a, status: novoStatus } : a)
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-500 text-sm mt-0.5">{filtrados.length} registros</p>
        </div>
        <select
          value={filtroStatus}
          onChange={e => setFiltroStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Código</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Motorista</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Placa</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Doca</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Horário</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Volume</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtrados.map(ag => (
              <tr key={ag.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-gray-900">{ag.codigo}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{ag.motorista.nome}</div>
                  <div className="text-xs text-gray-400">Score: {ag.motorista.scorePontualidade}%</div>
                </td>
                <td className="px-4 py-3 text-gray-600">{ag.veiculo.placa}</td>
                <td className="px-4 py-3 text-gray-600">{ag.doca.nome}</td>
                <td className="px-4 py-3 text-gray-600">
                  {format(new Date(ag.dataHoraAgendada), 'HH:mm')}
                </td>
                <td className="px-4 py-3 text-gray-600">{ag.volumeTon}t</td>
                <td className="px-4 py-3"><StatusBadge status={ag.status} /></td>
                <td className="px-4 py-3">
                  {PROXIMA_ACAO[ag.status] && (
                    <button
                      onClick={() => avancarStatus(ag)}
                      className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      {PROXIMA_ACAO[ag.status]}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtrados.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">📋</div>
            <p className="font-medium">Nenhum agendamento encontrado</p>
            <p className="text-sm mt-1">Tente mudar o filtro de status</p>
          </div>
        )}
      </div>
    </div>
  )
}
