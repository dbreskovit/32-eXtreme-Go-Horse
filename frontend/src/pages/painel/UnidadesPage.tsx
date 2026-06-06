import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { UNIDADES, DOCAS } from '../../mocks/data'
import type { Unidade } from '../../types'

export function UnidadesPage() {
  const [aberta, setAberta] = useState<string | null>(null)

  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                  className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', color: 'var(--slate-900)', letterSpacing: '-0.025em' }}>
            Unidades e Docas
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--slate-500)' }}>{UNIDADES.length} unidades cadastradas</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'var(--green-600)', color: '#fff', boxShadow: '0 2px 8px rgba(22,163,74,0.3)' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#15803d')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--green-600)')}>
          <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span> Nova unidade
        </button>
      </motion.div>

      <div className="space-y-3">
        {UNIDADES.map((u: Unidade, i) => {
          const docas = DOCAS.filter(d => d.unidadeId === u.id)
          const isOpen = aberta === u.id

          return (
            <motion.div key={u.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className="rounded-2xl overflow-hidden"
                        style={{
                          background: '#fff',
                          border: isOpen ? '1px solid var(--green-200)' : '1px solid var(--slate-200)',
                          boxShadow: isOpen ? '0 4px 16px rgba(22,163,74,0.1)' : 'var(--shadow-sm)',
                          transition: 'border-color 0.2s, box-shadow 0.2s',
                        }}>
              <button onClick={() => setAberta(isOpen ? null : u.id)}
                      className="w-full text-left p-5 flex items-center justify-between transition-all"
                      style={{ background: isOpen ? 'var(--green-50)' : '#fff' }}>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                       style={{
                         background: isOpen
                           ? 'linear-gradient(135deg, var(--green-500), var(--green-700))'
                           : 'var(--slate-100)',
                       }}>
                    🏢
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--slate-900)' }}>{u.nome}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--slate-400)' }}>
                      {u.cidade}, {u.estado} · {u.endereco}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
                    {docas.length} docas
                  </span>
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all"
                        style={{
                          background: isOpen ? 'var(--green-100)' : 'var(--slate-100)',
                          color: isOpen ? 'var(--green-700)' : 'var(--slate-400)',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}>
                    ▾
                  </span>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                              style={{ overflow: 'hidden' }}>
                    <div className="px-5 pb-5 pt-2" style={{ borderTop: '1px solid var(--green-100)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--slate-400)' }}>
                          Docas
                        </span>
                        <button className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
                                style={{ color: 'var(--green-600)', background: 'var(--green-50)', border: '1px solid var(--green-100)' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--green-100)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'var(--green-50)')}>
                          + Adicionar doca
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {docas.map(d => (
                          <div key={d.id} className="flex items-center justify-between p-3.5 rounded-xl"
                               style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-100)' }}>
                            <div>
                              <div className="text-xs font-semibold" style={{ color: 'var(--slate-800)' }}>{d.nome}</div>
                              <div className="text-xs mt-0.5" style={{ color: 'var(--slate-400)' }}>
                                {d.capacidadeTonHora}t/h · {d.tipoCarga}
                              </div>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                                  style={{
                                    background: d.ativa ? '#f0fdf4' : '#f8fafc',
                                    color: d.ativa ? '#15803d' : '#94a3b8',
                                    border: `1px solid ${d.ativa ? '#bbf7d0' : '#e2e8f0'}`,
                                  }}>
                              {d.ativa ? 'Ativa' : 'Inativa'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
