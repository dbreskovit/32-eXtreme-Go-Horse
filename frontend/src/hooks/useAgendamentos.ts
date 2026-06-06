import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import type { StatusAgendamento } from '../types'

export interface AgendamentoApi {
  id: string
  codigo: string
  status: StatusAgendamento
  dataHoraAgendada: string
  volumeTon: number
  doca: { id: string; nome: string; tipoCarga: string; capacidadeTonHora: number; unidadeId: string; ativa: boolean }
  motorista: { id: string; nome: string; telefone: string; cnh?: string; scorePontualidade?: number }
  veiculo: { id: string; placa: string; tipo: string; capacidadeTon: number }
  observacoes?: string
  qrCodeUrl?: string
  // compatibilidade com tipo local
  unidade?: { id: string; nome: string; cidade: string; estado: string; endereco: string; totalDocas: number }
}

interface PaginaAgendamentos {
  items: AgendamentoApi[]
  total: number
  page: number
  limit: number
}

interface FiltroAgendamentos {
  status?: string
  docaId?: string
  data?: string
  page?: number
  limit?: number
}

export function useAgendamentos(filtro?: FiltroAgendamentos) {
  const [data, setData] = useState<PaginaAgendamentos>({ items: [], total: 0, page: 1, limit: 20 })
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro('')
    try {
      const params = new URLSearchParams()
      if (filtro?.status) params.set('status', filtro.status)
      if (filtro?.docaId) params.set('docaId', filtro.docaId)
      if (filtro?.data) params.set('data', filtro.data)
      if (filtro?.page) params.set('page', String(filtro.page))
      if (filtro?.limit) params.set('limit', String(filtro.limit))

      const res = await api.get<PaginaAgendamentos>(`/agendamentos?${params}`)
      setData(res.data)
    } catch {
      setErro('Erro ao carregar agendamentos.')
    } finally {
      setLoading(false)
    }
  }, [filtro?.status, filtro?.docaId, filtro?.data, filtro?.page])

  useEffect(() => { carregar() }, [carregar])

  async function avancarStatus(id: string, acao: 'checkin' | 'descarregando' | 'finalizar' | 'cancelar') {
    await api.patch(`/agendamentos/${id}/${acao}`)
    await carregar()
  }

  async function buscarPorQr(codigo: string): Promise<AgendamentoApi | null> {
    try {
      const res = await api.get<AgendamentoApi>(`/agendamentos/qr/${codigo}`)
      return res.data
    } catch {
      return null
    }
  }

  return { ...data, loading, erro, recarregar: carregar, avancarStatus, buscarPorQr }
}

// Hook separado para agendamentos do motorista logado
export function useMeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoApi[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro('')
    try {
      const res = await api.get<AgendamentoApi[]>('/agendamentos/me')
      setAgendamentos(res.data)
    } catch {
      setErro('Erro ao carregar seus agendamentos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  async function cancelar(id: string) {
    await api.patch(`/agendamentos/${id}/cancelar`)
    await carregar()
  }

  return { agendamentos, loading, erro, recarregar: carregar, cancelar }
}
