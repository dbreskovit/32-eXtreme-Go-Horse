import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export interface SlotApi {
  horaInicio: string
  horaFim: string
  capacidadeDisponivel: number
  ocupado: boolean
}

/**
 * Busca slots disponíveis para uma doca em uma data.
 * @param docaId UUID da doca
 * @param data   string no formato YYYY-MM-DD
 */
export function useSlots(docaId: string | null, data: string | null) {
  const [slots, setSlots] = useState<SlotApi[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!docaId || !data) return
    let cancelled = false
    setLoading(true)
    setErro('')

    api.get<SlotApi[]>(`/slots?docaId=${docaId}&data=${data}`)
      .then(res => { if (!cancelled) setSlots(res.data) })
      .catch(() => { if (!cancelled) setErro('Erro ao carregar slots.') })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [docaId, data])

  return { slots, loading, erro }
}
