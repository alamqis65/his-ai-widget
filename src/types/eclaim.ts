// ─── E-Claim Types ────────────────────────────────────────────────────────────

export type EClaimState = 'IDLE' | 'CHECKING' | 'DONE' | 'ERROR'

export interface EClaimCheckResult {
  eligible: boolean
  claimCode: string
  diagnosis: string
  icdCode: string
  estimatedCost: number
  coveredAmount: number
  notes: string[]
  checkedAt: Date
  errors?: string[]
  warnings?: string[]
  message?: string
}
