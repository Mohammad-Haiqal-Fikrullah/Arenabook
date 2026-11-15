// BookingModal.jsx — Form pemesanan lapangan
// Alur: pilih tanggal → pilih jam → pilih durasi → data pemesan → metode bayar
// Cek bentrok jadwal sebelum mengirim ke payment gateway.
// Total biaya dihitung dari tarifPerJam × durasi.

import { useState, useEffect, useMemo } from 'react'
import {
  X, Calendar, Clock, CreditCard, AlertTriangle,
  ArrowRight, User, Phone, Check
} from 'lucide-react'
import { timeSlots, paymentMethods, money } from '../data/mockData'

export default function BookingModal({
  court,
  isOpen,
  onClose,
  onCreateBooking,
  initialDate,
  initialTime,
  existingBookings,
  currentUser
}) {
  const todayStr = new Date().toISOString().split('T')[0]

  const [date, setDate] = useState(initialDate || todayStr)
  const [time, setTime] = useState(initialTime || '')
  const [duration, setDuration] = useState(1)
  const [method, setMethod] = useState('QRIS')
  const [customerName, setCustomerName] = useState(currentUser?.name || '')
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '')
  const [collisionWarning, setCollisionWarning] = useState('')

  // Sinkronkan saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setDate(initialDate || todayStr)
      setTime(initialTime || '')
      setDuration(1)
      setMethod('QRIS')
      setCollisionWarning('')
      if (currentUser) {
        setCustomerName(currentUser.name)
        setCustomerPhone(currentUser.phone || '')
      }
    }
  }, [isOpen, initialDate, initialTime, currentUser])

  // Hitung slot yang sudah terisi untuk lapangan & tanggal ini
  const bookedSlots = useMemo(() => {
    if (!court || !date) return new Set()
    const booked = new Set()
    existingBookings
      .filter(b => b.court === court.name && b.date === date && b.status !== 'Dibatalkan')
      .forEach(b => {
        const startIdx = timeSlots.indexOf(b.time)
        if (startIdx !== -1) {
          for (let i = 0; i < (b.duration || 1); i++) {
            if (startIdx + i < timeSlots.length) booked.add(timeSlots[startIdx + i])
          }
        }
      })
    return booked
  }, [court, date, existingBookings])

  // Cek bentrok saat jam atau durasi berubah
  useEffect(() => {
    if (!time) { setCollisionWarning(''); return }
    const startIdx = timeSlots.indexOf(time)
    if (startIdx === -1) return
    const conflicts = []
    for (let i = 0; i < duration; i++) {
      const slot = timeSlots[startIdx + i]
      if (!slot) { conflicts.push(`Melebihi jam operasional (${duration} jam)`); break }
      if (bookedSlots.has(slot)) conflicts.push(slot)
    }
    setCollisionWarning(
      conflicts.length > 0
        ? `Slot sudah terisi: ${conflicts.join(', ')}. Kurangi durasi atau pilih jam lain.`
        : ''
    )
  }, [time, duration, bookedSlots])

  if (!isOpen || !court) return null

  // Hitung total biaya (tarifPerJam × durasi)
  const totalBiaya = court.price * duration

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!date || !time || collisionWarning) return

    // Hitung jam akhir
    const startIdx = timeSlots.indexOf(time)
    let endTime = ''
    if (startIdx !== -1 && startIdx + duration < timeSlots.length) {
      endTime = timeSlots[startIdx + duration]
    } else {
      const h = parseInt(time.split(':')[0])
      endTime = `${String(h + duration).padStart(2, '0')}:00`
    }

    // Generate nomor VA jika metode virtual account
    let vaNumber = null
    if (method.includes('BCA')) {
      vaNumber = `8808${customerPhone.replace(/\D/g, '').padEnd(12, '0').slice(0, 12)}`
    } else if (method.includes('Mandiri')) {
      vaNumber = `8902${customerPhone.replace(/\D/g, '').padEnd(12, '0').slice(0, 12)}`
    }

    onCreateBooking({
      court, date, time, endTime, duration,
      total: totalBiaya,
      method, vaNumber,
      customer: customerName,
      phone: customerPhone
    })
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="modal-title">Buat Pemesanan</div>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700, color: court.type === 'Futsal' ? 'var(--futsal)' : 'var(--badminton-ink)' }}>
                {court.name}
              </span>
              <span>·</span>
              <span>{money(court.price)}/jam</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Tutup form pemesanan">
            <X size={16} />
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }} noValidate>

          {/* Tanggal & Durasi */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="booking-date">
                <Calendar size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                Tanggal Bermain
              </label>
              <input
                id="booking-date"
                type="date"
                className="form-input"
                min={todayStr}
                value={date}
                onChange={e => { setDate(e.target.value); setTime('') }}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="booking-duration">
                <Clock size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                Durasi Sewa
              </label>
              <select
                id="booking-duration"
                className="form-input"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
              >
                <option value={1}>1 Jam</option>
                <option value={2}>2 Jam</option>
                <option value={3}>3 Jam</option>
              </select>
            </div>
          </div>

          {/* Pilih jam mulai */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                <Clock size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                Jam Mulai
              </label>
              <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                {time ? `Terpilih: ${time} (${duration} jam)` : 'Belum memilih jam'}
              </span>
            </div>
            <div className="slot-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))' }}>
              {timeSlots.map(slot => {
                const isTaken = bookedSlots.has(slot)
                const isSelected = time === slot
                const isPast = date === todayStr && parseInt(slot.split(':')[0]) < new Date().getHours()
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isTaken || isPast}
                    onClick={() => setTime(slot)}
                    className={`slot-btn${isSelected ? ' selected' : ''}${isTaken || isPast ? ' occupied' : ''}`}
                    aria-label={`Jam ${slot}, ${isTaken ? 'terisi' : isPast ? 'lewat' : 'tersedia'}`}
                    aria-pressed={isSelected}
                  >
                    <strong>{slot}</strong>
                    <div style={{ fontSize: 10, fontWeight: 400, marginTop: 2 }}>
                      {isTaken ? 'Terisi' : isPast ? 'Lewat' : 'Tersedia'}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Peringatan bentrok */}
          {collisionWarning && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              background: '#FEE2E2', border: '1px solid #FCA5A5',
              borderRadius: 'var(--radius-sm)', padding: '10px 12px',
              fontSize: 13, color: 'var(--status-batal-ink)'
            }}>
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <strong>Bentrok Jadwal!</strong>
                <div style={{ marginTop: 2 }}>{collisionWarning}</div>
              </div>
            </div>
          )}

          {/* Data pemesan */}
          <div style={{
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '14px 16px',
            display: 'flex', flexDirection: 'column', gap: 10
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Data Pemesan
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="booking-name">Nama</label>
                <div className="input-wrapper">
                  <span className="input-icon"><User size={16} /></span>
                  <input
                    id="booking-name"
                    type="text"
                    className="form-input"
                    placeholder="Nama pemesan"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    style={{ paddingLeft: 38, fontSize: 13 }}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="booking-phone">WhatsApp</label>
                <div className="input-wrapper">
                  <span className="input-icon"><Phone size={16} /></span>
                  <input
                    id="booking-phone"
                    type="tel"
                    className="form-input"
                    placeholder="08xx-xxxx-xxxx"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    style={{ paddingLeft: 38, fontSize: 13 }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Metode pembayaran */}
          <div>
            <label className="form-label" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
              <CreditCard size={14} /> Metode Pembayaran
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {paymentMethods.map(pm => {
                const isSelected = method === pm.id
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setMethod(pm.id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                      gap: 3, padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                      border: `1.5px solid ${isSelected ? 'var(--futsal)' : 'var(--border)'}`,
                      background: isSelected ? 'var(--futsal-soft)' : 'var(--surface)',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
                    }}
                    aria-pressed={isSelected}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: isSelected ? 'var(--futsal)' : 'var(--ink)' }}>
                        {pm.name}
                      </span>
                      {isSelected && <Check size={13} color="var(--futsal)" />}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--ink-muted)', lineHeight: 1.4 }}>{pm.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Ringkasan total biaya */}
          <div style={{
            background: 'var(--bg)', border: '2px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '14px 16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-muted)', marginBottom: 6 }}>
              <span>Tarif {money(court.price)} × {duration} jam</span>
              <span>{money(totalBiaya)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-muted)', marginBottom: 10 }}>
              <span>Biaya layanan</span>
              <span style={{ color: 'var(--badminton-ink)', fontWeight: 600 }}>Gratis</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderTop: '1px solid var(--border)', paddingTop: 10
            }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Total Pembayaran</span>
              <strong style={{ fontSize: 20, fontWeight: 800, color: 'var(--cta)' }}>{money(totalBiaya)}</strong>
            </div>
          </div>

          {/* Tombol lanjut */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={!time || !date || !!collisionWarning}
          >
            Lanjut ke Pembayaran <ArrowRight size={17} />
          </button>
        </form>
      </div>
    </div>
  )
}
