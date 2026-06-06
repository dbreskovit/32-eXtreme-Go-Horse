import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { PLANOS } from '../../mocks/data'
import { useAuth } from '../../contexts/AuthContext'
import type { Plano } from '../../types'

export function RegisterPage() {
  const [step, setStep] = useState(1)
  const [plano, setPlano] = useState<Plano>(PLANOS[0])
  const [loading, setLoading] = useState(false)
  const { loginEmpresa } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ razaoSocial: '', cnpj: '', email: '', senha: '' })
  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  async function finalizar() {
    setLoading(true)
    await loginEmpresa(form.email, form.senha)
    navigate('/painel/dashboard')
  }

  return (
    <div className="grain min-h-screen flex items-center justify-center px-4 py-12"
         style={{ background: 'var(--earth)' }}>
      <div className="w-full max-w-md">
        <button onClick={() => navigate('/')} className="mb-8 text-sm hover:underline" style={{ color: 'var(--bark)' }}>
          ← Voltar
        </button>

        <h1 className="mb-2 font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--cream)', letterSpacing: '-0.02em' }}>
          Criar conta
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--bark)' }}>Comece grátis, sem cartão de crédito.</p>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                   style={{
                     background: s <= step ? 'var(--grain)' : 'rgba(255,255,255,0.08)',
                     color: s <= step ? 'var(--earth)' : 'var(--bark)',
                   }}>
                {s < step ? '✓' : s}
              </div>
              <span className="text-xs" style={{ color: s <= step ? 'var(--cream)' : 'var(--bark)' }}>
                {s === 1 ? 'Dados da empresa' : 'Plano'}
              </span>
              {s < 2 && <div className="w-8 h-px mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }} className="space-y-4">
              <DarkField label="Razão Social" value={form.razaoSocial} onChange={set('razaoSocial')} placeholder="Cooperativa Tritícola Ltda." />
              <DarkField label="CNPJ" value={form.cnpj} onChange={set('cnpj')} placeholder="00.000.000/0001-00" />
              <DarkField label="E-mail" type="email" value={form.email} onChange={set('email')} placeholder="operacoes@empresa.com.br" />
              <DarkField label="Senha" type="password" value={form.senha} onChange={set('senha')} placeholder="Mínimo 8 caracteres" />
              <button onClick={() => setStep(2)}
                      className="w-full py-3 rounded-xl font-bold text-sm mt-2"
                      style={{ background: 'var(--grain)', color: 'var(--earth)' }}>
                Próximo →
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }} className="space-y-3">
              {PLANOS.map((p, i) => (
                <div key={p.id} onClick={() => setPlano(p)}
                     className="cursor-pointer p-5 rounded-xl transition-all"
                     style={{
                       background: plano.id === p.id ? 'var(--canopy)' : 'rgba(255,255,255,0.03)',
                       border: plano.id === p.id ? '1px solid var(--blade)' : '1px solid rgba(255,255,255,0.07)',
                     }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm" style={{ color: 'var(--cream)' }}>{p.nome}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--bark)' }}>{p.descricao}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--grain)', whiteSpace: 'nowrap', marginLeft: 16 }}>
                      {p.precoMensal === 0 ? 'Grátis' : p.precoMensal === -1 ? 'Consulta' : `R$ ${p.precoMensal}/mês`}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)}
                        className="flex-1 py-3 rounded-xl font-semibold text-sm"
                        style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'var(--cream)' }}>
                  ← Voltar
                </button>
                <button onClick={finalizar} disabled={loading}
                        className="flex-1 py-3 rounded-xl font-bold text-sm disabled:opacity-50"
                        style={{ background: 'var(--grain)', color: 'var(--earth)' }}>
                  {loading ? 'Criando...' : 'Criar conta'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function DarkField({ label, type = 'text', value, onChange, placeholder }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--bark)' }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required
             className="w-full px-4 py-3 rounded-xl text-sm outline-none"
             style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--cream)', fontFamily: 'var(--font-sans)' }}
             onFocus={e => (e.currentTarget.style.borderColor = 'var(--grain)')}
             onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
    </div>
  )
}
