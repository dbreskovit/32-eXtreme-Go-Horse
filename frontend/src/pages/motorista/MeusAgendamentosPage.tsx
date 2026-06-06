import { useNavigate } from 'react-router-dom'
import { AGENDAMENTOS } from '../../mocks/data'
import { StatusBadge } from '../../components/StatusBadge'
import { useAuth } from '../../contexts/AuthContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function MeusAgendamentosPage() {
  const { motorista, logout } = useAuth()
  const navigate = useNavigate()
  // Simula agendamentos do motorista logado
  const meus = AGENDAMENTOS.filter(a => a.motorista.id === 'mot-1')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🌾</span>
            <div>
              <div className="font-semibold">{motorista?.nome}</div>
              <div className="text-green-200 text-xs">
                Score de pontualidade: {motorista?.scorePontualidade}% ⭐
              </div>
            </div>
          </div>
          <button onClick={logout} className="text-green-200 text-sm hover:text-white">Sair</button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Meus agendamentos</h2>
          <button
            onClick={() => navigate('/motorista/agendar')}
            className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            + Agendar
          </button>
        </div>

        {meus.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-gray-500 font-medium">Nenhum agendamento</p>
            <p className="text-sm text-gray-400 mt-1">Toque em + Agendar para começar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {meus.map(ag => (
              <div key={ag.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-mono font-bold text-gray-900 text-lg">{ag.codigo}</span>
                  <StatusBadge status={ag.status} />
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>📍 {ag.unidade.nome}</div>
                  <div>🏗️ {ag.doca.nome}</div>
                  <div>
                    🕐 {format(new Date(ag.dataHoraAgendada), "d 'de' MMM 'às' HH:mm", { locale: ptBR })}
                  </div>
                  <div>⚖️ {ag.volumeTon} toneladas</div>
                </div>
                {ag.status === 'agendado' && (
                  <button className="mt-3 w-full py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                    Cancelar agendamento
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
