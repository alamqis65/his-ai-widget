import { useState, useCallback } from 'preact/hooks'
import type { EClaimState, EClaimCheckResult } from '@/types'
import { MockEClaimService } from '@/services/eclaim/MockEClaimService'
import { IS_MOCK } from '@/utils'

// TODO: swap to ProductionEClaimService
const service = IS_MOCK ? new MockEClaimService() : new MockEClaimService()

interface UseEClaimReturn {
  state: EClaimState
  result: EClaimCheckResult | null
  error: string | null
  check: (patientId: string, icdCode: string, diagnosis: string) => Promise<void>
  reset: () => void
}

export function useEClaim(): UseEClaimReturn {
  const [state, setState] = useState<EClaimState>('IDLE')
  const [result, setResult] = useState<EClaimCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const check = useCallback(async (patientId: string, icdCode: string, diagnosis: string) => {
    setState('CHECKING')
    setError(null)

    const res = await service.check(patientId, icdCode, diagnosis)
    if (res.ok) {
      setResult(res.data)
      setState('DONE')
    } else {
      setError(res.error ?? 'Gagal memeriksa e-claim')
      setState('ERROR')
    }
  }, [])

  const reset = useCallback(() => {
    setState('IDLE')
    setResult(null)
    setError(null)
  }, [])

  return { state, result, error, check, reset }
}
