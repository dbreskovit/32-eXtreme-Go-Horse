import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { UNIDADES, DOCAS, SLOTS } from '../../mocks/data'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import type { Unidade, Doca, Slot } from '../../types'

type Step = 1 | 2 | 3 | 4

const STEPS = ['Unidade', 'Doca', 'Horário', 'Confirmar']

export function AgendarPage() {
  const { motorista, logout } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)
  const [unidade, setUnidade] = useState<Unidade | null>(null)
  const [doca, setDoca] = useState<Doca | null>(null)
  const [slot, setSlot] = useState<Slot | null>(null)
  const [volume, setVolume] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [codigo] = useState(() => `FG-${2900 + Math.floor(Math.random() * 99)}`)
  const [busca, setBusca] = useState('')

  const unidades = busca
    ? UNIDADES.filter(u => u.nome.toLowerCase().includes(busca.toLowerCase()) || u.cidade.toLowerCase().includes(busca.toLowerCase()))
    : UNIDADES
  const docas = unidade ? DOCAS.filter(d => d.unidadeId === unidade.id && d.ativa) : []

  async function confirmar() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setDone(true)
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
         style={{ background: 'var(--earth)', fontFamily: 'var(--font-sans)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
                  className="w-full max-w-sm rounded-2xl p-8 text-center"
                  style={{ background: 'var(--field)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-5"
             style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>✓</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--cream)', letterSpacing: '-0.02em' }}>
          Agendado!
        </h2>
        <p className="text-sm my-3" style={{ color: 'var(--bark)' }}>Apresente este código na guarita.</p>
        <div className="rounded-xl p-6 my-5"
             style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div className="text-xs mb-1 uppercase tracking-widest" style={{ color: 'var(--bark)' }}>Seu código</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color: 'var(--grain)', letterSpacing: '0.08em' }}>
            {codigo}
          </div>
        </div>
        <div className="text-xs text-left space-y-2 rounded-xl p-4 mb-6"
             style={{ background: 'rgba(255,255,255,0.04)' }}>
          {[['Unidade', unidade?.nome], ['Doca', doca?.nome], ['Horário', `${slot?.horaInicio}–${slot?.horaFim}`], ['Volume', `${volume}t`]].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span style={{ color: 'var(--bark)' }}>{k}</span>
              <span style={{ color: 'var(--cream)' }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/motorista/meus')}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold"
                  style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'var(--cream)' }}>
            Meus agendamentos
          </button>
          <button onClick={() => { setDone(false); setStep(1); setUnidade(null); setDoca(null); setSlot(null); setVolume(''); }}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--grain)', color: 'var(--earth)' }}>
            Novo
          </button>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: 'var(--earth)', fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div className="px-4 pt-safe pt-4 pb-4 flex items-center justify-between"
           style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--harvest)' }}>FluxoGrão</span>
          <span className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <span className="text-sm" style={{ color: 'var(--bark)' }}>{motorista?.nome}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/motorista/meus')} className="text-xs" style={{ color: 'var(--bark)' }}>Meus agendamentos</button>
          <button onClick={logout} className="text-xs" style={{ color: 'var(--bark)' }}>Sair</button>
        </div>
      </div>

      {/* Steps */}
      <div className="flex px-4 py-3 gap-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-1 flex-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                   style={{
                     background: i + 1 < step ? 'var(--blade)' : i + 1 === step ? 'var(--grain)' : 'rgba(255,255,255,0.1)',
                     color: i + 1 <= step ? 'var(--earth)' : 'var(--bark)',
                   }}>
                {i + 1 < step ? '✓' : i + 1}
              </div>
              <span className="text-xs hidden sm:block" style={{ color: i + 1 <= step ? 'var(--cream)' : 'var(--bark)' }}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className="flex-1 h-px mx-1" style={{ background: 'rgba(255,255,255,0.08)' }} />}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }} className="space-y-4">
              <h2 className="font-semibold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--cream)', letterSpacing: '-0.01em' }}>
                Onde vai descarregar?
              </h2>
              <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar cooperativa ou cidade..."
                     className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                     style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cream)', fontFamily: 'var(--font-sans)' }} />
              {unidades.map(u => (
                <button key={u.id} onClick={() => { setUnidade(u); setStep(2) }}
                        className="w-full text-left p-4 rounded-xl transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--grain)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
                  <div className="font-semibold text-sm" style={{ color: 'var(--cream)' }}>{u.nome}</div>
                  <div className="text-xs mt-0.5 flex items-center gap-3" style={{ color: 'var(--bark)' }}>
                    <span>📍 {u.cidade}, {u.estado}</span>
                    <span style={{ color: '#22c55e' }}>{u.totalDocas} docas</span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-4">
              <button onClick={() => setStep(1)} className="text-xs font-semibold" style={{ color: 'var(--grain)' }}>← Voltar</button>
              <h2 className="font-semibold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--cream)', letterSpacing: '-0.01em' }}>
                Escolha a doca
              </h2>
              <p className="text-xs" style={{ color: 'var(--bark)' }}>{unidade?.nome}</p>
              {docas.map(d => (
                <button key={d.id} onClick={() => { setDoca(d); setStep(3) }}
                        className="w-full text-left p-4 rounded-xl transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--grain)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
                  <div className="font-semibold text-sm" style={{ color: 'var(--cream)' }}>{d.nome}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--bark)' }}>{d.tipoCarga} · {d.capacidadeTonHora}t/h</div>
                </button>
              ))}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-4">
              <button onClick={() => setStep(2)} className="text-xs font-semibold" style={{ color: 'var(--grain)' }}>← Voltar</button>
              <h2 className="font-semibold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--cream)', letterSpacing: '-0.01em' }}>
                Escolha o horário
              </h2>
              <p className="text-xs mb-2" style={{ color: 'var(--bark)' }}>{doca?.nome}</p>
              <div className="grid grid-cols-2 gap-3">
                {SLOTS.map((s, i) => (
                  <button key={i} disabled={s.ocupado} onClick={() => { setSlot(s); setStep(4) }}
                          className="p-4 rounded-xl text-left transition-all"
                          style={{
                            background: s.ocupado ? 'rgba(255,255,255,0.02)' : slot === s ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.04)',
                            border: s.ocupado ? '1px solid rgba(255,255,255,0.04)' : slot === s ? '1px solid var(--grain)' : '1px solid rgba(255,255,255,0.08)',
                            opacity: s.ocupado ? 0.4 : 1, cursor: s.ocupado ? 'not-allowed' : 'pointer',
                          }}>
                    <div className="font-bold text-sm" style={{ fontFamily: 'var(--font-mono)', color: s.ocupado ? 'var(--bark)' : 'var(--cream)' }}>
                      {s.horaInicio}
                    </div>
                    <div className="text-xs mt-0.5 font-semibold"
                         style={{ color: s.ocupado ? '#ef4444' : '#22c55e' }}>
                      {s.ocupado ? 'Lotado' : `${s.capacidadeDisponivel}t livre`}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-4">
              <button onClick={() => setStep(3)} className="text-xs font-semibold" style={{ color: 'var(--grain)' }}>← Voltar</button>
              <h2 className="font-semibold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--cream)', letterSpacing: '-0.01em' }}>
                Confirmar agendamento
              </h2>
              <div className="rounded-xl p-4 space-y-2.5 text-xs"
                   style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {[['Unidade', unidade?.nome], ['Doca', doca?.nome], ['Horário', `${slot?.horaInicio} – ${slot?.horaFim}`], ['Veículo', 'ABC-1D23 · Bitrem']].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span style={{ color: 'var(--bark)' }}>{k}</span>
                    <span className="font-semibold" style={{ color: 'var(--cream)' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--bark)' }}>
                  Volume estimado (toneladas)
                </label>
                <input type="number" value={volume} onChange={e => setVolume(e.target.value)}
                       placeholder="Ex: 42" min="1"
                       className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                       style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--cream)', fontFamily: 'var(--font-sans)' }}
                       onFocus={e => (e.currentTarget.style.borderColor = 'var(--grain)')}
                       onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>
              <button onClick={confirmar} disabled={!volume || loading}
                      className="w-full py-4 rounded-xl font-bold text-sm transition-all disabled:opacity-40"
                      style={{ background: 'var(--grain)', color: 'var(--earth)' }}>
                {loading ? 'Confirmando...' : 'Confirmar agendamento'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
