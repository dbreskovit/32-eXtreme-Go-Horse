import { useState } from 'react'
import { UNIDADES, DOCAS, SLOTS } from '../../mocks/data'
import { useAuth } from '../../contexts/AuthContext'
import type { Unidade, Doca, Slot } from '../../types'

type Step = 1 | 2 | 3 | 4 | 5

export function AgendarPage() {
  const { motorista } = useAuth()
  const [step, setStep] = useState<Step>(1)
  const [unidade, setUnidade] = useState<Unidade | null>(null)
  const [doca, setDoca] = useState<Doca | null>(null)
  const [slot, setSlot] = useState<Slot | null>(null)
  const [volume, setVolume] = useState('')
  const [concluido, setConcluido] = useState(false)
  const [busca, setBusca] = useState('')

  const unidadesFiltradas = busca
    ? UNIDADES.filter(u => u.nome.toLowerCase().includes(busca.toLowerCase()) || u.cidade.toLowerCase().includes(busca.toLowerCase()))
    : UNIDADES

  const docasDaUnidade = unidade ? DOCAS.filter(d => d.unidadeId === unidade.id && d.ativa) : []

  async function confirmar() {
    await new Promise(r => setTimeout(r, 800))
    setConcluido(true)
  }

  if (concluido) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agendado!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Seu agendamento foi confirmado. Apresente o código na guarita.
          </p>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
            <div className="text-xs text-gray-400 mb-1">Seu código</div>
            <div className="font-mono text-3xl font-bold text-green-700 tracking-widest">FG-{Math.floor(2900 + Math.random() * 99)}</div>
          </div>
          <div className="text-left space-y-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
            <div><span className="text-gray-400">Unidade:</span> {unidade?.nome}</div>
            <div><span className="text-gray-400">Doca:</span> {doca?.nome}</div>
            <div><span className="text-gray-400">Horário:</span> {slot?.horaInicio} – {slot?.horaFim}</div>
            <div><span className="text-gray-400">Volume:</span> {volume}t</div>
          </div>
          <button
            onClick={() => { setConcluido(false); setStep(1); setUnidade(null); setDoca(null); setSlot(null); setVolume(''); }}
            className="w-full mt-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Novo agendamento
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <span className="text-xl">🌾</span>
          <div>
            <div className="font-semibold">Agendar Descarga</div>
            <div className="text-green-200 text-xs">{motorista?.nome}</div>
          </div>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-lg mx-auto flex justify-between">
          {(['Unidade', 'Doca', 'Horário', 'Confirmar'] as const).map((label, i) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                i + 1 < step ? 'bg-green-600 text-white' :
                i + 1 === step ? 'bg-green-100 text-green-700 ring-2 ring-green-500' :
                'bg-gray-100 text-gray-400'
              }`}>
                {i + 1 < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i + 1 <= step ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Step 1: Unidade */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Onde você vai descarregar?</h2>
            <input
              value={busca} onChange={e => setBusca(e.target.value)}
              placeholder="Buscar por nome ou cidade..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="space-y-3">
              {unidadesFiltradas.map(u => (
                <button
                  key={u.id}
                  onClick={() => { setUnidade(u); setStep(2) }}
                  className="w-full text-left p-4 bg-white rounded-xl border border-gray-100 hover:border-green-300 hover:shadow-sm transition-all"
                >
                  <div className="font-medium text-gray-900">{u.nome}</div>
                  <div className="text-sm text-gray-500 mt-0.5">📍 {u.cidade}, {u.estado}</div>
                  <div className="text-xs text-green-600 mt-1">{u.totalDocas} docas disponíveis</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Doca */}
        {step === 2 && (
          <div className="space-y-4">
            <button onClick={() => setStep(1)} className="text-sm text-green-600 font-medium">← Voltar</button>
            <h2 className="text-lg font-bold text-gray-900">Escolha a doca</h2>
            <p className="text-sm text-gray-500">{unidade?.nome}</p>
            <div className="space-y-3">
              {docasDaUnidade.map(d => (
                <button
                  key={d.id}
                  onClick={() => { setDoca(d); setStep(3) }}
                  className="w-full text-left p-4 bg-white rounded-xl border border-gray-100 hover:border-green-300 hover:shadow-sm transition-all"
                >
                  <div className="font-medium text-gray-900">{d.nome}</div>
                  <div className="text-sm text-gray-500 mt-0.5">Carga: {d.tipoCarga} · {d.capacidadeTonHora}t/h</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Horário */}
        {step === 3 && (
          <div className="space-y-4">
            <button onClick={() => setStep(2)} className="text-sm text-green-600 font-medium">← Voltar</button>
            <h2 className="text-lg font-bold text-gray-900">Escolha o horário</h2>
            <p className="text-sm text-gray-500">{doca?.nome}</p>
            <div className="grid grid-cols-2 gap-3">
              {SLOTS.map((s, i) => (
                <button
                  key={i}
                  disabled={s.ocupado}
                  onClick={() => { setSlot(s); setStep(4) }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    s.ocupado
                      ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      : slot === s
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-100 bg-white hover:border-green-300'
                  }`}
                >
                  <div className="font-semibold text-sm text-gray-900">{s.horaInicio} – {s.horaFim}</div>
                  <div className={`text-xs mt-1 font-medium ${s.ocupado ? 'text-red-400' : 'text-green-600'}`}>
                    {s.ocupado ? 'Lotado' : `${s.capacidadeDisponivel}t disponível`}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Confirmar */}
        {step === 4 && (
          <div className="space-y-4">
            <button onClick={() => setStep(3)} className="text-sm text-green-600 font-medium">← Voltar</button>
            <h2 className="text-lg font-bold text-gray-900">Confirmar agendamento</h2>
            <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Unidade</span><span className="font-medium text-gray-900">{unidade?.nome}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Doca</span><span className="font-medium text-gray-900">{doca?.nome}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Horário</span><span className="font-medium text-gray-900">{slot?.horaInicio} – {slot?.horaFim}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Veículo</span><span className="font-medium text-gray-900">ABC-1D23 · Bitrem</span></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Volume estimado (toneladas)</label>
              <input
                type="number" value={volume} onChange={e => setVolume(e.target.value)}
                placeholder="Ex: 42"
                min="1" max={slot?.capacidadeDisponivel}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {slot && <p className="text-xs text-gray-400 mt-1">Máximo disponível: {slot.capacidadeDisponivel}t</p>}
            </div>
            <button
              onClick={confirmar} disabled={!volume}
              className="w-full py-4 bg-green-600 text-white font-bold text-lg rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              Confirmar agendamento
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
