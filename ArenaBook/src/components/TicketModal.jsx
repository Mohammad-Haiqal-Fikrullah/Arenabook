// TicketModal.jsx — E-Tiket digital ArenaBook
// Hanya tampil untuk pemesanan yang sudah berstatus Terkonfirmasi / Lunas.
// Menyediakan tombol Cetak (window.print()).

import { X, Printer, QrCode, Calendar, Clock, MapPin, User, Check } from 'lucide-react'
import { money, dateLabel } from '../data/mockData'

export default function TicketModal({ booking, isOpen, onClose }) {
  if (!isOpen || !booking) return null

  const isFutsal = booking.type === 'Futsal'

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        {/* Header tiket berwarna */}
        <div style={{
          background: isFutsal ? 'var(--futsal)' : 'var(--badminton)',
          padding: '20px 24px 16px',
          position: 'relative',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
        }}>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Tutup e-tiket"
            style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(0,0,0,0.25)' }}
          >
            <X size={16} color="white" />
          </button>

          {/* Badge lunas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{
              background: 'rgba(255,255,255,0.2)', color: 'white',
              fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 99,
              textTransform: 'uppercase', letterSpacing: '0.08em'
            }}>
              E-Tiket
            </span>
            <span style={{
              background: 'var(--status-lunas-bg)', color: 'var(--status-lunas-ink)',
              fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 99
            }}>
              <Check size={10} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
              Lunas &amp; Terkonfirmasi
            </span>
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 4 }}>
            {booking.court}
          </h3>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <MapPin size={12} /> Arena Panggulaan
          </p>
        </div>

        {/* Perforasi tiket */}
        <div style={{
          display: 'flex', alignItems: 'center',
          background: 'var(--bg)', padding: '0 0'
        }}>
          <div style={{ width: 20, height: 20, background: 'white', borderRadius: '50%', marginLeft: -10, border: '1px solid var(--border)' }} />
          <div style={{ flex: 1, borderBottom: '2px dashed var(--border)', margin: '0 8px' }} />
          <div style={{ width: 20, height: 20, background: 'white', borderRadius: '50%', marginRight: -10, border: '1px solid var(--border)' }} />
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--bg)' }}>
          {/* Info pemesanan */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '14px'
          }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Kode Pemesanan</div>
              <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 14, color: isFutsal ? 'var(--futsal)' : 'var(--badminton-ink)' }}>{booking.id}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Nama Pemesan</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{booking.customer}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Tanggal</div>
              <div style={{ fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Calendar size={12} /> {dateLabel(booking.date)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Jam &amp; Durasi</div>
              <div style={{ fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Clock size={12} /> {booking.time} ({booking.duration} jam)
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Jenis Lapangan</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{booking.type}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Metode Bayar</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{booking.method || 'QRIS'}</div>
            </div>
          </div>

          {/* QR Code check-in */}
          <div style={{
            background: 'white', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 11, color: 'var(--ink-muted)', fontWeight: 600, marginBottom: 10 }}>
              Scan untuk Check-in di Lokasi
            </div>
            <div style={{
              width: 110, height: 110, margin: '0 auto',
              border: '2px solid var(--ink)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              borderRadius: 8
            }}>
              <QrCode size={90} color="var(--ink)" />
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--ink-muted)', marginTop: 8 }}>
              REF: {booking.id}-PASS
            </div>
          </div>

          {/* Total */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'var(--status-lunas-bg)', border: '1px solid #86EFAC',
            borderRadius: 'var(--radius-md)', padding: '12px 16px'
          }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--status-lunas-ink)', fontWeight: 600 }}>Total Biaya</div>
              <div style={{ fontSize: 11, color: 'var(--status-lunas-ink)', opacity: 0.7 }}>Sudah Lunas</div>
            </div>
            <strong style={{ fontSize: 18, fontWeight: 800, color: 'var(--status-lunas-ink)' }}>
              {money(booking.total)}
            </strong>
          </div>

          <p style={{ fontSize: 11, color: 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.6 }}>
            Tunjukkan e-tiket ini kepada petugas sebelum memasuki lapangan. Datang 10 menit lebih awal.
          </p>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ background: 'var(--bg)' }}>
          <button className="btn btn-outline" onClick={onClose}>Tutup</button>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={16} /> Cetak E-Tiket
          </button>
        </div>
      </div>
    </div>
  )
}
