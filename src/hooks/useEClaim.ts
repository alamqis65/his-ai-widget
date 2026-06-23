import { useState, useCallback } from 'preact/hooks'
import type { EClaimState, EClaimCheckResult, SDKCallbacks } from '@/types'
import { getEClaimService } from '@/services/registry'

interface UseEClaimReturn {
  state: EClaimState
  result: EClaimCheckResult | null
  error: string | null
  check: (patientId: string, icdCode: string, diagnosis: string) => Promise<void>
  save: () => void
  reset: () => void
}

export function useEClaim(callbacks?: Pick<SDKCallbacks, 'onResultEClaim'>): UseEClaimReturn {
  const [state, setState] = useState<EClaimState>('IDLE')
  const [result, setResult] = useState<EClaimCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const check = useCallback(async (patientId: string, icdCode: string, diagnosis: string) => {
    setState('CHECKING')
    setError(null)

    const res = await getEClaimService().check(patientId, icdCode, diagnosis)
    if (res.ok) {
      setResult(res.data)
      setState('DONE')
    } else {
      setError(res.error ?? 'Gagal memeriksa e-claim')
      setState('ERROR')
    }
  }, [])

  const save = useCallback(() => {
    if (!result) return
    callbacks?.onResultEClaim?.(result)
    window.dispatchEvent(
      new CustomEvent('his_ai:result', {
        detail: { type: 'ECLAIM', data: result },
      }),
    )
  }, [result, callbacks])

  const reset = useCallback(() => {
    setState('IDLE')
    setResult(null)
    setError(null)
  }, [])

  return { state, result, error, check, save, reset }
}
