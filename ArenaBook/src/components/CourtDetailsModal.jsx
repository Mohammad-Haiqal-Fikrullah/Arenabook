// CourtDetailsModal.jsx — Modal detail dan fasilitas lapangan
// Menampilkan spesifikasi lapangan, fasilitas, dan tata tertib.
// Info yang belum dikonfirmasi ditampilkan sebagai placeholder.

import { X, Clock3, Users, AlertCircle, Calendar, MapPin } from 'lucide-react'
import { money } from '../data/mockData'

export default function CourtDetailsModal({ court, isOpen, onClose, onBookCourt }) {
  if (!isOpen || !court) return null

  const isFutsal = court.type === 'Futsal'

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-box modal-box-lg" onClick={e => e.stopPropagation()}>
        {/* Header dengan ilustrasi */}
        <div
          style={{
            height: 180,
            background: isFutsal ? 'var(--futsal)' : 'var(--badminton)',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
          }}
        >
          {/* Ilustrasi SVG ringan */}
          <svg
            viewBox="0 0 500 180"
            style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            {isFutsal ? (
              <>
                <rect x="30" y="20" width="440" height="140" fill="none" stroke="white" strokeWidth="2.5" strokeOpacity="0.5" />
                <line x1="250" y1="20" x2="250" y2="160" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
                <circle cx="250" cy="90" r="45" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
                <rect x="30" y="55" width="60" height="70" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
                <rect x="410" y="55" width="60" height="70" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
              </>
            ) : (
              <>
                <rect x="40" y="15" width="420" height="150" fill="none" stroke="white" strokeWidth="2.5" strokeOpacity="0.5" />
                <line x1="250" y1="15" x2="250" y2="165" stroke="white" strokeWidth="2.5" strokeOpacity="0.8" />
                <line x1="120" y1="15" x2="120" y2="165" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
                <line x1="380" y1="15" x2="380" y2="165" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
                <line x1="40" y1="45" x2="120" y2="45" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
                <line x1="380" y1="45" x2="460" y2="45" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
                <line x1="40" y1="135" x2="120" y2="135" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
                <line x1="380" y1="135" x2="460" y2="135" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
              </>
            )}
          </svg>

          {/* Chip + tombol tutup */}
          <div style={{ position: 'absolute', top: 14, left: 20, right: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <span style={{
              background: 'rgba(255,255,255,0.2)', color: 'white',
              fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              {court.type} · {court.id}
            </span>
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Tutup"
              style={{ background: 'rgba(0,0,0,0.3)' }}
            >
              <X size={16} color="white" />
            </button>
          </div>

          {/* Nama lapangan */}
          <div style={{
            position: 'absolute', bottom: 16, left: 20,
            color: 'white'
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>{court.name}</div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
              <MapPin size={12} /> Arena Panggulaan
            </div>
          </div>
        </div>

        {/* Konten */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Spesifikasi cepat */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
            background: 'var(--bg)', borderRadius: 'var(--radius-md)', padding: '14px 16px',
            border: '1px solid var(--border)'
          }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginBottom: 3 }}>Tarif</div>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--cta)' }}>{money(court.price)}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>per jam</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginBottom: 3 }}>Kapasitas</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>{court.capacity}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginBottom: 3 }}>Jam Buka</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>08.00–22.00</div>
              <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>setiap hari</div>
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Deskripsi
            </div>
            <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.65 }}>{court.description}</p>
          </div>

          {/* Lantai */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Spesifikasi
            </div>
            <div style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '10px 14px',
              fontSize: 13, color: 'var(--ink)'
            }}>
              <span style={{ color: 'var(--ink-muted)' }}>Jenis lantai:</span>{' '}
              <strong>{court.surface}</strong>
            </div>
          </div>

          {/* Fasilitas */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Fasilitas
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(court.facilities || []).map((fac, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink)' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: isFutsal ? 'var(--futsal)' : 'var(--badminton)', flexShrink: 0 }} />
                  {fac}
                </li>
              ))}
            </ul>
          </div>

          {/* Tata tertib */}
          {(court.rules || []).length > 0 && (
            <div style={{
              background: 'var(--status-menunggu-bg)', border: '1px solid #FDE68A',
              borderRadius: 'var(--radius-md)', padding: '12px 16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 700, color: 'var(--status-menunggu-ink)', marginBottom: 8 }}>
                <AlertCircle size={14} /> Tata Tertib
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                {court.rules.map((rule, idx) => (
                  <li key={idx} style={{ fontSize: 13, color: 'var(--status-menunggu-ink)', display: 'flex', gap: 8 }}>
                    <span style={{ fontWeight: 700 }}>•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Tutup</button>
          <button
            className="btn btn-primary"
            disabled={court.status === 'Pemeliharaan'}
            onClick={() => { onClose(); onBookCourt(court) }}
          >
            <Calendar size={16} /> Pilih Jadwal
          </button>
        </div>
      </div>
    </div>
  )
}
