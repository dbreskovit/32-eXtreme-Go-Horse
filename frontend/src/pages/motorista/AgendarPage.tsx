import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useUnidadesPublicas } from '../../hooks/useUnidades'
import { useSlots } from '../../hooks/useSlots'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import type { UnidadeApi, DocaApi } from '../../hooks/useUnidades'
import type { SlotApi } from '../../hooks/useSlots'
import { format } from 'date-fns'

type Step = 1 | 2 | 3 | 4

const STEPS = ['Unidade', 'Doca', 'Horário', 'Confirmar']

export function AgendarPage() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)
  const [unidade, setUnidade] = useState<UnidadeApi | null>(null)
  const [doca, setDoca] = useState<DocaApi | null>(null)
  const [slot, setSlot] = useState<SlotApi | null>(null)
  const [volume, setVolume] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [codigoRetornado, setCodigoRetornado] = useState('')
  const [busca, setBusca] = useState('')
  const [erroConfirmar, setErroConfirmar] = useState('')

  const dataHoje = format(new Date(), 'yyyy-MM-dd')
  const horaSlot = slot ? `${dataHoje}T${slot.horaInicio}:00` : null

  const { unidades, loading: loadingUnidades } = useUnidadesPublicas()
  const { slots, loading: loadingSlots } = useSlots(doca?.id ?? null, doca ? dataHoje : null)

  const unidadesFiltradas = busca
    ? unidades.filter(u => u.nome.toLowerCase().includes(busca.toLowerCase()) || u.cidade.toLowerCase().includes(busca.toLowerCase()))
    : unidades

  const docasAtivas = unidade?.docas?.filter(d => d.ativa) ?? []

  async function confirmar() {
    if (!doca || !slot || !volume || !horaSlot) return
    setLoading(true)
    setErroConfirmar('')
    try {
      const meRes = await api.get<any>('/auth/me')
      const veiculos = meRes.data?.veiculos ?? []
      const veiculoId = veiculos[0]?.id

      if (!veiculoId) {
        setErroConfirmar('Nenhum veículo associado ao seu cadastro. Faça login com sua placa novamente.')
        setLoading(false)
        return
      }

      const res = await api.post<any>('/agendamentos', {
        docaId: doca.id,
        veiculoId,
        dataHoraAgendada: horaSlot,
        volumeTon: Number(volume),
      })
      setCodigoRetornado(res.data.codigo)
      setDone(true)
    } catch (e: any) {
      setErroConfirmar(e?.response?.data?.message ?? 'Erro ao criar agendamento.')
    } finally {
      setLoading(false)
    }
  }

  /* ─── Tela de sucesso ─── */
  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
         style={{ background: 'var(--slate-50)', fontFamily: 'var(--font-sans)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
                  className="w-full max-w-sm rounded-2xl p-8 text-center"
                  style={{ background: '#fff', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-xl)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-5"
             style={{ background: '#f0fdf4', border: '2px solid #bbf7d0', color: '#16a34a' }}>
          ✓
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
          Agendado!
        </h2>
        <p className="text-sm my-3" style={{ color: 'var(--slate-500)' }}>Apresente este código na guarita.</p>
        <div className="rounded-2xl p-6 my-5"
             style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
          <div className="text-xs mb-2 uppercase tracking-widest font-semibold" style={{ color: '#92400e' }}>Seu código</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: '#d97706', letterSpacing: '0.08em' }}>
            {codigoRetornado}
          </div>
        </div>
        <div className="text-xs text-left space-y-2 rounded-xl p-4 mb-6"
             style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-200)' }}>
          {[['Unidade', unidade?.nome], ['Doca', doca?.nome], ['Horário', `${slot?.horaInicio}–${slot?.horaFim}`], ['Volume', `${volume}t`]].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span style={{ color: 'var(--slate-400)' }}>{k}</span>
              <span className="font-semibold" style={{ color: 'var(--slate-800)' }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/motorista/meus')}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ border: '1px solid var(--slate-200)', color: 'var(--slate-700)', background: '#fff' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--slate-50)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
            Meus agendamentos
          </button>
          <button onClick={() => { setDone(false); setStep(1); setUnidade(null); setDoca(null); setSlot(null); setVolume('') }}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: '#16a34a', color: '#fff', boxShadow: '0 4px 12px rgba(22,163,74,0.3)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#15803d')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#16a34a')}>
            Novo
          </button>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: 'var(--slate-50)', fontFamily: 'var(--font-sans)' }}>

      {/* Header */}
      <div className="px-4 pt-4 pb-4 flex items-center justify-between"
           style={{ background: '#fff', borderBottom: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-xs)' }}>
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
            <span style={{ color: '#16a34a' }}>Fluxo</span>
            <span style={{ color: 'var(--slate-900)' }}>Grão</span>
          </span>
          <span className="w-px h-4" style={{ background: 'var(--slate-200)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--slate-500)' }}>
            {(usuario as any)?.telefone ?? (usuario as any)?.nome ?? 'Motorista'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/motorista/meus')} className="text-xs font-medium"
                  style={{ color: 'var(--slate-500)' }}>
            Meus agendamentos
          </button>
          <button onClick={logout} className="text-xs font-medium"
                  style={{ color: '#dc2626' }}>
            Sair
          </button>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex px-4 py-3 gap-1"
           style={{ background: '#fff', borderBottom: '1px solid var(--slate-100)' }}>
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-1 flex-1">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                   style={{
                     background: i + 1 < step ? '#16a34a' : i + 1 === step ? 'var(--slate-900)' : 'var(--slate-100)',
                     color: i + 1 <= step ? '#fff' : 'var(--slate-400)',
                   }}>
                {i + 1 < step ? '✓' : i + 1}
              </div>
              <span className="text-xs hidden sm:block font-medium"
                    style={{ color: i + 1 <= step ? 'var(--slate-700)' : 'var(--slate-400)' }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-2"
                   style={{ background: i + 1 < step ? '#bbf7d0' : 'var(--slate-200)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">

          {/* Step 1 — Unidade */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }} className="space-y-4">
              <h2 className="font-semibold"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--slate-900)', letterSpacing: '-0.01em' }}>
                Onde vai descarregar?
              </h2>
              <input value={busca} onChange={e => setBusca(e.target.value)}
                     placeholder="Buscar cooperativa ou cidade..."
                     className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                     style={{
                       background: '#fff', border: '1px solid var(--slate-200)',
                       color: 'var(--slate-900)', fontFamily: 'var(--font-sans)',
                     }}
                     onFocus={e => { e.currentTarget.style.borderColor = '#16a34a'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.12)' }}
                     onBlur={e => { e.currentTarget.style.borderColor = 'var(--slate-200)'; e.currentTarget.style.boxShadow = 'none' }} />
              {loadingUnidades && (
                <p className="text-xs text-center animate-pulse" style={{ color: 'var(--slate-400)' }}>Carregando unidades...</p>
              )}
              {unidadesFiltradas.map(u => (
                <button key={u.id} onClick={() => { setUnidade(u); setStep(2) }}
                        className="w-full text-left p-4 rounded-xl transition-all"
                        style={{ background: '#fff', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-xs)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#16a34a'; e.currentTarget.style.background = '#f0fdf4' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--slate-200)'; e.currentTarget.style.background = '#fff' }}>
                  <div className="font-semibold text-sm" style={{ color: 'var(--slate-900)' }}>{u.nome}</div>
                  <div className="text-xs mt-0.5 flex items-center gap-3" style={{ color: 'var(--slate-400)' }}>
                    <span>📍 {u.cidade}, {u.estado}</span>
                    <span style={{ color: '#16a34a', fontWeight: 600 }}>{u.totalDocas} docas</span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {/* Step 2 — Doca */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }} className="space-y-4">
              <button onClick={() => setStep(1)} className="text-xs font-semibold"
                      style={{ color: '#16a34a' }}>← Voltar</button>
              <h2 className="font-semibold"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--slate-900)', letterSpacing: '-0.01em' }}>
                Escolha a doca
              </h2>
              <p className="text-xs font-medium" style={{ color: 'var(--slate-500)' }}>{unidade?.nome}</p>
              {docasAtivas.length === 0 && (
                <p className="text-xs text-center py-6" style={{ color: 'var(--slate-400)' }}>Nenhuma doca ativa nesta unidade.</p>
              )}
              {docasAtivas.map((d: DocaApi) => (
                <button key={d.id} onClick={() => { setDoca(d); setStep(3) }}
                        className="w-full text-left p-4 rounded-xl transition-all"
                        style={{ background: '#fff', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-xs)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#16a34a'; e.currentTarget.style.background = '#f0fdf4' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--slate-200)'; e.currentTarget.style.background = '#fff' }}>
                  <div className="font-semibold text-sm" style={{ color: 'var(--slate-900)' }}>{d.nome}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--slate-400)' }}>{d.tipoCarga} · {d.capacidadeTonHora}t/h</div>
                </button>
              ))}
            </motion.div>
          )}

          {/* Step 3 — Horário */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }} className="space-y-4">
              <button onClick={() => setStep(2)} className="text-xs font-semibold"
                      style={{ color: '#16a34a' }}>← Voltar</button>
              <h2 className="font-semibold"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--slate-900)', letterSpacing: '-0.01em' }}>
                Escolha o horário
              </h2>
              <p className="text-xs font-medium" style={{ color: 'var(--slate-500)' }}>{doca?.nome} · hoje {dataHoje}</p>
              {loadingSlots && (
                <p className="text-xs text-center animate-pulse py-4" style={{ color: 'var(--slate-400)' }}>Carregando horários disponíveis...</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                {slots.map((s, i) => (
                  <button key={i} disabled={s.ocupado} onClick={() => { setSlot(s); setStep(4) }}
                          className="p-4 rounded-xl text-left transition-all"
                          style={{
                            background: s.ocupado ? 'var(--slate-50)' : slot === s ? '#f0fdf4' : '#fff',
                            border: s.ocupado ? '1px solid var(--slate-100)' : slot === s ? '1.5px solid #16a34a' : '1px solid var(--slate-200)',
                            opacity: s.ocupado ? 0.5 : 1,
                            cursor: s.ocupado ? 'not-allowed' : 'pointer',
                            boxShadow: s.ocupado ? 'none' : 'var(--shadow-xs)',
                          }}>
                    <div className="font-bold text-sm"
                         style={{ fontFamily: 'var(--font-mono)', color: s.ocupado ? 'var(--slate-400)' : 'var(--slate-900)' }}>
                      {s.horaInicio}
                    </div>
                    <div className="text-xs mt-0.5 font-semibold"
                         style={{ color: s.ocupado ? '#ef4444' : '#16a34a' }}>
                      {s.ocupado ? 'Lotado' : `${s.capacidadeDisponivel}t livre`}
                    </div>
                  </button>
                ))}
                {!loadingSlots && slots.length === 0 && (
                  <p className="text-xs col-span-2 text-center py-6" style={{ color: 'var(--slate-400)' }}>
                    Nenhum horário disponível para hoje nesta doca.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 4 — Confirmar */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }} className="space-y-4">
              <button onClick={() => setStep(3)} className="text-xs font-semibold"
                      style={{ color: '#16a34a' }}>← Voltar</button>
              <h2 className="font-semibold"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--slate-900)', letterSpacing: '-0.01em' }}>
                Confirmar agendamento
              </h2>
              <div className="rounded-xl p-4 space-y-2.5 text-xs"
                   style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-200)' }}>
                {[['Unidade', unidade?.nome], ['Doca', doca?.nome], ['Horário', `${slot?.horaInicio} – ${slot?.horaFim}`]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span style={{ color: 'var(--slate-400)' }}>{k}</span>
                    <span className="font-semibold" style={{ color: 'var(--slate-800)' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-widest"
                       style={{ color: 'var(--slate-400)' }}>
                  Volume estimado (toneladas)
                </label>
                <input type="number" value={volume} onChange={e => setVolume(e.target.value)}
                       placeholder="Ex: 42" min="1"
                       className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                       style={{ background: '#fff', border: '1px solid var(--slate-200)', color: 'var(--slate-900)', fontFamily: 'var(--font-sans)' }}
                       onFocus={e => { e.currentTarget.style.borderColor = '#16a34a'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.12)' }}
                       onBlur={e => { e.currentTarget.style.borderColor = 'var(--slate-200)'; e.currentTarget.style.boxShadow = 'none' }} />
              </div>
              {erroConfirmar && (
                <p className="text-xs p-3 rounded-xl"
                   style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                  {erroConfirmar}
                </p>
              )}
              <button onClick={confirmar} disabled={!volume || loading}
                      className="w-full py-4 rounded-xl font-bold text-sm transition-all disabled:opacity-40"
                      style={{ background: '#16a34a', color: '#fff', boxShadow: '0 4px 14px rgba(22,163,74,0.3)' }}
                      onMouseEnter={e => !loading && (e.currentTarget.style.background = '#15803d')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#16a34a')}>
                {loading ? 'Confirmando...' : 'Confirmar agendamento'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
