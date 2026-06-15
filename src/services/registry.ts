/**
 * ServiceRegistry
 *
 * Satu tempat untuk resolve service yang dipakai — Mock atau Production.
 * Keputusan diambil berdasarkan config dari SDK init(), bukan dari .env.
 *
 * Cara kerja:
 * - Kalau endpoint tersedia di config.api → pakai Production service
 * - Kalau tidak ada → pakai Mock service (development / demo)
 *
 * Hooks (useChat, useRecorder, dll) TIDAK boleh import service langsung.
 * Mereka harus pakai getXxxService() dari sini.
 */

import type { SDKApiConfig } from '@/types'

import type { AIService } from './ai/AIService'
import type { STTService } from './stt/STTService'
import type { SOAPService } from './soap/SOAPService'
import type { ClinicalPathwayService } from './clinical-pathway/ClinicalPathwayService'
import type { EClaimService } from './eclaim/EClaimService'

import { MockAIService } from './ai/MockAIService'
import { MockSTTService } from './stt/MockSTTService'
import { MockSOAPService } from './soap/MockSOAPService'
import { MockClinicalPathwayService } from './clinical-pathway/MockClinicalPathwayService'
import { MockEClaimService } from './eclaim/MockEClaimService'

import { ProductionAIService } from './ai/ProductionAIService'
import { ProductionSTTService } from './stt/ProductionSTTService'
import { ProductionSOAPService } from './soap/ProductionSOAPService'
import { ProductionClinicalPathwayService } from './clinical-pathway/ProductionClinicalPathwayService'
import { ProductionEClaimService } from './eclaim/ProductionEClaimService'

// Ambil config dari SDK saat runtime
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

export function getSTTService(): STTService {
  const cfg = getApiConfig()
  return cfg.sttEndpoint
    ? new ProductionSTTService(cfg)
    : new MockSTTService()
}

export function getSOAPService(): SOAPService {
  const cfg = getApiConfig()
  return cfg.soapEndpoint
    ? new ProductionSOAPService(cfg)
    : new MockSOAPService()
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
