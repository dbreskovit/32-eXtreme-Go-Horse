import { useState } from 'react'
import { DASHBOARD_HOJE, FLUXO_HORA, EMPRESA } from '../../mocks/data'
import { StatusBadge } from '../../components/StatusBadge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const CARDS = [
  { key: 'totalAgendados', label: 'Agendados hoje', icon: '📅', color: 'bg-blue-50 text-blue-600' },
  { key: 'emPatio',        label: 'Em pátio',        icon: '🚛', color: 'bg-yellow-50 text-yellow-600' },
  { key: 'descarregando',  label: 'Descarregando',   icon: '⬇️', color: 'bg-orange-50 text-orange-600' },
  { key: 'concluidos',     label: 'Concluídos',      icon: '✅', color: 'bg-green-50 text-green-600' },
]

export function DashboardPage() {
  const dash = DASHBOARD_HOJE
  const [dataGrafico] = useState(FLUXO_HORA)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {EMPRESA.razaoSocial} · {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 text-sm px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Ao vivo
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {CARDS.map(card => (
          <div key={card.key} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl ${card.color} mb-3`}>
              {card.icon}
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {dash[card.key as keyof typeof dash] as number}
            </div>
            <div className="text-sm text-gray-500 mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Fluxo de chegadas por hora</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dataGrafico} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hora" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="total" name="Agendados" fill="#86efac" radius={[4, 4, 0, 0]} />
              <Bar dataKey="concluidos" name="Concluídos" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Próximas chegadas */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Próximas chegadas</h2>
          <div className="space-y-3">
            {dash.proximasChegadas.map(ag => (
              <div key={ag.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="text-2xl">🚛</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{ag.motorista.nome}</div>
                  <div className="text-xs text-gray-500 truncate">{ag.veiculo.placa} · {ag.doca.nome}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {format(new Date(ag.dataHoraAgendada), 'HH:mm')} · {ag.volumeTon}t
                  </div>
                </div>
                <StatusBadge status={ag.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calculadora sustentável */}
      <div className="mt-6 bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-5 text-white shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-3xl">🌱</div>
          <div>
            <div className="font-semibold text-lg">Impacto ambiental de hoje</div>
            <div className="text-green-200 text-sm">
              {dash.concluidos} descargas organizadas evitaram tempo ocioso nas filas
            </div>
          </div>
          <div className="flex gap-8 ml-auto flex-wrap">
            <div className="text-center">
              <div className="text-2xl font-bold">{(dash.concluidos * 42 * 0.00268).toFixed(1)}t</div>
              <div className="text-green-200 text-xs">CO₂ não emitido</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">~{dash.concluidos * 3}h</div>
              <div className="text-green-200 text-xs">de fila eliminadas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
