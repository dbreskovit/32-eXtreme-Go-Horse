import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useMeusAgendamentos } from '../../hooks/useAgendamentos'
import { StatusBadge } from '../../components/StatusBadge'
import { useAuth } from '../../contexts/AuthContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'

export function MeusAgendamentosPage() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const { agendamentos, loading, erro, cancelar } = useMeusAgendamentos()
  const [cancelando, setCancelando] = useState<string | null>(null)

  async function handleCancelar(id: string) {
    setCancelando(id)
    try {
      await cancelar(id)
    } finally {
      setCancelando(null)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--earth)', fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
               style={{ background: 'var(--canopy)', color: 'var(--blade)' }}>
            {((usuario as any)?.nome ?? (usuario as any)?.telefone ?? '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--cream)' }}>
              {(usuario as any)?.nome ?? (usuario as any)?.telefone ?? 'Motorista'}
            </div>
            {(usuario as any)?.scorePontualidade != null && (
              <div className="text-xs" style={{ color: 'var(--bark)' }}>
                Score {(usuario as any).scorePontualidade}% ⭐
              </div>
            )}
          </div>
        </div>
        <button onClick={logout} className="text-xs" style={{ color: 'var(--bark)' }}>Sair</button>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                    className="flex items-center justify-between mb-6">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--cream)', letterSpacing: '-0.02em' }}>
            Meus agendamentos
          </h1>
          <button onClick={() => navigate('/motorista/agendar')}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{ background: 'var(--grain)', color: 'var(--earth)' }}>
            + Agendar
          </button>
        </motion.div>

        {erro && (
          <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.15)' }}>
            {erro}
          </div>
        )}

        {loading && agendamentos.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--bark)' }}>
            <div className="text-4xl mb-3 animate-pulse">📅</div>
            <p className="text-sm">Carregando...</p>
          </div>
        ) : agendamentos.length === 0 ? (
          <div className="text-center py-20 rounded-2xl"
               style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-5xl mb-3 opacity-30">📅</div>
            <p className="text-sm font-medium" style={{ color: 'var(--cream)' }}>Nenhum agendamento</p>
            <p className="text-xs mt-1" style={{ color: 'var(--bark)' }}>Toque em + Agendar para começar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {agendamentos.map((ag, i) => (
              <motion.div key={ag.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.07 }}
                          className="rounded-2xl p-4"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-start justify-between mb-3">
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--grain)' }}>
                    {ag.codigo}
                  </span>
                  <StatusBadge status={ag.status} />
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5" style={{ color: 'var(--bark)' }}>
                    <span>📍</span> {ag.doca?.unidade?.nome ?? (ag as any).unidade?.nome ?? '-'}
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: 'var(--bark)' }}>
                    <span>🏗</span> {ag.doca?.nome ?? '-'}
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: 'var(--bark)' }}>
                    <span>🕐</span> {format(new Date(ag.dataHoraAgendada), "d 'de' MMM 'às' HH:mm", { locale: ptBR })}
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: 'var(--bark)' }}>
                    <span>⚖</span> {ag.volumeTon} toneladas
                  </div>
                </div>
                {ag.status === 'agendado' && (
                  <button
                    onClick={() => handleCancelar(ag.id)}
                    disabled={cancelando === ag.id}
                    className="mt-4 w-full py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                    style={{ border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {cancelando === ag.id ? 'Cancelando...' : 'Cancelar agendamento'}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
