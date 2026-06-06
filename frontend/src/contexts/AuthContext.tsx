import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { TipoUsuario } from '../types'
import { loginEmpresa as apiLoginEmpresa, loginMotorista as apiLoginMotorista, registerEmpresa as apiRegisterEmpresa, getMe, type RegisterEmpresaDto } from '../lib/auth'
import { clearToken, getSavedToken, getSavedTipo } from '../lib/api'

interface UsuarioLogado {
  id: string
  nome: string
  email?: string
  papel?: string
  empresaId?: string
  telefone?: string
  scorePontualidade?: number
}

interface AuthState {
  tipo: TipoUsuario | null
  usuario: UsuarioLogado | null
  hydrated: boolean
}

interface AuthContextType extends AuthState {
  loginEmpresa: (email: string, senha: string) => Promise<void>
  loginMotorista: (telefone: string, placa: string) => Promise<void>
  registerEmpresa: (dto: RegisterEmpresaDto) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    tipo: null,
    usuario: null,
    hydrated: false,
  })

  // Hidrata sessão ao montar (token salvo no localStorage)
  useEffect(() => {
    const token = getSavedToken()
    const tipo = getSavedTipo()
    if (!token || !tipo) {
      setState(s => ({ ...s, hydrated: true }))
      return
    }
    getMe()
      .then(me => setState({ tipo, usuario: me, hydrated: true }))
      .catch(() => {
        clearToken()
        setState({ tipo: null, usuario: null, hydrated: true })
      })
  }, [])

  async function loginEmpresa(email: string, senha: string) {
    await apiLoginEmpresa({ email, senha })
    const me = await getMe()
    setState({ tipo: 'empresa', usuario: me, hydrated: true })
  }

  async function loginMotorista(telefone: string, placa: string) {
    await apiLoginMotorista({ telefone, placa })
    const me = await getMe()
    setState({ tipo: 'motorista', usuario: me, hydrated: true })
  }

  async function registerEmpresa(dto: RegisterEmpresaDto) {
    await apiRegisterEmpresa(dto)
    const me = await getMe()
    setState({ tipo: 'empresa', usuario: me, hydrated: true })
  }

  function logout() {
    clearToken()
    setState({ tipo: null, usuario: null, hydrated: true })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginEmpresa,
        loginMotorista,
        registerEmpresa,
        logout,
        isAuthenticated: state.tipo !== null,
      }}
    >
      {/* Aguarda hidratação antes de renderizar para evitar flash de redirecionamento */}
      {state.hydrated ? children : null}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
