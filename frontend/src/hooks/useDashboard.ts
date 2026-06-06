import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'

export interface DashboardHoje {
  totalAgendados: number
  emPatio: number
  descarregando: number
  concluidos: number
  cancelados: number
  proximasChegadas: any[]
}

export interface FluxoHora {
  hora: string
  total: number
  concluidos: number
}

export function useDashboard() {
  const [hoje, setHoje] = useState<DashboardHoje | null>(null)
  const [fluxo, setFluxo] = useState<FluxoHora[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro('')
    try {
      const [rHoje, rFluxo] = await Promise.all([
        api.get<DashboardHoje>('/dashboard/hoje'),
        api.get<FluxoHora[]>('/dashboard/fluxo-hora'),
      ])
      setHoje(rHoje.data)
      setFluxo(rFluxo.data)
    } catch {
      setErro('Erro ao carregar dashboard.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregar()
    // Polling a cada 30s para "ao vivo"
    const interval = setInterval(carregar, 30_000)
    return () => clearInterval(interval)
  }, [carregar])

  return { hoje, fluxo, loading, erro, recarregar: carregar }
}
