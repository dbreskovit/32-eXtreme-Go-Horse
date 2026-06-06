import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PLANOS } from '../../mocks/data'
import { useAuth } from '../../contexts/AuthContext'
import type { Plano } from '../../types'

export function RegisterPage() {
  const [step, setStep] = useState(1)
  const [planoSelecionado, setPlanoSelecionado] = useState<Plano>(PLANOS[0])
  const [loading, setLoading] = useState(false)
  const { loginEmpresa } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    razaoSocial: '', cnpj: '', email: '', senha: '', telefone: '',
  })

  async function handleFinalizar() {
    setLoading(true)
    await loginEmpresa(form.email, form.senha)
    navigate('/painel/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <span className="text-4xl">🌾</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Criar conta</h1>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8 justify-center">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                s <= step ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {s}
              </div>
              <span className={`text-sm ${s <= step ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {s === 1 ? 'Dados da empresa' : 'Escolha o plano'}
              </span>
              {s < 2 && <div className="w-12 h-px bg-gray-200 ml-2" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-green-100 p-8">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                <input
                  value={form.razaoSocial} onChange={e => setForm({ ...form, razaoSocial: e.target.value })}
                  placeholder="Cooperativa Tritícola Ltda."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                <input
                  value={form.cnpj} onChange={e => setForm({ ...form, cnpj: e.target.value })}
                  placeholder="00.000.000/0001-00"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="operacoes@empresa.com.br"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input
                  type="password" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors mt-2"
              >
                Próximo →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Escolha seu plano</h2>
              <div className="space-y-3 mb-6">
                {PLANOS.map(plano => (
                  <div
                    key={plano.id}
                    onClick={() => setPlanoSelecionado(plano)}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                      planoSelecionado.id === plano.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-gray-900">{plano.nome}</span>
                        <p className="text-xs text-gray-500 mt-0.5">{plano.descricao}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        {plano.precoMensal === 0 ? (
                          <span className="font-bold text-green-600">Grátis</span>
                        ) : plano.precoMensal === -1 ? (
                          <span className="font-bold text-gray-700">Consulta</span>
                        ) : (
                          <span className="font-bold text-gray-900">R$ {plano.precoMensal}/mês</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  ← Voltar
                </button>
                <button
                  onClick={handleFinalizar} disabled={loading}
                  className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-60 transition-colors"
                >
                  {loading ? 'Criando conta...' : 'Criar conta'}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Já tem conta?{' '}
          <button onClick={() => navigate('/login')} className="text-green-600 font-medium hover:underline">
            Entrar
          </button>
        </p>
      </div>
    </div>
  )
}
