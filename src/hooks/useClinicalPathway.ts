import { useState, useCallback } from 'preact/hooks'
import type { ClinicalPathwayState, ClinicalPathwayResult } from '@/types'
import { MockClinicalPathwayService } from '@/services/clinical-pathway/MockClinicalPathwayService'
import { IS_MOCK } from '@/utils'

// TODO: swap to ProductionClinicalPathwayService
const service = IS_MOCK ? new MockClinicalPathwayService() : new MockClinicalPathwayService()

interface UseClinicalPathwayReturn {
  state: ClinicalPathwayState
  result: ClinicalPathwayResult | null
  error: string | null
  generate: (diagnosis: string) => Promise<void>
  reset: () => void
}

export function useClinicalPathway(): UseClinicalPathwayReturn {
  const [state, setState] = useState<ClinicalPathwayState>('IDLE')
  const [result, setResult] = useState<ClinicalPathwayResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (diagnosis: string) => {
    if (!diagnosis.trim()) return
    setState('GENERATING')
    setError(null)

    const res = await service.generate(diagnosis)
    if (res.ok) {
      setResult(res.data)
      setState('DONE')
    } else {
      setError(res.error ?? 'Gagal membuat clinical pathway')
      setState('ERROR')
    }
  }, [])

  const reset = useCallback(() => {
    setState('IDLE')
    setResult(null)
    setError(null)
  }, [])

  return { state, result, error, generate, reset }
}
