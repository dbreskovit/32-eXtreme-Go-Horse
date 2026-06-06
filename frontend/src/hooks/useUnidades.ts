import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'

export interface HorarioApi {
  id: string
  diaSemana: number
  horaInicio: string
  horaFim: string
  docaId: string
}

export interface DocaApi {
  id: string
  nome: string
  tipoCarga: string
  capacidadeTonHora: number
  ativa: boolean
  horarios?: HorarioApi[]
}

export interface UnidadeApi {
  id: string
  nome: string
  cidade: string
  estado: string
  endereco: string
  totalDocas: number
  docas?: DocaApi[]
  contagemDocas?: number
}

export function useUnidades() {
  const [unidades, setUnidades] = useState<UnidadeApi[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro('')
    try {
      const res = await api.get<UnidadeApi[]>('/unidades')
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

export function useDocas(unidadeId: string | null) {
  const [docas, setDocas] = useState<DocaApi[]>([])
  const [loading, setLoading] = useState(false)

  const carregar = useCallback(async () => {
    if (!unidadeId) return
    setLoading(true)
    try {
      const res = await api.get<DocaApi[]>(`/unidades/${unidadeId}/docas`)
      setDocas(res.data)
    } finally {
      setLoading(false)
    }
  }, [unidadeId])

  useEffect(() => { carregar() }, [carregar])

  return { docas, loading, recarregar: carregar }
}

export function useUnidadesMutations(recarregar: () => void) {
  const [salvando, setSalvando] = useState(false)

  async function criarUnidade(dto: { nome: string; cidade: string; estado: string; endereco: string }) {
    setSalvando(true)
    try {
      await api.post('/unidades', dto)
      recarregar()
    } finally {
      setSalvando(false)
    }
  }

  async function editarUnidade(id: string, dto: Partial<{ nome: string; cidade: string; estado: string; endereco: string }>) {
    setSalvando(true)
    try {
      await api.patch(`/unidades/${id}`, dto)
      recarregar()
    } finally {
      setSalvando(false)
    }
  }

  async function removerUnidade(id: string) {
    setSalvando(true)
    try {
      await api.delete(`/unidades/${id}`)
      recarregar()
    } finally {
      setSalvando(false)
    }
  }

  return { criarUnidade, editarUnidade, removerUnidade, salvando }
}

export function useDocasMutations(recarregar: () => void) {
  const [salvando, setSalvando] = useState(false)

  async function criarDoca(unidadeId: string, dto: { nome: string; tipoCarga: string; capacidadeTonHora: number }) {
    setSalvando(true)
    try {
      await api.post(`/unidades/${unidadeId}/docas`, dto)
      recarregar()
    } finally {
      setSalvando(false)
    }
  }

  async function editarDoca(id: string, dto: Partial<{ nome: string; tipoCarga: string; capacidadeTonHora: number; ativa: boolean }>) {
    setSalvando(true)
    try {
      await api.patch(`/docas/${id}`, dto)
      recarregar()
    } finally {
      setSalvando(false)
    }
  }

  async function removerDoca(id: string) {
    setSalvando(true)
    try {
      await api.delete(`/docas/${id}`)
      recarregar()
    } finally {
      setSalvando(false)
    }
  }

  async function salvarHorarios(docaId: string, horarios: Array<{ diaSemana: number; horaInicio: string; horaFim: string }>) {
    setSalvando(true)
    try {
      await api.put(`/docas/${docaId}/horarios`, { horarios })
      recarregar()
    } finally {
      setSalvando(false)
    }
  }

  return { criarDoca, editarDoca, removerDoca, salvarHorarios, salvando }
}
