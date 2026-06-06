import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const NAV_ITEMS = [
  { to: '/painel/dashboard',    icon: '📊', label: 'Dashboard' },
  { to: '/painel/agendamentos', icon: '📋', label: 'Agendamentos' },
  { to: '/painel/guarita',      icon: '🚛', label: 'Guarita' },
  { to: '/painel/unidades',     icon: '🏢', label: 'Unidades' },
]

export function SidebarLayout() {
  const { usuario, logout } = useAuth()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-green-800 text-white flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-green-700">
          <div className="text-xl font-bold tracking-tight">🌾 FluxoGrão</div>
          <div className="text-green-300 text-xs mt-1 truncate">
            {usuario?.nome ?? 'Operador'}
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-600 text-white'
                    : 'text-green-100 hover:bg-green-700'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-green-700">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-green-200 hover:bg-green-700 transition-colors"
          >
            <span>🚪</span> Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
