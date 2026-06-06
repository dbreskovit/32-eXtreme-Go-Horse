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
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
         style={{ background: 'var(--slate-50)' }}>
      <div className="w-full max-w-md">
        <button onClick={() => navigate('/')} className="mb-8 text-sm font-medium hover:underline inline-flex items-center gap-1"
                style={{ color: 'var(--slate-500)' }}>
          ← Voltar
        </button>

        <h1 className="mb-2 font-bold"
            style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--slate-900)', letterSpacing: '-0.025em' }}>
          Criar conta
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--slate-500)' }}>Comece grátis, sem cartão de crédito.</p>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                   style={{
                     background: s < step ? '#16a34a' : s === step ? 'var(--slate-900)' : 'var(--slate-200)',
                     color: s <= step ? '#fff' : 'var(--slate-500)',
                   }}>
                {s < step ? '✓' : s}
              </div>
              <span className="text-xs font-medium" style={{ color: s <= step ? 'var(--slate-800)' : 'var(--slate-400)' }}>
                {s === 1 ? 'Dados da empresa' : 'Escolha o plano'}
              </span>
              {s < 2 && (
                <div className="w-8 h-px mx-2"
                     style={{ background: step > 1 ? '#bbf7d0' : 'var(--slate-200)' }} />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-6"
             style={{ background: '#fff', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.28 }} className="space-y-4">
                <LightField label="Razão Social" value={form.razaoSocial} onChange={set('razaoSocial')} placeholder="Cooperativa Tritícola Ltda." />
                <LightField label="CNPJ" value={form.cnpj} onChange={set('cnpj')} placeholder="00.000.000/0001-00" />
                <LightField label="E-mail" type="email" value={form.email} onChange={set('email')} placeholder="operacoes@empresa.com.br" />
                <LightField label="Senha" type="password" value={form.senha} onChange={set('senha')} placeholder="Mínimo 8 caracteres" />
                <button onClick={() => setStep(2)}
                        className="w-full py-3.5 rounded-xl font-bold text-sm mt-2 transition-all"
                        style={{ background: '#16a34a', color: '#fff', boxShadow: '0 4px 14px rgba(22,163,74,0.3)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#15803d')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#16a34a')}>
                  Próximo →
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.28 }} className="space-y-3">
                {PLANOS.map((p) => {
                  const sel = plano.id === p.id
                  return (
                    <div key={p.id} onClick={() => setPlano(p)}
                         className="cursor-pointer p-4 rounded-xl transition-all"
                         style={{
                           background: sel ? '#f0fdf4' : 'var(--slate-50)',
                           border: sel ? '1.5px solid #16a34a' : '1px solid var(--slate-200)',
                           boxShadow: sel ? '0 0 0 3px rgba(22,163,74,0.1)' : 'none',
                         }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-sm" style={{ color: 'var(--slate-900)' }}>{p.nome}</div>
                          <div className="text-xs mt-0.5" style={{ color: 'var(--slate-500)' }}>{p.descricao}</div>
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: sel ? '#16a34a' : 'var(--slate-500)', whiteSpace: 'nowrap', marginLeft: 16, fontWeight: 600 }}>
                          {p.precoMensal === 0 ? 'Grátis' : p.precoMensal === -1 ? 'Consulta' : `R$ ${p.precoMensal}/mês`}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(1)}
                          className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
                          style={{ border: '1px solid var(--slate-200)', color: 'var(--slate-600)', background: '#fff' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--slate-50)')}
                          onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                    ← Voltar
                  </button>
                  <button onClick={finalizar} disabled={loading}
                          className="flex-1 py-3 rounded-xl font-bold text-sm disabled:opacity-50 transition-all"
                          style={{ background: '#16a34a', color: '#fff', boxShadow: '0 4px 12px rgba(22,163,74,0.3)' }}
                          onMouseEnter={e => !loading && (e.currentTarget.style.background = '#15803d')}
                          onMouseLeave={e => (e.currentTarget.style.background = '#16a34a')}>
                    {loading ? 'Criando...' : 'Criar conta'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function LightField({ label, type = 'text', value, onChange, placeholder }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
             style={{ color: 'var(--slate-400)' }}>
        {label}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required
             className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
             style={{
               background: 'var(--slate-50)',
               border: '1px solid var(--slate-200)',
               color: 'var(--slate-900)',
               fontFamily: 'var(--font-sans)',
             }}
             onFocus={e => {
               e.currentTarget.style.borderColor = '#16a34a'
               e.currentTarget.style.background = '#fff'
               e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.12)'
             }}
             onBlur={e => {
               e.currentTarget.style.borderColor = 'var(--slate-200)'
               e.currentTarget.style.background = 'var(--slate-50)'
               e.currentTarget.style.boxShadow = 'none'
             }} />
    </div>
  )
}
