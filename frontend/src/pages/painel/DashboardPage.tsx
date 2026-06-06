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
  { key: 'totalAgendados', label: 'Agendados', icon: '📅', accent: '#3b82f6' },
  { key: 'emPatio',        label: 'Em pátio',  icon: '🚛', accent: '#f59e0b' },
  { key: 'descarregando',  label: 'Descarreg.', icon: '⬇',  accent: '#ea580c' },
  { key: 'concluidos',     label: 'Concluídos', icon: '✓',  accent: '#22c55e' },
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
          <h1 className="font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--earth)', letterSpacing: '-0.02em' }}>
            Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--bark)' }}>
            {EMPRESA.razaoSocial} · {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
             style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          Ao vivo
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {CARDS.map((card, i) => (
          <motion.div key={card.key} {...stagger(i + 1)}
                      className="rounded-2xl p-5 relative overflow-hidden"
                      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-20 translate-x-4 -translate-y-4"
                 style={{ background: card.accent }} />
            <div className="text-2xl mb-3">{card.icon}</div>
            <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--earth)' }}>
              {dash[card.key as keyof typeof dash] as number}
            </div>
            <div className="text-xs font-medium mt-1" style={{ color: 'var(--bark)' }}>{card.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico */}
        <motion.div {...stagger(5)} className="lg:col-span-2 rounded-2xl p-5"
                    style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--earth)' }}>Fluxo de chegadas por hora</h2>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--parchment)', color: 'var(--bark)' }}>hoje</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={FLUXO_HORA} margin={{ left: -20, right: 4 }}>
              <defs>
                <linearGradient id="gAgend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gConc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F2918" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0F2918" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="hora" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                cursor={{ stroke: 'rgba(0,0,0,0.08)' }}
              />
              <Area type="monotone" dataKey="total" name="Agendados" stroke="#22c55e" strokeWidth={2} fill="url(#gAgend)" dot={false} />
              <Area type="monotone" dataKey="concluidos" name="Concluídos" stroke="#0F2918" strokeWidth={2} fill="url(#gConc)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Próximas chegadas */}
        <motion.div {...stagger(6)} className="rounded-2xl p-5"
                    style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--earth)' }}>Próximas chegadas</h2>
          <div className="space-y-3">
            {dash.proximasChegadas.map(ag => (
              <div key={ag.id} className="flex items-center gap-3 p-3 rounded-xl"
                   style={{ background: 'var(--parchment)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0"
                     style={{ background: 'var(--earth)', color: 'var(--harvest)' }}>
                  {ag.motorista.nome.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate" style={{ color: 'var(--earth)' }}>{ag.motorista.nome}</div>
                  <div className="text-xs truncate" style={{ color: 'var(--bark)' }}>
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
                  style={{ background: 'var(--earth)' }}>
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(245,158,11,0.15) 0%, transparent 60%)' }} />
        <div className="relative flex items-center gap-6 flex-wrap">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--bark)' }}>
              Impacto ambiental hoje
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--cream)' }}>
              {dash.concluidos} descargas organizadas
            </div>
          </div>
          <div className="flex gap-8 ml-auto flex-wrap">
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--grain)' }}>
                {(dash.concluidos * 42 * 0.00268).toFixed(1)}t
              </div>
              <div className="text-xs" style={{ color: 'var(--bark)' }}>CO₂ não emitido</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--grain)' }}>
                ~{dash.concluidos * 3}h
              </div>
              <div className="text-xs" style={{ color: 'var(--bark)' }}>de fila eliminadas</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
