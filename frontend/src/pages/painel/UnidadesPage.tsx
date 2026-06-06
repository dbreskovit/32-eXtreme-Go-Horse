import { useState } from 'react'
import { UNIDADES, DOCAS } from '../../mocks/data'
import type { Unidade, Doca } from '../../types'

export function UnidadesPage() {
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<Unidade | null>(null)

  const docasDaUnidade = (id: string) => DOCAS.filter(d => d.unidadeId === id)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Unidades e Docas</h1>
          <p className="text-gray-500 text-sm mt-0.5">{UNIDADES.length} unidades cadastradas</p>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors">
          + Nova unidade
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {UNIDADES.map(unidade => {
          const docas = docasDaUnidade(unidade.id)
          const isAberta = unidadeSelecionada?.id === unidade.id

          return (
            <div key={unidade.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{unidade.nome}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      📍 {unidade.cidade}, {unidade.estado}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{unidade.endereco}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    {docas.length} docas
                  </span>
                </div>
                <button
                  onClick={() => setUnidadeSelecionada(isAberta ? null : unidade)}
                  className="mt-4 text-sm text-green-600 font-medium hover:text-green-700"
                >
                  {isAberta ? '▲ Ocultar docas' : '▼ Ver docas'}
                </button>
              </div>

              {isAberta && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Docas</span>
                    <button className="text-xs text-green-600 font-medium hover:text-green-700">+ Adicionar</button>
                  </div>
                  <div className="space-y-2">
                    {docas.map((doca: Doca) => (
                      <div key={doca.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{doca.nome}</div>
                          <div className="text-xs text-gray-400">{doca.capacidadeTonHora}t/h · {doca.tipoCarga}</div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          doca.ativa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {doca.ativa ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
