import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function LoginPage() {
  const [params] = useSearchParams()
  const [tab, setTab] = useState<'empresa' | 'motorista'>(
    params.get('tab') === 'motorista' ? 'motorista' : 'empresa'
  )
  const [email, setEmail] = useState('carlos@cotripal.com.br')
  const [senha, setSenha] = useState('123456')
  const [telefone, setTelefone] = useState('(55) 99876-5432')
  const [placa, setPlaca] = useState('ABC-1D23')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const { loginEmpresa, loginMotorista, isAuthenticated, tipo } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(tipo === 'motorista' ? '/motorista/agendar' : '/painel/dashboard', { replace: true })
    }
  }, [isAuthenticated, tipo, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      if (tab === 'empresa') await loginEmpresa(email, senha)
      else await loginMotorista(telefone, placa)
    } catch {
      setErro('Credenciais inválidas. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🌾</div>
          <h1 className="text-2xl font-bold text-gray-900">FluxoGrão</h1>
          <p className="text-gray-500 text-sm mt-1">Agendamento inteligente de fluxo graneleiro</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-green-100 p-8">
          {/* Tabs */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            {(['empresa', 'motorista'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  tab === t ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'empresa' ? '🏢 Empresa' : '🚛 Motorista'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'empresa' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                  <input
                    type="password" value={senha} onChange={e => setSenha(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel" value={telefone} onChange={e => setTelefone(e.target.value)}
                    placeholder="(55) 99999-9999"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Placa do veículo</label>
                  <input
                    type="text" value={placa} onChange={e => setPlaca(e.target.value)}
                    placeholder="ABC-1D23"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </>
            )}

            {erro && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Não tem conta?{' '}
            <button onClick={() => navigate('/cadastro')} className="text-green-600 font-medium hover:underline">
              Cadastre sua empresa
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          💡 Demo: qualquer credencial funciona
        </p>
      </div>
    </div>
  )
}
