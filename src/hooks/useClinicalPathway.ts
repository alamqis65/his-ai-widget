import { useState, useCallback } from 'preact/hooks'
import type { ClinicalPathwayState, ClinicalPathwayResult, SDKCallbacks } from '@/types'
import { getClinicalPathwayService } from '@/services/registry'

interface UseClinicalPathwayReturn {
  state: ClinicalPathwayState
  result: ClinicalPathwayResult | null
  error: string | null
  generate: (diagnosis: string) => Promise<void>
  save: () => void
  reset: () => void
}

export function useClinicalPathway(callbacks?: Pick<SDKCallbacks, 'onResultPathway'>): UseClinicalPathwayReturn {
  const [state, setState] = useState<ClinicalPathwayState>('IDLE')
  const [result, setResult] = useState<ClinicalPathwayResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (diagnosis: string) => {
    if (!diagnosis.trim()) return
    setState('GENERATING')
    setError(null)

    const res = await getClinicalPathwayService().generate(diagnosis)
    if (res.ok) {
      setResult(res.data)
      setState('DONE')
    } else {
      setError(res.error ?? 'Gagal membuat clinical pathway')
      setState('ERROR')
    }
  }, [])

  const save = useCallback(() => {
    if (!result) return
    callbacks?.onResultPathway?.(result)
    window.dispatchEvent(
      new CustomEvent('his_ai:result', {
        detail: { type: 'CLINICAL_PATHWAY', data: result },
      }),
    )
  }, [result, callbacks])

  const reset = useCallback(() => {
    setState('IDLE')
    setResult(null)
    setError(null)
  }, [])

  return { state, result, error, generate, save, reset }
}
