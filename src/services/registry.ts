/**
 * ServiceRegistry
 *
 * Satu tempat untuk resolve service — Mock atau Production.
 * Keputusan berdasarkan config dari init(), bukan dari .env.
 *
 * Cara kerja:
 * - Kalau endpoint tersedia di config.api → pakai Production service
 * - Kalau tidak ada → pakai Mock service (development / demo)
 *
 * Hooks TIDAK boleh import service langsung — selalu lewat registry ini.
 */

import type { SDKApiConfig } from '@/types'

import type { AIService } from './ai/AIService'
import type { SpeechToSOAPService } from './speech-to-soap/SpeechToSOAPService'
import type { ClinicalPathwayService } from './clinical-pathway/ClinicalPathwayService'
import type { EClaimService } from './eclaim/EClaimService'

import { MockAIService } from './ai/MockAIService'
import { MockSpeechToSOAPService } from './speech-to-soap/MockSpeechToSOAPService'
import { MockClinicalPathwayService } from './clinical-pathway/MockClinicalPathwayService'
import { MockEClaimService } from './eclaim/MockEClaimService'

import { ProductionAIService } from './ai/ProductionAIService'
import { ProductionSpeechToSOAPService } from './speech-to-soap/ProductionSpeechToSOAPService'
import { ProductionClinicalPathwayService } from './clinical-pathway/ProductionClinicalPathwayService'
import { ProductionEClaimService } from './eclaim/ProductionEClaimService'

function getApiConfig(): SDKApiConfig {
  return (window as unknown as { his_ai_widget?: { _getConfig: () => { api?: SDKApiConfig } } })
    .his_ai_widget?._getConfig()?.api ?? {}
}

export function getAIService(): AIService {
  const cfg = getApiConfig()
  return cfg.chatEndpoint
    ? new ProductionAIService(cfg)
    : new MockAIService()
}

/**
 * SpeechToSOAP service — menggabungkan STT + SOAP generation.
 * Production: butuh sttEndpoint DAN soapEndpoint di init({ api: {...} })
 * Mock: aktif kalau salah satu atau keduanya tidak dikonfigurasi
 */
export function getSpeechToSOAPService(): SpeechToSOAPService {
  const cfg = getApiConfig()
  return cfg.soapGeneratorEndpoint
    ? new ProductionSpeechToSOAPService(cfg)
    : new MockSpeechToSOAPService()
}

export function getClinicalPathwayService(): ClinicalPathwayService {
  const cfg = getApiConfig()
  return cfg.pathwayEndpoint
    ? new ProductionClinicalPathwayService(cfg)
    : new MockClinicalPathwayService()
}

export function getEClaimService(): EClaimService {
  const cfg = getApiConfig()
  return cfg.eclaimEndpoint
    ? new ProductionEClaimService(cfg)
    : new MockEClaimService()
}
