import { createContext, useContext, useState, type ReactNode } from 'react'
import type { UsuarioEmpresa, Motorista, TipoUsuario } from '../types'
import { USUARIO_LOGADO, MOTORISTA_LOGADO } from '../mocks/data'

interface AuthState {
  tipo: TipoUsuario | null
  usuario: UsuarioEmpresa | null
  motorista: Motorista | null
}

interface AuthContextType extends AuthState {
  loginEmpresa: (email: string, senha: string) => Promise<void>
  loginMotorista: (telefone: string, placa: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    tipo: null,
    usuario: null,
    motorista: null,
  })

  async function loginEmpresa(_email: string, _senha: string) {
    // Mock: aceita qualquer credencial
    await new Promise(r => setTimeout(r, 600))
    setState({ tipo: 'empresa', usuario: USUARIO_LOGADO, motorista: null })
  }

  async function loginMotorista(_telefone: string, _placa: string) {
    // Mock: aceita qualquer credencial
    await new Promise(r => setTimeout(r, 600))
    setState({ tipo: 'motorista', usuario: null, motorista: MOTORISTA_LOGADO })
  }

  function logout() {
    setState({ tipo: null, usuario: null, motorista: null })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginEmpresa,
        loginMotorista,
        logout,
        isAuthenticated: state.tipo !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
