// ReportsPanel.jsx — Laporan Transaksi & Pendapatan ArenaBook
// Fitur: filter tanggal & lapangan & status, ringkasan angka, tabel detail, Ekspor CSV.
// Semua angka dihitung dari data bookings (tidak hardcode).

import { useState, useMemo } from 'react'
import {
  CircleDollarSign, Check, Clock, X, Download, Printer,
  Filter, CalendarDays, Ticket, ChartNoAxesCombined
} from 'lucide-react'
import { money, dateLabel } from '../data/mockData'

// ---- Chip status (ikon + teks) ----
function StatusChip({ status }) {
  const normalize = s => {
    if (!s) return 'dibatalkan'
    const sl = s.toLowerCase()
    if (sl.includes('konfirmasi') || sl.includes('lunas') || sl.includes('berhasil')) return 'lunas'
    if (sl.includes('menunggu') || sl.includes('tertunda')) return 'menunggu'
    return 'dibatalkan'
  }
  const key = normalize(status)
  const config = {
    lunas: { cls: 'chip-status lunas', icon: <Check size={11} />, label: 'Lunas' },
    menunggu: { cls: 'chip-status menunggu', icon: <Clock size={11} />, label: 'Menunggu' },
    dibatalkan: { cls: 'chip-status dibatalkan', icon: <X size={11} />, label: 'Dibatalkan' }
  }
  const c = config[key] || config.dibatalkan
  return <span className={c.cls}>{c.icon}{c.label}</span>
}

export default function ReportsPanel({ bookings, courts }) {
  const todayStr = new Date().toISOString().split('T')[0]

  // Filter
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [filterCourt, setFilterCourt] = useState('Semua')
  const [filterStatus, setFilterStatus] = useState('Semua')

  // Filter bookings berdasarkan kriteria yang dipilih
  const filtered = useMemo(() => {
    return bookings.filter(b => {
      // Filter tanggal
      if (dateFrom && b.date < dateFrom) return false
      if (dateTo && b.date > dateTo) return false
      // Filter lapangan
      if (filterCourt !== 'Semua' && b.type !== filterCourt) return false
      // Filter status
      if (filterStatus === 'Lunas' && b.payment !== 'Berhasil' && b.status !== 'Terkonfirmasi') return false
      if (filterStatus === 'Menunggu Pembayaran' && b.status !== 'Menunggu Pembayaran') return false
      if (filterStatus === 'Dibatalkan' && b.status !== 'Dibatalkan') return false
      return true
    })
  }, [bookings, dateFrom, dateTo, filterCourt, filterStatus])

  // Hitung ringkasan
  const summary = useMemo(() => {
    const lunas = filtered.filter(b => b.payment === 'Berhasil' || b.status === 'Terkonfirmasi')
    const menunggu = filtered.filter(b => b.status === 'Menunggu Pembayaran')
    const dibatalkan = filtered.filter(b => b.status === 'Dibatalkan')
    const totalPendapatan = lunas.reduce((s, b) => s + b.total, 0)
    const futsalPendapatan = lunas.filter(b => b.type === 'Futsal').reduce((s, b) => s + b.total, 0)
    const badmintonPendapatan = lunas.filter(b => b.type === 'Badminton').reduce((s, b) => s + b.total, 0)
    return {
      total: filtered.length, lunas: lunas.length,
      menunggu: menunggu.length, dibatalkan: dibatalkan.length,
      totalPendapatan, futsalPendapatan, badmintonPendapatan
    }
  }, [filtered])

  // Ekspor CSV
  const handleExportCSV = () => {
    const header = 'Kode,Lapangan,Jenis,Tanggal,Jam,Durasi,Pemesan,Total,Metode,Status'
    const rows = filtered.map(b =>
      `${b.id},"${b.court}",${b.type},${b.date},${b.time},${b.duration} jam,"${b.customer}",${b.total},"${b.method || 'QRIS'}","${b.status}"`
    ).join('\n')
    const csv = '\uFEFF' + header + '\n' + rows // BOM untuk Excel
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `laporan-arenabook-${todayStr}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Judul */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Laporan Transaksi</h2>
          <p style={{ fontSize: 14, color: 'var(--ink-muted)' }}>
            Pendapatan dihitung hanya dari pemesanan yang berstatus Lunas.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
            <Printer size={14} /> Cetak
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportCSV}>
            <Download size={14} /> Ekspor CSV
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="card">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ gap: 4 }}>
            <label className="form-label" htmlFor="report-from">Dari Tanggal</label>
            <input
              id="report-from"
              type="date"
              className="form-input"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              style={{ width: 160 }}
            />
          </div>
          <div className="form-group" style={{ gap: 4 }}>
            <label className="form-label" htmlFor="report-to">Sampai Tanggal</label>
            <input
              id="report-to"
              type="date"
              className="form-input"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              style={{ width: 160 }}
            />
          </div>
          <div className="form-group" style={{ gap: 4 }}>
            <label className="form-label" htmlFor="report-court">Jenis Lapangan</label>
            <select
              id="report-court"
              className="form-input"
              value={filterCourt}
              onChange={e => setFilterCourt(e.target.value)}
              style={{ width: 150 }}
            >
              <option value="Semua">Semua</option>
              <option value="Futsal">Futsal</option>
              <option value="Badminton">Badminton</option>
            </select>
          </div>
          <div className="form-group" style={{ gap: 4 }}>
            <label className="form-label" htmlFor="report-status">Status</label>
            <select
              id="report-status"
              className="form-input"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{ width: 180 }}
            >
              <option value="Semua">Semua Status</option>
              <option value="Lunas">Lunas</option>
              <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => { setDateFrom(''); setDateTo(''); setFilterCourt('Semua'); setFilterStatus('Semua') }}
            style={{ marginBottom: 1 }}
          >
            Reset Filter
          </button>
        </div>
      </div>

      {/* Kartu ringkasan */}
      <div className="report-summary-grid">
        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'var(--futsal-soft)' }}>
            <Ticket size={18} color="var(--futsal)" />
          </div>
          <div>
            <div className="stat-label">Total Pemesanan</div>
            <div className="stat-value">{summary.total}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'var(--status-lunas-bg)' }}>
            <Check size={18} color="var(--status-lunas-ink)" />
          </div>
          <div>
            <div className="stat-label">Lunas</div>
            <div className="stat-value">{summary.lunas}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'var(--status-menunggu-bg)' }}>
            <Clock size={18} color="var(--status-menunggu-ink)" />
          </div>
          <div>
            <div className="stat-label">Menunggu</div>
            <div className="stat-value">{summary.menunggu}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: '#FEE2E2' }}>
            <X size={18} color="var(--status-batal-ink)" />
          </div>
          <div>
            <div className="stat-label">Dibatalkan</div>
            <div className="stat-value">{summary.dibatalkan}</div>
          </div>
        </div>
      </div>

      {/* Pendapatan per lapangan */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div className="card" style={{ borderLeft: '4px solid var(--futsal)' }}>
          <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 4 }}>Total Pendapatan</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--cta)' }}>{money(summary.totalPendapatan)}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>Hanya dari pemesanan lunas</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--futsal)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span className="chip-futsal" style={{ fontSize: 10, padding: '2px 8px' }}>Futsal</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--futsal)' }}>{money(summary.futsalPendapatan)}</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--badminton)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span className="chip-badminton" style={{ fontSize: 10, padding: '2px 8px' }}>Badminton</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--badminton-ink)' }}>{money(summary.badmintonPendapatan)}</div>
        </div>
      </div>

      {/* Tabel detail */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Detail Transaksi ({filtered.length})</span>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Lapangan</th>
                <th>Tanggal & Jam</th>
                <th>Pemesan</th>
                <th>Total</th>
                <th>Metode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--futsal)' }}>{b.id}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className={b.type === 'Futsal' ? 'chip-futsal' : 'chip-badminton'} style={{ fontSize: 10, padding: '2px 7px' }}>
                        {b.type}
                      </span>
                      <span style={{ fontSize: 12 }}>{b.court}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 12 }}>{dateLabel(b.date)}</span>
                    <span style={{ display: 'block', fontSize: 11, color: 'var(--ink-muted)' }}>Jam {b.time} · {b.duration} jam</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 12 }}>{b.customer}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{money(b.total)}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 12 }}>{b.method || 'QRIS'}</span>
                  </td>
                  <td><StatusChip status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--ink-muted)', fontSize: 14 }}>
              <ChartNoAxesCombined size={28} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.3 }} />
              Tidak ada data transaksi sesuai filter.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
