import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { TipoUsuario } from '../types'

interface Props {
  tipo: TipoUsuario
  children: React.ReactNode
}

export function ProtectedRoute({ tipo, children }: Props) {
  const { isAuthenticated, tipo: tipoLogado } = useAuth()

  if (!isAuthenticated || tipoLogado !== tipo) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
