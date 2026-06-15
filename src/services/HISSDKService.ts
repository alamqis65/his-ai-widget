import type { HISAISDKOptions } from '@/types'

/**
 * HIS AI SDK — dummy implementation for standalone/demo mode.
 *
 * TODO (Production):
 * - Implement iframe embedding with postMessage communication
 * - Add origin validation for security
 * - Integrate JWT authentication and token refresh
 * - Add API Key management per hospital tenant
 * - Support multi-tenant configuration
 * - Add audit logging for all interactions
 * - Implement rate limiting
 * - Security hardening (CSP, XSS protection)
 *
 * @example
 * // Future SDK usage from HIS host:
 * window.HISAI.open({ context: { patientId: '123', visitId: 'V456' } })
 */

interface HISAISDKInstance {
  open(options?: HISAISDKOptions): void
  close(): void
  onSuccess(callback: (data: unknown) => void): void
  onError(callback: (error: Error) => void): void
  setContext(context: HISAISDKOptions['context']): void
}

class HISAISDKImpl implements HISAISDKInstance {
  private _onSuccess?: (data: unknown) => void
  private _onError?: (error: Error) => void
  private _context?: HISAISDKOptions['context']

  open(options?: HISAISDKOptions): void {
    if (options?.context) this._context = options.context
    if (options?.onSuccess) this._onSuccess = options.onSuccess
    if (options?.onError) this._onError = options.onError

    console.info('[HISAI SDK] Widget opened', { context: this._context })

    // TODO: In production, trigger widget mount / iframe show
    const event = new CustomEvent('hisai:open', { detail: this._context })
    window.dispatchEvent(event)
  }

  close(): void {
    console.info('[HISAI SDK] Widget closed')

    // TODO: In production, hide iframe / unmount widget
    const event = new CustomEvent('hisai:close')
    window.dispatchEvent(event)
  }

  onSuccess(callback: (data: unknown) => void): void {
    this._onSuccess = callback
  }

  onError(callback: (error: Error) => void): void {
    this._onError = callback
  }

  setContext(context: HISAISDKOptions['context']): void {
    this._context = context
    console.info('[HISAI SDK] Context updated', context)
  }

  /** @internal — called by widget to emit success back to HIS host */
  _emitSuccess(data: unknown): void {
    this._onSuccess?.(data)
    const event = new CustomEvent('hisai:success', { detail: data })
    window.dispatchEvent(event)
  }

  /** @internal — called by widget to emit error back to HIS host */
  _emitError(error: Error): void {
    this._onError?.(error)
    const event = new CustomEvent('hisai:error', { detail: error })
    window.dispatchEvent(event)
  }
}

// Expose on window for HIS host integration
const sdk = new HISAISDKImpl()

declare global {
  interface Window {
    HISAI: HISAISDKImpl
  }
}

window.HISAI = sdk

export { sdk as HISAI }
