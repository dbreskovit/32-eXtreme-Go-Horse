import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
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
    if (isAuthenticated)
      navigate(tipo === 'motorista' ? '/motorista/agendar' : '/painel/dashboard', { replace: true })
  }, [isAuthenticated, tipo, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      if (tab === 'empresa') await loginEmpresa(email, senha)
      else await loginMotorista(telefone, placa)
    } catch {
      setErro('Credenciais inválidas.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--slate-50)' }}>

      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-14 relative overflow-hidden"
           style={{ background: 'var(--slate-900)' }}>
        {/* Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full blur-3xl opacity-30"
               style={{ width: 500, height: 500, bottom: '0%', left: '-10%',
                        background: 'radial-gradient(circle, rgba(22,163,74,0.4) 0%, transparent 65%)' }} />
          <div className="absolute rounded-full blur-3xl opacity-20"
               style={{ width: 350, height: 350, top: '10%', right: '-5%',
                        background: 'radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 65%)' }} />
        </div>

        <div className="relative">
          <button onClick={() => navigate('/')}
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '-0.01em' }}>
            <span style={{ color: '#22c55e' }}>Fluxo</span>
            <span style={{ color: '#fff' }}>Grão</span>
          </button>
        </div>

        <div className="relative">
          <blockquote style={{
            fontFamily: 'var(--font-display)', fontSize: '2.1rem', color: '#fff',
            lineHeight: 1.25, letterSpacing: '-0.025em'
          }}>
            "A solução é<br />
            <span style={{ color: '#fbbf24', fontStyle: 'italic' }}>programação,</span><br />
            não tem saída."
          </blockquote>
          <cite className="block mt-5 text-sm not-italic" style={{ color: 'rgba(255,255,255,0.4)' }}>
            — Sopesp, sobre congestionamento no T-Grão Santos
          </cite>
        </div>

        <div className="relative text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Code Race 2026 · AMF
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
              <span style={{ color: '#16a34a' }}>Fluxo</span>
              <span style={{ color: 'var(--slate-900)' }}>Grão</span>
            </span>
          </div>

          <h1 className="mb-2 font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--slate-900)', letterSpacing: '-0.025em' }}>
            Bem-vindo de volta
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--slate-500)' }}>Entre na sua conta para continuar.</p>

          {/* Tab toggle */}
          <div className="flex p-1 rounded-xl mb-6"
               style={{ background: 'var(--slate-100)', border: '1px solid var(--slate-200)' }}>
            {(['empresa', 'motorista'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                      className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
                      style={{
                        background: tab === t ? '#fff' : 'transparent',
                        color: tab === t ? 'var(--slate-900)' : 'var(--slate-400)',
                        boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                      }}>
                {t === 'empresa' ? '🏢 Empresa' : '🚛 Motorista'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'empresa' ? (
              <>
                <Field label="E-mail" type="email" value={email} onChange={setEmail} />
                <Field label="Senha" type="password" value={senha} onChange={setSenha} />
              </>
            ) : (
              <>
                <Field label="Telefone" type="tel" value={telefone} onChange={setTelefone} placeholder="(55) 99999-9999" />
                <Field label="Placa do veículo" type="text" value={placa} onChange={setPlaca} placeholder="ABC-1D23" />
              </>
            )}

            {erro && (
              <p className="text-sm px-3 py-2.5 rounded-xl"
                 style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                {erro}
              </p>
            )}

            <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold text-sm transition-all mt-2"
                    style={{
                      background: '#16a34a', color: '#fff',
                      boxShadow: '0 4px 14px rgba(22,163,74,0.35)',
                      opacity: loading ? 0.7 : 1,
                    }}
                    onMouseEnter={e => !loading && (e.currentTarget.style.background = '#15803d')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#16a34a')}>
              {loading ? 'Entrando...' : 'Entrar →'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--slate-500)' }}>
            Não tem conta?{' '}
            <button onClick={() => navigate('/cadastro')}
                    className="font-semibold hover:underline" style={{ color: '#16a34a' }}>
              Criar conta
            </button>
          </p>
          <p className="text-center text-xs mt-4" style={{ color: 'var(--slate-300)' }}>
            Demo: qualquer credencial funciona
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function Field({ label, type, value, onChange, placeholder }: {
  label: string; type: string; value: string
  onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
             style={{ color: 'var(--slate-400)' }}>
        {label}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
             placeholder={placeholder} required
             className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
             style={{
               background: '#fff',
               border: '1px solid var(--slate-200)',
               color: 'var(--slate-900)',
               fontFamily: 'var(--font-sans)',
               boxShadow: 'var(--shadow-xs)',
             }}
             onFocus={e => {
               e.currentTarget.style.borderColor = '#16a34a'
               e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.15)'
             }}
             onBlur={e => {
               e.currentTarget.style.borderColor = 'var(--slate-200)'
               e.currentTarget.style.boxShadow = 'var(--shadow-xs)'
             }} />
    </div>
  )
}
