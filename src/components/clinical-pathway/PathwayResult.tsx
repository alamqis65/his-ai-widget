import { useState } from 'preact/hooks'
import type { ClinicalPathwayResult, AssessmentItem } from '@/types'

interface PathwayResultProps {
  result: ClinicalPathwayResult
  onReset: () => void
  onSave: () => void
}

/** Warna dan teks deskripsi untuk setiap status zona */
const ZONA_CONFIG: Record<string, { color: string; label: string; description: string }> = {
  ZONA_HIJAU: {
    color: '#16a34a',
    label: '● Zona Hijau',
    description: 'Durasi perawatan sesuai standar rata-rata RS. Tidak ada pemotongan atau penyesuaian.',
  },
  ZONA_KUNING: {
    color: '#d97706',
    label: '● Zona Kuning',
    description:
      'Durasi perawatan sedikit melebihi rata-rata historis (ALOS). Hari ekstra dialokasikan untuk observasi pemulihan dan persiapan kepulangan.',
  },
  ZONA_MERAH: {
    color: '#dc2626',
    label: '● Zona Merah',
    description:
      'Durasi perawatan sangat melebihi batas ALOS RS. Sistem telah memotong paksa durasi agar sesuai standar dan menghindari risiko klaim BPJS.',
  },
}

/** Label & ikon untuk setiap kategori penunjang */
const CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  LABORATORIUM: { label: 'Laboratorium', icon: '🧪', color: '#7c3aed' },
  'PEMERIKSAAN KLINIS': { label: 'Pemeriksaan Klinis', icon: '🩺', color: '#0891b2' },
  RADIOLOGI: { label: 'Radiologi', icon: '📷', color: '#be185d' },
  REHABILITASI: { label: 'Rehabilitasi', icon: '🏃', color: '#059669' },
}

function groupAssessments(items: AssessmentItem[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {}
  for (const item of items) {
    const cat = item.category || 'LABORATORIUM'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(item.name)
  }
  return groups
}

export function PathwayResult({ result, onReset, onSave }: PathwayResultProps) {
  const [hoveredZona, setHoveredZona] = useState(false)
  const zona = ZONA_CONFIG[result.metadata?.statusZona] || ZONA_CONFIG.ZONA_HIJAU
  const notifikasi = result.metadata?.notifikasi

  return (
    <div class="feature-result">
      {/* ── Header: Zona Badge + Diagnosis ───────── */}
      <div class="feature-result-header">
        <div class="pathway-header-top">
          <div class="result-badge result-badge--green">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Pathway Selesai
          </div>
          <div
            class="pathway-zona-badge"
            style={{ color: zona.color, borderColor: zona.color }}
            onMouseEnter={() => setHoveredZona(true)}
            onMouseLeave={() => setHoveredZona(false)}
          >
            {zona.label}
            {hoveredZona && (
              <div class="pathway-zona-tooltip">
                {zona.description}
              </div>
            )}
          </div>
        </div>
        <p class="result-meta">
          {result.totalDays} hari · {result.diagnosis} · {result.metadata?.tipeKunjungan}
        </p>
      </div>

      {/* ── Notifikasi UI (ALOS/IGD warning) ───── */}
      {notifikasi && (
        <div class={`pathway-notifikasi pathway-notifikasi--${notifikasi.tipeAlert}`}>
          <span class="pathway-notifikasi-icon">
            {notifikasi.tipeAlert === 'error' ? '🚨' : notifikasi.tipeAlert === 'warning' ? '⚠️' : 'ℹ️'}
          </span>
          <span>{notifikasi.pesan}</span>
        </div>
      )}

      {/* ── Steps ────────────────────────────────── */}
      <div class="pathway-steps">
        {result.steps.map((step, i) => (
          <div key={i} class="pathway-step">
            <div class="pathway-step-day">{step.day}</div>
            <div class="pathway-step-body">
              {step.activities.length > 0 && (
                <div class="pathway-group">
                  <p class="pathway-group-label">Aktivitas</p>
                  {step.activities.map((a, j) => (
                    <p key={j} class="pathway-item">
                      · {a}
                    </p>
                  ))}
                </div>
              )}
              {step.medications && step.medications.length > 0 && (
                <div class="pathway-group">
                  <p class="pathway-group-label pathway-group-label--blue">Obat</p>
                  {step.medications.map((m, j) => (
                    <p key={j} class="pathway-item">
                      · {m}
                    </p>
                  ))}
                </div>
              )}
              {step.assessments && step.assessments.length > 0 && (() => {
                const grouped = groupAssessments(step.assessments)
                return Object.entries(grouped).map(([cat, items]) => {
                  const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.LABORATORIUM
                  return (
                    <div key={cat} class="pathway-group">
                      <p class="pathway-group-label" style={{ color: cfg.color }}>
                        {cfg.icon} {cfg.label}
                      </p>
                      {items.map((name, j) => (
                        <p key={j} class="pathway-item">
                          · {name}
                        </p>
                      ))}
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        ))}
      </div>

      {/* ── Saran Tindak Lanjut ──────────────────── */}
      {result.followUp && (
        <div class="pathway-followup">
          <div class="pathway-followup-header">
            <span class="pathway-followup-icon">📋</span>
            <span class="pathway-followup-title">Saran Tindak Lanjut</span>
          </div>
          <p class="pathway-followup-rekomendasi">{result.followUp.rekomendasi}</p>
          {result.followUp.pemeriksaanLanjut.length > 0 && (
            <div class="pathway-followup-exams">
              <p class="pathway-followup-exams-label">Pemeriksaan saat kontrol:</p>
              {result.followUp.pemeriksaanLanjut.map((p, i) => (
                <span key={i} class="pathway-followup-exam-tag">{p}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Actions ──────────────────────────────── */}
      <div class="feature-actions">
        <button class="btn btn-secondary btn-sm" onClick={onReset}>
          Buat Baru
        </button>
        <button class="btn btn-primary btn-primary-custom btn-sm" onClick={onSave}>
          Simpan ke HIS
        </button>
      </div>
    </div>
  )
}
