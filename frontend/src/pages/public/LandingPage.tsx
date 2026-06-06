import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { PLANOS } from '../../mocks/data'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
})

const STATS = [
  { value: '+20%', label: 'custo de frete no pico da safra' },
  { value: '356 Mt', label: 'colhidos na safra 25/26' },
  { value: '1,2 bi L', label: 'de diesel extras em 2025' },
]

const HOW = [
  { n: '01', title: 'Cadastre suas docas', body: 'Configure capacidade e janelas de operação de cada ponto de descarga.' },
  { n: '02', title: 'Motorista agenda', body: 'Escolhe doca, data e horário pelo celular em menos de 1 minuto.' },
  { n: '03', title: 'QR na guarita', body: 'Operador lê o código — o sistema direciona o caminhão para a doca certa.' },
  { n: '04', title: 'Analytics em tempo real', body: 'Painel ao vivo: fluxo por hora, alertas de capacidade e relatório de CO₂.' },
]

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="grain min-h-screen" style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 h-16"
           style={{ background: 'rgba(10,16,8,0.7)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontFamily: 'var(--font-display)', color: 'var(--harvest)', fontSize: '1.25rem' }}>
          FluxoGrão
        </span>
        <div className="flex gap-2">
          <button onClick={() => navigate('/login')}
            className="px-4 py-1.5 text-sm rounded-full transition-all"
            style={{ color: 'var(--mist)', border: '1px solid rgba(255,255,255,0.12)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            Entrar
          </button>
          <button onClick={() => navigate('/cadastro')}
            className="px-4 py-1.5 text-sm rounded-full font-semibold transition-all"
            style={{ background: 'var(--grain)', color: 'var(--earth)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--harvest)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--grain)')}>
            Começar grátis
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden"
               style={{ background: 'var(--earth)' }}>
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute rounded-full blur-3xl opacity-20"
               style={{ width: 600, height: 600, top: '10%', left: '50%', transform: 'translateX(-50%)',
                        background: 'radial-gradient(circle, #1A4A2E 0%, transparent 70%)' }} />
          <div className="absolute rounded-full blur-3xl opacity-15"
               style={{ width: 300, height: 300, bottom: '20%', right: '15%',
                        background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }} />
        </div>

        <motion.div {...fade(0.1)} className="relative z-10 max-w-4xl mx-auto">
          <motion.div {...fade(0)} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-8"
                      style={{ border: '1px solid rgba(245,158,11,0.3)', color: 'var(--grain)', background: 'rgba(245,158,11,0.08)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" /> Code Race 2026 · Agronegócio Inteligente
          </motion.div>

          <motion.h1 {...fade(0.15)} className="leading-none mb-6"
                     style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 6.5rem)',
                              color: 'var(--cream)', letterSpacing: '-0.02em' }}>
            Fim das filas.<br />
            <span style={{ color: 'var(--grain)', fontStyle: 'italic' }}>Começa o fluxo.</span>
          </motion.h1>

          <motion.p {...fade(0.25)} className="text-lg max-w-xl mx-auto mb-10 leading-relaxed"
                    style={{ color: 'var(--bark)' }}>
            FluxoGrão traz o agendamento por janela horária dos grandes portos direto
            para cooperativas e silos do interior do Brasil.
          </motion.p>

          <motion.div {...fade(0.35)} className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate('/cadastro')}
                    className="px-8 py-3.5 rounded-full font-bold text-base transition-all"
                    style={{ background: 'var(--grain)', color: 'var(--earth)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--harvest)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--grain)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              Começar gratuitamente
            </button>
            <button onClick={() => navigate('/login?tab=motorista')}
                    className="px-8 py-3.5 rounded-full font-semibold text-base transition-all"
                    style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'var(--cream)', background: 'rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}>
              Sou motorista →
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                    className="absolute bottom-10 flex flex-col items-center gap-2"
                    style={{ color: 'var(--bark)' }}>
          <span className="text-xs tracking-widest uppercase">Rolar</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}
                      className="w-px h-8 rounded-full" style={{ background: 'var(--bark)' }} />
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-6" style={{ background: 'var(--field)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-px"
             style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
          {STATS.map((s, i) => (
            <motion.div key={i} {...fade(0.1 * i)} className="px-8 py-10"
                        style={{ background: 'var(--field)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--grain)', lineHeight: 1 }}>{s.value}</div>
              <div className="mt-2 text-sm leading-snug" style={{ color: 'var(--bark)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6" style={{ background: 'var(--earth)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...fade()} className="text-center mb-16"
                     style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)',
                              color: 'var(--cream)', letterSpacing: '-0.02em' }}>
            Como <span style={{ color: 'var(--grain)', fontStyle: 'italic' }}>funciona</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HOW.map((item, i) => (
              <motion.div key={i} {...fade(0.1 * i)}
                          className="p-8 rounded-2xl"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="mb-4" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--grain)' }}>{item.n}</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--cream)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--bark)' }}>{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANOS ── */}
      <section className="py-24 px-6" style={{ background: 'var(--field)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...fade()} className="text-center mb-4"
                     style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)',
                              color: 'var(--cream)', letterSpacing: '-0.02em' }}>
            Planos simples
          </motion.h2>
          <p className="text-center mb-16 text-sm" style={{ color: 'var(--bark)' }}>
            Comece grátis, escale quando precisar.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANOS.map((plano, i) => (
              <motion.div key={plano.id} {...fade(0.1 * i)}
                          className="p-8 rounded-2xl flex flex-col"
                          style={{
                            background: i === 1 ? 'var(--canopy)' : 'rgba(255,255,255,0.03)',
                            border: i === 1 ? '1px solid var(--blade)' : '1px solid rgba(255,255,255,0.07)',
                          }}>
                {i === 1 && (
                  <span className="self-start text-xs font-bold px-2.5 py-1 rounded-full mb-4"
                        style={{ background: 'var(--grain)', color: 'var(--earth)' }}>
                    Popular
                  </span>
                )}
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--cream)' }}>{plano.nome}</div>
                <div className="my-4" style={{ fontFamily: 'var(--font-display)', fontSize: '2.75rem', color: 'var(--grain)', lineHeight: 1 }}>
                  {plano.precoMensal === 0 ? 'Grátis' : plano.precoMensal === -1 ? 'Consulta' : `R$ ${plano.precoMensal.toLocaleString('pt-BR')}`}
                  {plano.precoMensal > 0 && <span className="text-sm font-normal" style={{ color: 'var(--bark)' }}>/mês</span>}
                </div>
                <p className="text-sm mb-8 flex-1 leading-relaxed" style={{ color: 'var(--bark)' }}>{plano.descricao}</p>
                <button onClick={() => navigate('/cadastro')}
                        className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
                        style={{ background: i === 1 ? 'var(--grain)' : 'rgba(255,255,255,0.07)',
                                 color: i === 1 ? 'var(--earth)' : 'var(--cream)' }}>
                  {plano.precoMensal === -1 ? 'Falar com vendas' : 'Começar agora'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 text-center text-xs" style={{ background: 'var(--earth)', color: 'var(--bark)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--cream)' }}>FluxoGrão</span>
        <br /><br />
        Organizando o fluxo, acelerando o agro.
        <br />Code Race 2026 · Antonio Meneghetti Faculdade
      </footer>
    </div>
  )
}
