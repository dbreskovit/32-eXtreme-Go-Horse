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
          <h1 className="font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--earth)', letterSpacing: '-0.02em' }}>
            Unidades e Docas
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--bark)' }}>{UNIDADES.length} unidades</p>
        </div>
        <button className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'var(--earth)', color: 'var(--cream)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--canopy)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--earth)')}>
          + Nova unidade
        </button>
      </motion.div>

      <div className="space-y-4">
        {UNIDADES.map((u: Unidade, i) => {
          const docas = DOCAS.filter(d => d.unidadeId === u.id)
          const isOpen = aberta === u.id

          return (
            <motion.div key={u.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="rounded-2xl overflow-hidden"
                        style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <button onClick={() => setAberta(isOpen ? null : u.id)}
                      className="w-full text-left p-5 flex items-center justify-between group transition-all"
                      style={{ background: isOpen ? 'var(--parchment)' : '#fff' }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                       style={{ background: 'var(--earth)', color: 'var(--harvest)' }}>
                    🏢
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--earth)' }}>{u.nome}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--bark)' }}>
                      {u.cidade}, {u.estado} · {u.endereco}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                    {docas.length} docas
                  </span>
                  <span className="text-xs transition-transform duration-200"
                        style={{ color: 'var(--bark)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>
                    ▾
                  </span>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                              style={{ overflow: 'hidden' }}>
                    <div className="px-5 pb-5 pt-2">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--bark)' }}>Docas</span>
                        <button className="text-xs font-semibold hover:underline" style={{ color: '#22c55e' }}>+ Adicionar doca</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {docas.map(d => (
                          <div key={d.id} className="flex items-center justify-between p-3 rounded-xl"
                               style={{ background: 'var(--parchment)' }}>
                            <div>
                              <div className="text-xs font-semibold" style={{ color: 'var(--earth)' }}>{d.nome}</div>
                              <div className="text-xs mt-0.5" style={{ color: 'var(--bark)' }}>{d.capacidadeTonHora}t/h · {d.tipoCarga}</div>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                  style={{ background: d.ativa ? 'rgba(34,197,94,0.1)' : 'rgba(0,0,0,0.06)', color: d.ativa ? '#22c55e' : 'var(--bark)' }}>
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
