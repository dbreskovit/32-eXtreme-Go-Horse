import { motion } from 'motion/react'
import { DASHBOARD_HOJE, FLUXO_HORA, EMPRESA } from '../../mocks/data'
import { StatusBadge } from '../../components/StatusBadge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

const CARDS = [
  { key: 'totalAgendados', label: 'Agendados',   icon: '📅', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
  { key: 'emPatio',        label: 'Em pátio',    icon: '🚛', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  { key: 'descarregando',  label: 'Descarreg.',  icon: '⬇',  color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
  { key: 'concluidos',     label: 'Concluídos',  icon: '✓',  color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
]

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]
const stagger = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EASE, delay: i * 0.07 },
})

export function DashboardPage() {
  const dash = DASHBOARD_HOJE

  return (
    <div className="p-6 max-w-6xl mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>

      {/* Header */}
      <motion.div {...stagger(0)} className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', color: 'var(--slate-900)', letterSpacing: '-0.025em' }}>
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--slate-500)' }}>
            {EMPRESA.razaoSocial} · {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
             style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          Ao vivo
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {CARDS.map((card, i) => (
          <motion.div key={card.key} {...stagger(i + 1)}
                      className="rounded-2xl p-5 relative overflow-hidden cursor-default transition-all"
                      style={{
                        background: card.bg,
                        border: `1px solid ${card.border}`,
                        boxShadow: 'var(--shadow-sm)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl -translate-y-4 translate-x-4 opacity-30"
                 style={{ background: card.color }} />
            <div className="text-2xl mb-3">{card.icon}</div>
            <div className="text-3xl font-bold mb-1"
                 style={{ fontFamily: 'var(--font-display)', color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
              {dash[card.key as keyof typeof dash] as number}
            </div>
            <div className="text-xs font-semibold" style={{ color: card.color }}>{card.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Gráfico */}
        <motion.div {...stagger(5)} className="lg:col-span-2 rounded-2xl p-5"
                    style={{ background: '#fff', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-sm" style={{ color: 'var(--slate-900)' }}>Fluxo de chegadas por hora</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--slate-400)' }}>Volume de veículos ao longo do dia</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ background: 'var(--slate-100)', color: 'var(--slate-500)', border: '1px solid var(--slate-200)' }}>
              hoje
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={FLUXO_HORA} margin={{ left: -20, right: 4 }}>
              <defs>
                <linearGradient id="gAgend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gConc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="hora" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  fontSize: 12, borderRadius: 12, border: '1px solid var(--slate-200)',
                  boxShadow: 'var(--shadow-md)', background: '#fff', color: 'var(--slate-900)',
                }}
                cursor={{ stroke: 'rgba(0,0,0,0.06)' }}
              />
              <Area type="monotone" dataKey="total"     name="Agendados" stroke="#22c55e" strokeWidth={2} fill="url(#gAgend)" dot={false} />
              <Area type="monotone" dataKey="concluidos" name="Concluídos" stroke="#6366f1" strokeWidth={2} fill="url(#gConc)"  dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Próximas chegadas */}
        <motion.div {...stagger(6)} className="rounded-2xl p-5"
                    style={{ background: '#fff', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--slate-900)' }}>Próximas chegadas</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe' }}>
              {dash.proximasChegadas.length}
            </span>
          </div>
          <div className="space-y-2.5">
            {dash.proximasChegadas.map(ag => (
              <div key={ag.id} className="flex items-center gap-3 p-3 rounded-xl transition-all"
                   style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-100)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                     style={{ background: 'linear-gradient(135deg, #22c55e, #15803d)', color: '#fff' }}>
                  {ag.motorista.nome.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate" style={{ color: 'var(--slate-800)' }}>{ag.motorista.nome}</div>
                  <div className="text-xs truncate mt-0.5" style={{ color: 'var(--slate-400)', fontFamily: 'var(--font-mono)' }}>
                    {ag.veiculo.placa} · {format(new Date(ag.dataHoraAgendada), 'HH:mm')}
                  </div>
                </div>
                <StatusBadge status={ag.status} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sustentabilidade */}
      <motion.div {...stagger(7)} className="mt-6 rounded-2xl p-6 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #15803d 100%)',
                    boxShadow: '0 8px 24px rgba(21,128,61,0.25)',
                  }}>
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at 85% 50%, rgba(251,191,36,0.15) 0%, transparent 55%)' }} />
        {/* Decorative circle */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full blur-3xl opacity-20"
             style={{ background: '#fbbf24' }} />
        <div className="relative flex items-center gap-6 flex-wrap">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Impacto ambiental hoje
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#fff' }}>
              {dash.concluidos} descargas organizadas
            </div>
          </div>
          <div className="flex gap-10 ml-auto flex-wrap">
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', color: '#fbbf24', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {(dash.concluidos * 42 * 0.00268).toFixed(1)}t
              </div>
              <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>CO₂ não emitido</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', color: '#fbbf24', lineHeight: 1, letterSpacing: '-0.02em' }}>
                ~{dash.concluidos * 3}h
              </div>
              <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>de fila eliminadas</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
