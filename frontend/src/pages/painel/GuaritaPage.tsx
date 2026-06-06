import { useState } from 'react'
import { AGENDAMENTOS } from '../../mocks/data'
import { StatusBadge } from '../../components/StatusBadge'
import { format } from 'date-fns'
import type { Agendamento, StatusAgendamento } from '../../types'

export function GuaritaPage() {
  const [busca, setBusca] = useState('')
  const [encontrado, setEncontrado] = useState<Agendamento | null>(null)
  const [erro, setErro] = useState('')
  const [agendamentos, setAgendamentos] = useState(AGENDAMENTOS)

  function handleBuscar(e: React.FormEvent) {
    e.preventDefault()
    const termo = busca.trim().toUpperCase()
    const ag = agendamentos.find(
      a => a.codigo.toUpperCase() === termo || a.veiculo.placa.toUpperCase().replace('-', '') === termo.replace('-', '')
    )
    if (ag) {
      setEncontrado(ag)
      setErro('')
    } else {
      setEncontrado(null)
      setErro('Nenhum agendamento encontrado para este código ou placa.')
    }
  }

  function avancarStatus() {
    if (!encontrado) return
    const proximo: Partial<Record<StatusAgendamento, StatusAgendamento>> = {
      agendado: 'em_patio',
      em_patio: 'descarregando',
      descarregando: 'concluido',
    }
    const novoStatus = proximo[encontrado.status]
    if (!novoStatus) return
    const atualizado = { ...encontrado, status: novoStatus }
    setEncontrado(atualizado)
    setAgendamentos(prev => prev.map(a => a.id === encontrado.id ? atualizado : a))
  }

  const EM_PATIO = agendamentos.filter(a => ['em_patio', 'descarregando'].includes(a.status))

  const ACAO_LABELS: Partial<Record<StatusAgendamento, string>> = {
    agendado: '✅ Fazer Check-in',
    em_patio: '⬇️ Iniciar Descarga',
    descarregando: '🏁 Finalizar Descarga',
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Guarita</h1>
        <p className="text-gray-500 text-sm mt-0.5">Busque por código QR ou placa do veículo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Busca */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleBuscar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código QR ou Placa
              </label>
              <input
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Ex: FG-2847 ou ABC-1D23"
                autoFocus
                className="w-full px-5 py-4 text-2xl font-mono border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-center tracking-widest uppercase"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-green-600 text-white text-lg font-bold rounded-xl hover:bg-green-700 transition-colors"
            >
              🔍 Buscar
            </button>
          </form>

          {erro && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
              {erro}
            </div>
          )}

          {encontrado && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-mono font-bold text-gray-900 text-lg">{encontrado.codigo}</div>
                    <StatusBadge status={encontrado.status} />
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {format(new Date(encontrado.dataHoraAgendada), 'HH:mm')}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Motorista</span>
                    <div className="font-medium text-gray-900">{encontrado.motorista.nome}</div>
                    <div className="text-xs text-gray-400">Score: {encontrado.motorista.scorePontualidade}%</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Veículo</span>
                    <div className="font-medium text-gray-900">{encontrado.veiculo.placa}</div>
                    <div className="text-xs text-gray-400">{encontrado.veiculo.tipo}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Doca</span>
                    <div className="font-medium text-gray-900">{encontrado.doca.nome}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Volume</span>
                    <div className="font-medium text-gray-900">{encontrado.volumeTon} toneladas</div>
                  </div>
                </div>
              </div>

              {ACAO_LABELS[encontrado.status] && (
                <button
                  onClick={avancarStatus}
                  className="w-full py-4 bg-green-600 text-white text-lg font-bold rounded-xl hover:bg-green-700 transition-colors"
                >
                  {ACAO_LABELS[encontrado.status]}
                </button>
              )}

              {encontrado.status === 'concluido' && (
                <div className="text-center py-4 bg-green-50 rounded-xl text-green-700 font-semibold">
                  ✅ Descarga concluída com sucesso!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Em pátio */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Em pátio agora
            <span className="ml-2 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {EM_PATIO.length}
            </span>
          </h2>
          {EM_PATIO.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">🏁</div>
              <p className="text-sm">Nenhum caminhão no pátio no momento</p>
            </div>
          ) : (
            <div className="space-y-3">
              {EM_PATIO.map(ag => (
                <div
                  key={ag.id}
                  onClick={() => { setEncontrado(ag); setBusca(ag.codigo); setErro('') }}
                  className="cursor-pointer flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all"
                >
                  <div className="text-2xl">🚛</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-gray-900">{ag.codigo}</span>
                      <StatusBadge status={ag.status} />
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {ag.motorista.nome} · {ag.veiculo.placa} · {ag.doca.nome}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
