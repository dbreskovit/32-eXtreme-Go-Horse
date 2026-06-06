import { api, setToken } from './api'

// ── Empresa ────────────────────────────────────────────────────────────────

export interface LoginEmpresaDto {
  email: string
  senha: string
}

export interface RegisterEmpresaDto {
  razaoSocial: string
  cnpj: string
  email: string
  telefone?: string
  nomeGerente: string
  senhaGerente: string
}

export interface LoginMotoristaDto {
  telefone: string
  placa: string
}

export interface AuthResponse {
  access_token: string
}

export async function loginEmpresa(dto: LoginEmpresaDto): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/empresa/login', dto)
  setToken(data.access_token, 'empresa')
  return data
}

export async function registerEmpresa(dto: RegisterEmpresaDto): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/empresa/register', {
    razaoSocial: dto.razaoSocial,
    cnpj: dto.cnpj,
    email: dto.email,
    telefone: dto.telefone ?? '(00) 0000-0000',
    nomeGerente: dto.nomeGerente ?? dto.email.split('@')[0],
    senhaGerente: dto.senhaGerente,
  })
  setToken(data.access_token, 'empresa')
  return data
}

export async function loginMotorista(dto: LoginMotoristaDto): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/motorista/login', dto)
  setToken(data.access_token, 'motorista')
  return data
}

export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data
}
