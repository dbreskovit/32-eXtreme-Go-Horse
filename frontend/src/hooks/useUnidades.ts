import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'

export interface DocaApi {
  id: string
  nome: string
  tipoCarga: string
  capacidadeTonHora: number
  ativa: boolean
}

export interface UnidadeApi {
  id: string
  nome: string
  cidade: string
  estado: string
  endereco: string
  totalDocas: number
  docas?: DocaApi[]
  // campo do backend (empresaAuthGuard)
  contagemDocas?: number
}

/**
 * Lista unidades da empresa autenticada (painel empresa)
 */
export function useUnidades() {
  const [unidades, setUnidades] = useState<UnidadeApi[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro('')
    try {
      const res = await api.get<UnidadeApi[]>('/unidades')
      // Normaliza totalDocas
      setUnidades(res.data.map(u => ({ ...u, totalDocas: u.contagemDocas ?? u.totalDocas ?? 0 })))
    } catch {
      setErro('Erro ao carregar unidades.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  return { unidades, loading, erro, recarregar: carregar }
}

/**
 * Lista unidades públicas com docas ativas (para motoristas)
 */
export function useUnidadesPublicas() {
  const [unidades, setUnidades] = useState<UnidadeApi[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api.get<UnidadeApi[]>('/unidades/publicas')
        if (!cancelled) setUnidades(res.data)
      } catch {
        if (!cancelled) setErro('Erro ao carregar unidades.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  return { unidades, loading, erro }
}

/**
 * Docas de uma unidade específica (para empresa — painel unidades)
 */
export function useDocas(unidadeId: string | null) {
  const [docas, setDocas] = useState<DocaApi[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!unidadeId) return
    setLoading(true)
    api.get<DocaApi[]>(`/unidades/${unidadeId}/docas`)
      .then(res => setDocas(res.data))
      .finally(() => setLoading(false))
  }, [unidadeId])

  return { docas, loading }
}
