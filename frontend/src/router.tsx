import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LandingPage } from './pages/public/LandingPage'
import { LoginPage } from './pages/public/LoginPage'
import { RegisterPage } from './pages/public/RegisterPage'
import { SidebarLayout } from './components/SidebarLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DashboardPage } from './pages/painel/DashboardPage'
import { AgendamentosPage } from './pages/painel/AgendamentosPage'
import { GuaritaPage } from './pages/painel/GuaritaPage'
import { UnidadesPage } from './pages/painel/UnidadesPage'
import { AgendarPage } from './pages/motorista/AgendarPage'
import { MeusAgendamentosPage } from './pages/motorista/MeusAgendamentosPage'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/cadastro', element: <RegisterPage /> },

  {
    path: '/painel',
    element: (
      <ProtectedRoute tipo="empresa">
        <SidebarLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/painel/dashboard" replace /> },
      { path: 'dashboard',    element: <DashboardPage /> },
      { path: 'agendamentos', element: <AgendamentosPage /> },
      { path: 'guarita',      element: <GuaritaPage /> },
      { path: 'unidades',     element: <UnidadesPage /> },
    ],
  },

  {
    path: '/motorista',
    element: (
      <ProtectedRoute tipo="motorista">
        <Navigate to="/motorista/agendar" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: '/motorista/agendar',
    element: (
      <ProtectedRoute tipo="motorista">
        <AgendarPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/motorista/meus',
    element: (
      <ProtectedRoute tipo="motorista">
        <MeusAgendamentosPage />
      </ProtectedRoute>
    ),
  },

  { path: '*', element: <Navigate to="/" replace /> },
])
