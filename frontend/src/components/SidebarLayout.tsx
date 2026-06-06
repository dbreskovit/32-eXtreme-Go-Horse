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
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--cream)', fontFamily: 'var(--font-sans)' }}>
      {/* Sidebar */}
      <aside className="w-56 flex flex-col shrink-0" style={{ background: 'var(--earth)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Logo */}
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--harvest)' }}>FluxoGrão</div>
          <div className="text-xs mt-1 truncate" style={{ color: 'var(--bark)' }}>{usuario?.nome}</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to}
                     className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'active-nav' : ''}`}
                     style={({ isActive }) => ({
                       background: isActive ? 'rgba(245,158,11,0.12)' : 'transparent',
                       color: isActive ? 'var(--harvest)' : 'var(--bark)',
                     })}>
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                 style={{ background: 'var(--canopy)', color: 'var(--blade)' }}>
              {usuario?.nome?.charAt(0) ?? 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: 'var(--cream)' }}>{usuario?.nome}</div>
              <div className="text-xs truncate" style={{ color: 'var(--bark)' }}>{usuario?.papel}</div>
            </div>
          </div>
          <button onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
                  style={{ color: 'var(--bark)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fca5a5'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--bark)'; e.currentTarget.style.background = 'transparent' }}>
            <span>↪</span> Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
