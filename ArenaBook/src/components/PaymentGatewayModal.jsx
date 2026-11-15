// PaymentGatewayModal.jsx — Simulasi Payment Gateway (Mode Demo)
// Pembayaran ini adalah SIMULASI front-end, tidak ada transaksi uang nyata.
// Tombol "Bayar Sekarang" mensimulasikan webhook sukses dari payment gateway.
// Tombol "Batalkan" mensimulasikan kegagalan pembayaran.

import { useState, useEffect } from 'react'
import {
  X, CheckCircle2, XCircle, Clock, Copy, Check,
  QrCode, ArrowRight, RefreshCw, Ticket, AlertCircle, CreditCard
} from 'lucide-react'
import { money, dateLabel } from '../data/mockData'

export default function PaymentGatewayModal({
  booking,
  isOpen,
  onClose,
  onSimulateSuccess,
  onSimulateFailure,
  onViewTicket
}) {
  const [copied, setCopied] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processType, setProcessType] = useState(null)
  // Countdown 15 menit (simulasi batas waktu pembayaran)
  const [timeLeft, setTimeLeft] = useState(15 * 60)

  useEffect(() => {
    if (!isOpen) return
    setTimeLeft(15 * 60) // reset setiap kali dibuka
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [isOpen])

  if (!isOpen || !booking) return null

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const countdown = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  const handleCopyVA = () => {
    const text = booking.vaNumber || '8808081234567890'
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simulasi proses pembayaran (delay 800ms untuk UX loading)
  const triggerSimulation = (type) => {
    setIsProcessing(true)
    setProcessType(type)
    setTimeout(() => {
      setIsProcessing(false)
      if (type === 'success') onSimulateSuccess(booking.id)
      else onSimulateFailure(booking.id)
    }, 800)
  }

  const isAlreadyPaid = booking.payment === 'Berhasil' || booking.status === 'Terkonfirmasi'
  const isFailed = booking.payment === 'Gagal' || booking.status === 'Dibatalkan'
  const isQRIS = booking.method === 'QRIS'
  const isVA = booking.method?.includes('Virtual Account')
  const isWallet = booking.method?.includes('GoPay') || booking.method?.includes('E-Wallet')

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>

        {/* Badge simulasi */}
        <div style={{
          background: 'var(--status-menunggu-bg)', borderBottom: '1px solid #FDE68A',
          padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: 'var(--status-menunggu-ink)' }}>
            <AlertCircle size={14} />
            MODE DEMO — Ini adalah simulasi pembayaran, tidak ada transaksi nyata
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Tutup" style={{ width: 24, height: 24 }}>
            <X size={14} />
          </button>
        </div>

        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="modal-title">Pembayaran Pemesanan</div>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2 }}>
              {booking.court} · {dateLabel(booking.date)} · Jam {booking.time} ({booking.duration} jam)
            </div>
          </div>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Jumlah tagihan */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'var(--bg)', border: '2px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '14px 18px'
          }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>Total Tagihan</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--cta)' }}>{money(booking.total)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>Kode Pemesanan</div>
              <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 14, color: 'var(--futsal)' }}>{booking.id}</div>
            </div>
          </div>

          {/* Countdown & kode VA */}
          {!isAlreadyPaid && !isFailed && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--futsal-soft)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
                <Clock size={16} color="var(--futsal)" />
                <span style={{ fontSize: 13, color: 'var(--futsal)', fontWeight: 600 }}>
                  Selesaikan pembayaran sebelum waktu habis:
                </span>
                <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontWeight: 800, fontSize: 15, color: timeLeft < 60 ? 'var(--status-batal-ink)' : 'var(--futsal)' }}>
                  {countdown}
                </span>
              </div>

              {/* Instruksi per metode */}
              {isQRIS && (
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 12 }}>
                    Scan QR Code berikut dari aplikasi e-wallet Anda
                  </div>
                  <div style={{
                    width: 140, height: 140, margin: '0 auto', border: '3px solid var(--ink)',
                    borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <QrCode size={110} color="var(--ink)" />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 8 }}>QRIS berlaku untuk GoPay, OVO, Dana, BCA, dll.</div>
                </div>
              )}

              {isVA && (
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
                  <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 6 }}>
                    {booking.method}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 10 }}>
                    Transfer ke nomor Virtual Account berikut:
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', padding: '10px 14px'
                  }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 15, letterSpacing: '0.08em', color: 'var(--ink)' }}>
                      {booking.vaNumber || '8808081234567890'}
                    </span>
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ gap: 5 }}
                      onClick={handleCopyVA}
                      aria-label="Salin nomor VA"
                    >
                      {copied ? <><Check size={13} /> Disalin</> : <><Copy size={13} /> Salin</>}
                    </button>
                  </div>
                </div>
              )}

              {isWallet && (
                <div style={{ textAlign: 'center', padding: '4px 0' }}>
                  <CreditCard size={36} style={{ display: 'block', margin: '0 auto 8px', color: 'var(--futsal)' }} />
                  <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
                    Buka aplikasi {booking.method} dan selesaikan pembayaran sebesar{' '}
                    <strong style={{ color: 'var(--ink)' }}>{money(booking.total)}</strong>
                  </div>
                </div>
              )}

              {/* Tombol simulasi */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={isProcessing}
                  onClick={() => triggerSimulation('success')}
                >
                  {isProcessing && processType === 'success'
                    ? <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Memproses...</>
                    : <><ArrowRight size={16} /> Bayar Sekarang (Simulasi Berhasil)</>
                  }
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', color: 'var(--status-batal-ink)', borderColor: '#FCA5A5' }}
                  disabled={isProcessing}
                  onClick={() => triggerSimulation('failure')}
                >
                  {isProcessing && processType === 'failure'
                    ? 'Memproses...'
                    : 'Batalkan Pembayaran'
                  }
                </button>
              </div>
            </>
          )}

          {/* Status: sudah berhasil */}
          {isAlreadyPaid && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <CheckCircle2 size={48} style={{ display: 'block', margin: '0 auto 12px', color: 'var(--badminton)' }} />
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--status-lunas-ink)', marginBottom: 6 }}>
                Pembayaran Berhasil!
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 16 }}>
                Pemesanan <strong>{booking.id}</strong> telah dikonfirmasi. E-tiket siap digunakan.
              </p>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => onViewTicket(booking)}
              >
                <Ticket size={16} /> Lihat E-Tiket
              </button>
            </div>
          )}

          {/* Status: gagal/dibatalkan */}
          {isFailed && !isAlreadyPaid && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <XCircle size={48} style={{ display: 'block', margin: '0 auto 12px', color: '#EF4444' }} />
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--status-batal-ink)', marginBottom: 6 }}>
                Pembayaran Gagal
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
                Pemesanan ini telah dibatalkan. Silakan buat pemesanan baru.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  )
}
