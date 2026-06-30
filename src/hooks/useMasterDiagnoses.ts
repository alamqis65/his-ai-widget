import { useState, useEffect } from 'preact/hooks'
import type { DiagnosisMaster } from '@/types'
import { getClinicalPathwayService } from '@/services/registry'

export function useMasterDiagnoses() {
  const [diagnoses, setDiagnoses] = useState<DiagnosisMaster[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const fetchDiagnoses = async () => {
      setLoading(true)
      const res = await getClinicalPathwayService().getMasterDiagnoses()
      if (isMounted) {
        if (res.ok && res.data) {
          setDiagnoses(res.data)
        } else {
          setError(res.error || 'Gagal memuat master diagnosa')
        }
        setLoading(false)
      }
    }
    fetchDiagnoses()

    return () => {
      isMounted = false
    }
  }, [])

  return { diagnoses, loading, error }
}
