import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { PLANOS } from '../../mocks/data'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
})

const STATS = [
  { value: '+20%', label: 'custo de frete no pico da safra', icon: '📈' },
  { value: '356 Mt', label: 'colhidos na safra 25/26', icon: '🌾' },
  { value: '1,2 bi L', label: 'de diesel extras em 2025', icon: '⛽' },
]

const HOW = [
  { n: '01', title: 'Cadastre suas docas', body: 'Configure capacidade e janelas de operação de cada ponto de descarga.', color: '#6366f1' },
  { n: '02', title: 'Motorista agenda', body: 'Escolhe doca, data e horário pelo celular em menos de 1 minuto.', color: '#22c55e' },
  { n: '03', title: 'QR na guarita', body: 'Operador lê o código — o sistema direciona o caminhão para a doca certa.', color: '#f59e0b' },
  { n: '04', title: 'Analytics em tempo real', body: 'Painel ao vivo: fluxo por hora, alertas de capacidade e relatório de CO₂.', color: '#ec4899' },
]

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{ fontFamily: 'var(--font-sans)', background: '#fff' }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 h-16"
           style={{
             background: 'rgba(255,255,255,0.9)',
             backdropFilter: 'blur(16px)',
             borderBottom: '1px solid var(--slate-200)',
             boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
           }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '-0.01em' }}>
          <span style={{ color: '#16a34a' }}>Fluxo</span>
          <span style={{ color: 'var(--slate-900)' }}>Grão</span>
        </span>
        <div className="flex gap-2">
          <button onClick={() => navigate('/login')}
            className="px-4 py-1.5 text-sm rounded-full transition-all font-medium"
            style={{ color: 'var(--slate-600)', border: '1px solid var(--slate-200)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--slate-50)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            Entrar
          </button>
          <button onClick={() => navigate('/cadastro')}
            className="px-4 py-1.5 text-sm rounded-full font-semibold transition-all"
            style={{ background: '#16a34a', color: '#fff', boxShadow: '0 2px 8px rgba(22,163,74,0.3)' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#15803d')}
            onMouseLeave={e => (e.currentTarget.style.background = '#16a34a')}>
            Começar grátis
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden pt-16"
               style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 60%)' }}>
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute rounded-full blur-3xl"
               style={{ width: 700, height: 700, top: '-10%', left: '50%', transform: 'translateX(-50%)',
                        background: 'radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 65%)' }} />
          <div className="absolute rounded-full blur-3xl"
               style={{ width: 400, height: 400, bottom: '5%', right: '5%',
                        background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />
          <div className="absolute rounded-full blur-3xl"
               style={{ width: 300, height: 300, top: '20%', left: '5%',
                        background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)' }} />
        </div>

        <motion.div {...fade(0.1)} className="relative z-10 max-w-4xl mx-auto">
          <motion.div {...fade(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
                      style={{ border: '1px solid #bbf7d0', color: '#15803d', background: '#f0fdf4' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            Code Race 2026 · Agronegócio Inteligente
          </motion.div>

          <motion.h1 {...fade(0.15)} className="leading-none mb-6"
                     style={{
                       fontFamily: 'var(--font-display)',
                       fontSize: 'clamp(3rem, 8vw, 6.5rem)',
                       color: 'var(--slate-900)',
                       letterSpacing: '-0.03em',
                       lineHeight: 1.05,
                     }}>
            Fim das filas.<br />
            <span style={{ color: '#16a34a', fontStyle: 'italic' }}>Começa o fluxo.</span>
          </motion.h1>

          <motion.p {...fade(0.25)} className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
                    style={{ color: 'var(--slate-500)' }}>
            FluxoGrão traz o agendamento por janela horária dos grandes portos direto
            para cooperativas e silos do interior do Brasil.
          </motion.p>

          <motion.div {...fade(0.35)} className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate('/cadastro')}
                    className="px-8 py-3.5 rounded-full font-bold text-base transition-all"
                    style={{ background: '#16a34a', color: '#fff', boxShadow: '0 4px 16px rgba(22,163,74,0.35)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#15803d'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.transform = 'translateY(0)' }}>
              Começar gratuitamente
            </button>
            <button onClick={() => navigate('/login?tab=motorista')}
                    className="px-8 py-3.5 rounded-full font-semibold text-base transition-all"
                    style={{ border: '1.5px solid var(--slate-200)', color: 'var(--slate-700)', background: '#fff' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--slate-50)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
              Sou motorista →
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                    className="absolute bottom-10 flex flex-col items-center gap-2">
          <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--slate-300)' }}>Rolar</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-px h-8 rounded-full"
                      style={{ background: 'linear-gradient(to bottom, var(--slate-300), transparent)' }} />
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-6" style={{ background: 'var(--slate-900)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x"
             style={{ '--tw-divide-opacity': 0.12 } as React.CSSProperties}>
          {STATS.map((s, i) => (
            <motion.div key={i} {...fade(0.1 * i)} className="px-8 py-10 text-center md:text-left">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.75rem', color: '#fbbf24', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {s.value}
              </div>
              <div className="mt-2 text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6" style={{ background: 'var(--slate-50)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...fade()} className="text-center mb-4"
                     style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)',
                              color: 'var(--slate-900)', letterSpacing: '-0.025em' }}>
            Como <span style={{ color: '#16a34a', fontStyle: 'italic' }}>funciona</span>
          </motion.h2>
          <p className="text-center text-sm mb-16" style={{ color: 'var(--slate-500)' }}>
            Do agendamento à descarga em 4 etapas simples.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {HOW.map((item, i) => (
              <motion.div key={i} {...fade(0.1 * i)}
                          className="p-8 rounded-2xl relative overflow-hidden"
                          style={{ background: '#fff', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 -translate-y-8 translate-x-8"
                     style={{ background: item.color }} />
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold mb-5"
                     style={{ background: `${item.color}18`, color: item.color, border: `1px solid ${item.color}30` }}>
                  {item.n}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--slate-900)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--slate-500)' }}>{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANOS ── */}
      <section className="py-24 px-6" style={{ background: '#fff' }}>
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...fade()} className="text-center mb-4"
                     style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)',
                              color: 'var(--slate-900)', letterSpacing: '-0.025em' }}>
            Planos simples
          </motion.h2>
          <p className="text-center mb-16 text-sm" style={{ color: 'var(--slate-500)' }}>
            Comece grátis, escale quando precisar.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANOS.map((plano, i) => {
              const popular = i === 1
              return (
                <motion.div key={plano.id} {...fade(0.1 * i)}
                            className="p-8 rounded-2xl flex flex-col relative overflow-hidden"
                            style={{
                              background: popular ? 'var(--slate-900)' : '#fff',
                              border: popular ? 'none' : '1px solid var(--slate-200)',
                              boxShadow: popular ? '0 24px 48px rgba(0,0,0,0.2)' : 'var(--shadow-sm)',
                              transform: popular ? 'scale(1.02)' : 'scale(1)',
                            }}>
                  {popular && (
                    <>
                      <div className="absolute inset-0 pointer-events-none"
                           style={{ background: 'radial-gradient(ellipse at 80% 0%, rgba(22,163,74,0.2) 0%, transparent 60%)' }} />
                      <span className="self-start text-xs font-bold px-3 py-1 rounded-full mb-5"
                            style={{ background: '#16a34a', color: '#fff', boxShadow: '0 2px 8px rgba(22,163,74,0.4)' }}>
                        ⭐ Popular
                      </span>
                    </>
                  )}
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: popular ? '#fff' : 'var(--slate-900)' }}>
                    {plano.nome}
                  </div>
                  <div className="my-4" style={{ fontFamily: 'var(--font-display)', fontSize: '2.75rem', color: popular ? '#fbbf24' : '#16a34a', lineHeight: 1, letterSpacing: '-0.02em' }}>
                    {plano.precoMensal === 0 ? 'Grátis' : plano.precoMensal === -1 ? 'Consulta' : `R$ ${plano.precoMensal.toLocaleString('pt-BR')}`}
                    {plano.precoMensal > 0 && (
                      <span className="text-sm font-normal" style={{ color: popular ? 'rgba(255,255,255,0.45)' : 'var(--slate-400)' }}>/mês</span>
                    )}
                  </div>
                  <p className="text-sm mb-8 flex-1 leading-relaxed" style={{ color: popular ? 'rgba(255,255,255,0.6)' : 'var(--slate-500)' }}>
                    {plano.descricao}
                  </p>
                  <button onClick={() => navigate('/cadastro')}
                          className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
                          style={{
                            background: popular ? '#16a34a' : 'var(--slate-900)',
                            color: '#fff',
                            boxShadow: popular ? '0 4px 12px rgba(22,163,74,0.4)' : 'none',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                    {plano.precoMensal === -1 ? 'Falar com vendas' : 'Começar agora'}
                  </button>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 text-center text-xs"
              style={{ background: 'var(--slate-50)', color: 'var(--slate-400)', borderTop: '1px solid var(--slate-200)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>
          <span style={{ color: '#16a34a' }}>Fluxo</span>
          <span style={{ color: 'var(--slate-700)' }}>Grão</span>
        </span>
        <br /><br />
        Organizando o fluxo, acelerando o agro.
        <br />Code Race 2026 · Antonio Meneghetti Faculdade
      </footer>
    </div>
  )
}
