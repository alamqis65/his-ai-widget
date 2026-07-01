// ─── Service Types ────────────────────────────────────────────────────────────
// Shared wrapper type returned by every service (Mock and Production alike).
// See src/services/*/*.ts.

export interface ServiceResponse<T> {
  data: T
  ok: boolean
  error?: string
}
