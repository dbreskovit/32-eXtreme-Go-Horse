import axios from 'axios'
import { USE_MOCK } from '../mocks/config'
import { mockAdapter } from '../mocks/adapter'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  // Modo apresentação: responde via localStorage, sem backend
  ...(USE_MOCK ? { adapter: mockAdapter } : {}),
})

if (USE_MOCK) {
  // eslint-disable-next-line no-console
  console.info('%c[FluxoGrão] Modo MOCK ativo — dados em localStorage (sem backend).', 'color:#16a34a;font-weight:bold')
}

// Injeta JWT em todas as requisições autenticadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fg_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Em 401 → limpa sessão e redireciona para login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fg_token')
      localStorage.removeItem('fg_tipo')
      // Redireciona sem recarregar React Router
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  },
)

export function setToken(token: string, tipo: 'empresa' | 'motorista') {
  localStorage.setItem('fg_token', token)
  localStorage.setItem('fg_tipo', tipo)
}

export function clearToken() {
  localStorage.removeItem('fg_token')
  localStorage.removeItem('fg_tipo')
}

export function getSavedToken(): string | null {
  return localStorage.getItem('fg_token')
}

export function getSavedTipo(): 'empresa' | 'motorista' | null {
  return localStorage.getItem('fg_tipo') as 'empresa' | 'motorista' | null
}
