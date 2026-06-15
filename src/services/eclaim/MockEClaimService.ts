import type { EClaimCheckResult, ServiceResponse } from '@/types'
import type { EClaimService } from './EClaimService'
import { delay } from '@/utils'

const MOCK_RESULTS: EClaimCheckResult[] = [
  {
    eligible: true,
    claimCode: 'INA-CBG-B-4-14-I',
    diagnosis: 'Demam Tifoid',
    icdCode: 'A01.0',
    estimatedCost: 3_500_000,
    coveredAmount: 3_500_000,
    notes: [
      'Pasien aktif BPJS Kesehatan kelas II',
      'Diagnosa termasuk dalam paket INA-CBGs',
      'Lama rawat sesuai clinical pathway ≤7 hari',
    ],
    checkedAt: new Date(),
  },
  {
    eligible: true,
    claimCode: 'INA-CBG-J-4-10-I',
    diagnosis: 'Pneumonia Komunitas',
    icdCode: 'J18.9',
    estimatedCost: 4_200_000,
    coveredAmount: 4_200_000,
    notes: [
      'Pasien aktif BPJS Kesehatan kelas I',
      'Klaim disetujui untuk rawat inap ≤5 hari',
      'Pastikan kelengkapan berkas: SEP, resume medis, hasil lab',
    ],
    checkedAt: new Date(),
  },
  {
    eligible: false,
    claimCode: '-',
    diagnosis: 'Pemeriksaan Umum',
    icdCode: 'Z00.0',
    estimatedCost: 0,
    coveredAmount: 0,
    notes: [
      'Kode ICD tidak termasuk dalam paket INA-CBGs rawat inap',
      'Rujuk ke poli rawat jalan',
      'Periksa kembali diagnosa utama',
    ],
    checkedAt: new Date(),
  },
]

/**
 * MockEClaimService — returns dummy claim check for development/demo.
 * Replace with ProductionEClaimService when BPJS/insurance API is ready.
 */
export class MockEClaimService implements EClaimService {
  async check(
    _patientId: string,
    icdCode: string,
    diagnosis: string
  ): Promise<ServiceResponse<EClaimCheckResult>> {
    await delay(1500 + Math.random() * 1000)

    const lower = diagnosis.toLowerCase()
    if (lower.includes('tifoid') || lower.includes('typhoid')) {
      return { data: { ...MOCK_RESULTS[0], checkedAt: new Date() }, ok: true }
    }
    if (lower.includes('pneumonia') || lower.includes('paru')) {
      return { data: { ...MOCK_RESULTS[1], checkedAt: new Date() }, ok: true }
    }
    if (icdCode.startsWith('Z')) {
      return { data: { ...MOCK_RESULTS[2], checkedAt: new Date() }, ok: true }
    }
    // Generic eligible result
    return {
      data: {
        eligible: true,
        claimCode: `INA-CBG-${icdCode.replace('.', '-')}`,
        diagnosis,
        icdCode,
        estimatedCost: 2_500_000,
        coveredAmount: 2_500_000,
        notes: [
          'Pasien aktif BPJS Kesehatan',
          'Diagnosa termasuk dalam tanggungan',
          'Lengkapi berkas administrasi sebelum submission',
        ],
        checkedAt: new Date(),
      },
      ok: true,
    }
  }
}
