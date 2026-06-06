import { NavLink, Outlet } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../contexts/AuthContext'

const NAV = [
  { to: '/painel/dashboard',    icon: '▦', label: 'Dashboard' },
  { to: '/painel/agendamentos', icon: '≡', label: 'Agendamentos' },
  { to: '/painel/guarita',      icon: '⬡', label: 'Guarita' },
  { to: '/painel/unidades',     icon: '◫', label: 'Unidades' },
]

export function SidebarLayout() {
  const { usuario, logout } = useAuth()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--slate-50)', fontFamily: 'var(--font-sans)' }}>

      {/* Sidebar */}
      <aside className="w-60 flex flex-col shrink-0"
             style={{ background: '#fff', borderRight: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>

        {/* Logo */}
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid var(--slate-100)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '-0.01em' }}>
            <span style={{ color: 'var(--green-600)' }}>Fluxo</span>
            <span style={{ color: 'var(--slate-900)' }}>Grão</span>
          </div>
          <div className="text-xs mt-1 truncate font-medium" style={{ color: 'var(--slate-400)' }}>
            {usuario?.nome}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to}
                     className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'active-nav' : ''}`}
                     style={({ isActive }) => ({
                       background: isActive
                         ? 'linear-gradient(135deg, var(--green-50) 0%, rgba(220,252,231,0.6) 100%)'
                         : 'transparent',
                       color: isActive ? 'var(--green-700)' : 'var(--slate-500)',
                       border: isActive ? '1px solid var(--green-100)' : '1px solid transparent',
                       fontWeight: isActive ? 600 : 500,
                     })}>
              <span className="text-base w-5 text-center" style={{ opacity: 0.85 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid var(--slate-100)' }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-xl"
               style={{ background: 'var(--slate-50)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                 style={{ background: 'linear-gradient(135deg, var(--green-500), var(--green-700))', color: '#fff' }}>
              {usuario?.nome?.charAt(0) ?? 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: 'var(--slate-800)' }}>{usuario?.nome}</div>
              <div className="text-xs truncate capitalize" style={{ color: 'var(--slate-400)' }}>{usuario?.papel}</div>
            </div>
          </div>
          <button onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{ color: 'var(--slate-500)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#dc2626'
                    e.currentTarget.style.background = 'rgba(220,38,38,0.05)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--slate-500)'
                    e.currentTarget.style.background = 'transparent'
                  }}>
            <span style={{ fontSize: '0.85rem' }}>↪</span> Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
