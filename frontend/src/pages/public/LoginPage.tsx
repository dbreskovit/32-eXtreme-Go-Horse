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
    <div className="grain min-h-screen flex" style={{ background: 'var(--earth)' }}>
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-14 relative overflow-hidden"
           style={{ background: 'var(--field)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at 20% 80%, rgba(245,158,11,0.12) 0%, transparent 60%)' }} />
        <div>
          <button onClick={() => navigate('/')}
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--harvest)' }}>
            FluxoGrão
          </button>
        </div>
        <div>
          <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--cream)', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
            "A solução é<br />
            <span style={{ color: 'var(--grain)', fontStyle: 'italic' }}>programação,</span><br />
            não tem saída."
          </blockquote>
          <cite className="block mt-4 text-sm not-italic" style={{ color: 'var(--bark)' }}>
            — Sopesp, sobre congestionamento no T-Grão Santos
          </cite>
        </div>
        <div className="text-xs" style={{ color: 'var(--bark)' }}>Code Race 2026 · AMF</div>
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
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--harvest)' }}>FluxoGrão</span>
          </div>

          <h1 className="mb-2 font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--cream)', letterSpacing: '-0.02em' }}>
            Bem-vindo de volta
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--bark)' }}>Entre na sua conta para continuar.</p>

          {/* Tab toggle */}
          <div className="flex rounded-xl p-1 mb-6"
               style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {(['empresa', 'motorista'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                      className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
                      style={{
                        background: tab === t ? 'rgba(255,255,255,0.1)' : 'transparent',
                        color: tab === t ? 'var(--cream)' : 'var(--bark)',
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
              <p className="text-sm px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>
                {erro}
              </p>
            )}

            <button type="submit" disabled={loading}
                    className="w-full py-3 rounded-xl font-bold text-sm transition-all mt-2"
                    style={{ background: 'var(--grain)', color: 'var(--earth)' }}
                    onMouseEnter={e => !loading && (e.currentTarget.style.background = 'var(--harvest)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--grain)')}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--bark)' }}>
            Não tem conta?{' '}
            <button onClick={() => navigate('/cadastro')}
                    className="font-semibold hover:underline" style={{ color: 'var(--grain)' }}>
              Criar conta
            </button>
          </p>
          <p className="text-center text-xs mt-4" style={{ color: 'rgba(107,114,85,0.6)' }}>
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
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--bark)' }}>
        {label}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
             placeholder={placeholder} required
             className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
             style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--cream)', fontFamily: 'var(--font-sans)' }}
             onFocus={e => (e.currentTarget.style.borderColor = 'var(--grain)')}
             onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
    </div>
  )
}
