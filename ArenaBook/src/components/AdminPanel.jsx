// AdminPanel.jsx — Dashboard Admin ArenaBook
// Fitur: statistik, tabel pemesanan (konfirmasi kasir), kelola lapangan, kelola pengguna.
// Hanya bisa diakses oleh role Admin (pengecekan dilakukan di App.jsx).
// Catatan: Pengamanan di JavaScript hanya untuk demo. Pada versi final, server yang memvalidasi.

import { useState, useMemo } from 'react'
import {
  Users, Check, Clock, X, Search, Wrench,
  CircleDollarSign, Ticket, AlertCircle, RefreshCw,
  UserPlus, Shield, User, Trash2, Settings, ChevronDown,
  CheckCircle2, Edit3
} from 'lucide-react'
import { money, dateLabel } from '../data/mockData'

// ---- Chip status (ikon + teks) ----
function StatusChip({ status }) {
  const normalize = (s) => {
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

export default function AdminPanel({
  bookings,
  courts,
  users = [],
  onUpdateBookingStatus,
  onToggleCourtStatus,
  onUpdateCourtPrice,
  onOpenPaymentModal,
  onOpenTicketModal,
  onAddAdminUser,
  onUpdateUserRole,
  onDeleteUser
}) {
  const [activeTab, setActiveTab] = useState('bookings') // 'bookings' | 'courts' | 'users'
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [editingCourt, setEditingCourt] = useState(null)
  const [newPrice, setNewPrice] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [adminForm, setAdminForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [adminFormError, setAdminFormError] = useState('')
  const [confirmAction, setConfirmAction] = useState(null) // { type, courtId, courtName }

  // Filter pemesanan
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchStatus = statusFilter === 'Semua' || b.status === statusFilter
      const matchQuery =
        b.id.toLowerCase().includes(search.toLowerCase()) ||
        b.customer.toLowerCase().includes(search.toLowerCase()) ||
        b.court.toLowerCase().includes(search.toLowerCase())
      return matchStatus && matchQuery
    })
  }, [bookings, statusFilter, search])

  // Filter pengguna
  const filteredUsers = useMemo(() =>
    users.filter(u =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
    ), [users, userSearch])

  // Statistik (dihitung dari data)
  const stats = {
    total: bookings.length,
    lunas: bookings.filter(b => b.payment === 'Berhasil' || b.status === 'Terkonfirmasi').length,
    menunggu: bookings.filter(b => b.status === 'Menunggu Pembayaran').length,
    pendapatan: bookings.filter(b => b.payment === 'Berhasil' || b.status === 'Terkonfirmasi').reduce((s, b) => s + b.total, 0)
  }

  const handleSavePrice = (courtId) => {
    const num = Number(newPrice.toString().replace(/\D/g, ''))
    if (!isNaN(num) && num > 0) {
      onUpdateCourtPrice(courtId, num)
      setEditingCourt(null)
      setNewPrice('')
    }
  }

  const handleCreateAdmin = (e) => {
    e.preventDefault()
    setAdminFormError('')
    if (!adminForm.name.trim() || !adminForm.email.trim() || !adminForm.password) {
      setAdminFormError('Nama, email, dan kata sandi wajib diisi.')
      return
    }
    if (adminForm.password.length < 6) {
      setAdminFormError('Kata sandi minimal 6 karakter.')
      return
    }
    const res = onAddAdminUser(adminForm)
    if (res?.success) {
      setAdminForm({ name: '', email: '', phone: '', password: '' })
      setShowAddAdmin(false)
    } else if (res?.message) {
      setAdminFormError(res.message)
    }
  }

  // Ekspor CSV pemesanan
  const handleExportCSV = () => {
    const header = 'Kode,Lapangan,Tanggal,Jam,Durasi,Pemesan,Total,Status'
    const rows = bookings.map(b =>
      `${b.id},${b.court},${b.date},${b.time},${b.duration} jam,${b.customer},${b.total},${b.status}`
    ).join('\n')
    const csv = header + '\n' + rows
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `arenabook-pemesanan-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header & statistik */}
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Dashboard Admin</h2>
        <p style={{ fontSize: 14, color: 'var(--ink-muted)' }}>Kelola pemesanan, lapangan, dan pengguna Arena Panggulaan.</p>
      </div>

      {/* Kartu statistik */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'var(--futsal-soft)' }}>
            <Ticket size={20} color="var(--futsal)" />
          </div>
          <div>
            <div className="stat-label">Total Pemesanan</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'var(--status-lunas-bg)' }}>
            <CheckCircle2 size={20} color="var(--status-lunas-ink)" />
          </div>
          <div>
            <div className="stat-label">Lunas</div>
            <div className="stat-value">{stats.lunas}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: 'var(--status-menunggu-bg)' }}>
            <Clock size={20} color="var(--status-menunggu-ink)" />
          </div>
          <div>
            <div className="stat-label">Menunggu Pembayaran</div>
            <div className="stat-value">{stats.menunggu}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: '#FEE2E2' }}>
            <CircleDollarSign size={20} color="var(--cta)" />
          </div>
          <div>
            <div className="stat-label">Total Pendapatan</div>
            <div className="stat-value" style={{ fontSize: 16 }}>{money(stats.pendapatan)}</div>
          </div>
        </div>
      </div>

      {/* Tab navigasi */}
      <div className="card" style={{ padding: 0 }}>
        <div className="admin-tabs" style={{ padding: '0 20px' }}>
          {[
            { id: 'bookings', label: 'Pemesanan Masuk', icon: <Ticket size={15} /> },
            { id: 'courts', label: 'Kelola Lapangan', icon: <Wrench size={15} /> },
            { id: 'users', label: 'Kelola Pengguna', icon: <Users size={15} /> }
          ].map(tab => (
            <button
              key={tab.id}
              className={`admin-tab-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: 20 }}>

          {/* ===== TAB: PEMESANAN ===== */}
          {activeTab === 'bookings' && (
            <div>
              {/* Filter & cari */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
                <div className="input-wrapper" style={{ flex: 1, minWidth: 200 }}>
                  <span className="input-icon"><Search size={16} /></span>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Cari kode, pemesan, atau lapangan..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ paddingLeft: 42 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['Semua', 'Terkonfirmasi', 'Menunggu Pembayaran', 'Dibatalkan'].map(s => (
                    <button
                      key={s}
                      className={`filter-chip${statusFilter === s ? ' active' : ''}`}
                      onClick={() => setStatusFilter(s)}
                      style={{ fontSize: 12 }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button className="btn btn-outline btn-sm" onClick={handleExportCSV}>
                  Ekspor CSV
                </button>
              </div>

              {/* Tabel */}
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Kode</th>
                      <th>Lapangan & Jadwal</th>
                      <th>Pemesan</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(b => (
                      <tr key={b.id}>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--futsal)' }}>{b.id}</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, fontSize: 13 }}>{b.court}</span>
                          <span style={{ display: 'block', fontSize: 11, color: 'var(--ink-muted)' }}>
                            {dateLabel(b.date)} · Jam {b.time} · {b.duration} jam
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{b.customer}</span>
                          <span style={{ display: 'block', fontSize: 11, color: 'var(--ink-muted)' }}>{b.phone}</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700 }}>{money(b.total)}</span>
                          <span style={{ display: 'block', fontSize: 11, color: 'var(--ink-muted)' }}>{b.method}</span>
                        </td>
                        <td><StatusChip status={b.status} /></td>
                        <td>
                          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            {/* Konfirmasi kasir (pembayaran tunai) */}
                            {b.status === 'Menunggu Pembayaran' && (
                              <>
                                <button
                                  className="btn btn-primary btn-sm"
                                  style={{ fontSize: 11 }}
                                  onClick={() => {
                                    if (window.confirm(`Konfirmasi kasir untuk pemesanan ${b.id}?\nPembayaran tunai sebesar ${money(b.total)} diterima.`)) {
                                      onUpdateBookingStatus(b.id, 'Terkonfirmasi', 'Berhasil')
                                    }
                                  }}
                                  title="Konfirmasi pembayaran tunai di kasir"
                                >
                                  <Check size={12} /> Konfirmasi Kasir
                                </button>
                                <button
                                  className="btn btn-outline btn-sm"
                                  style={{ fontSize: 11, color: 'var(--status-batal-ink)', borderColor: '#FCA5A5' }}
                                  onClick={() => {
                                    if (window.confirm(`Batalkan pemesanan ${b.id}?`)) {
                                      onUpdateBookingStatus(b.id, 'Dibatalkan', 'Gagal')
                                    }
                                  }}
                                >
                                  <X size={12} />
                                </button>
                              </>
                            )}
                            {(b.status === 'Terkonfirmasi' || b.payment === 'Berhasil') && (
                              <button
                                className="btn btn-outline btn-sm"
                                style={{ fontSize: 11, color: 'var(--status-lunas-ink)', borderColor: '#86EFAC' }}
                                onClick={() => onOpenTicketModal(b)}
                              >
                                <Ticket size={12} /> E-Tiket
                              </button>
                            )}
                            {b.status === 'Dibatalkan' && (
                              <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>–</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredBookings.length === 0 && (
                  <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--ink-muted)', fontSize: 14 }}>
                    <Ticket size={28} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.3 }} />
                    Tidak ada pemesanan sesuai filter.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== TAB: KELOLA LAPANGAN ===== */}
          {activeTab === 'courts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {courts.map(court => {
                const isFutsal = court.type === 'Futsal'
                const isMaintenance = court.status === 'Pemeliharaan'
                return (
                  <div key={court.id} className="court-manage-card">
                    {/* Header kartu lapangan */}
                    <div className={`court-manage-header ${isFutsal ? 'futsal' : 'badminton'}`}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                          <span className={isFutsal ? 'chip-futsal' : 'chip-badminton'}>
                            {court.type} · {court.id}
                          </span>
                          <span className={`chip-status ${isMaintenance ? 'menunggu' : 'lunas'}`}>
                            {isMaintenance ? <><AlertCircle size={11} /> Pemeliharaan</> : <><Check size={11} /> Tersedia</>}
                          </span>
                        </div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)' }}>{court.name}</div>
                      </div>
                    </div>

                    {/* Body: edit tarif & toggle status */}
                    <div className="court-manage-body">
                      {/* Tarif per jam */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', marginBottom: 8 }}>
                          Tarif per Jam
                        </div>
                        {editingCourt === court.id ? (
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'var(--ink-muted)' }}>Rp</span>
                              <input
                                type="number"
                                className="form-input"
                                style={{ paddingLeft: 32 }}
                                placeholder={court.price.toString()}
                                value={newPrice}
                                onChange={e => setNewPrice(e.target.value)}
                                min={1000}
                                step={5000}
                                autoFocus
                              />
                            </div>
                            <button className="btn btn-primary btn-sm" onClick={() => handleSavePrice(court.id)}>
                              <Check size={14} /> Simpan
                            </button>
                            <button className="btn btn-outline btn-sm" onClick={() => setEditingCourt(null)}>
                              Batal
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--cta)' }}>{money(court.price)}</span>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => { setEditingCourt(court.id); setNewPrice(court.price.toString()) }}
                            >
                              <Edit3 size={13} /> Ubah Tarif
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Toggle status */}
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', marginBottom: 8 }}>
                          Status Lapangan
                        </div>
                        <button
                          className={`btn btn-sm ${isMaintenance ? 'btn-primary' : 'btn-outline'}`}
                          style={!isMaintenance ? { color: 'var(--status-menunggu-ink)', borderColor: '#FDE68A' } : {}}
                          onClick={() => {
                            const msg = isMaintenance
                              ? `Aktifkan kembali lapangan ${court.name}?`
                              : `Set lapangan ${court.name} ke mode Pemeliharaan?\nLapangan tidak akan bisa dipesan saat dalam pemeliharaan.`
                            if (window.confirm(msg)) onToggleCourtStatus(court.id)
                          }}
                        >
                          {isMaintenance
                            ? <><Check size={14} /> Aktifkan Kembali</>
                            : <><Wrench size={14} /> Set Pemeliharaan</>
                          }
                        </button>
                        {isMaintenance && (
                          <p style={{ fontSize: 12, color: 'var(--status-menunggu-ink)', marginTop: 6 }}>
                            Lapangan ini saat ini tidak tersedia untuk pemesanan.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ===== TAB: KELOLA PENGGUNA ===== */}
          {activeTab === 'users' && (
            <div>
              {/* Header & tambah admin */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="input-wrapper" style={{ flex: 1, minWidth: 200 }}>
                  <span className="input-icon"><Search size={16} /></span>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Cari nama, email, atau peran..."
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    style={{ paddingLeft: 42 }}
                  />
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowAddAdmin(v => !v)}
                >
                  <UserPlus size={14} /> Tambah Admin
                </button>
              </div>

              {/* Form tambah admin */}
              {showAddAdmin && (
                <div style={{
                  background: 'var(--futsal-soft)', border: '1px solid #c3d7f7',
                  borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: 16
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--futsal)', marginBottom: 12 }}>
                    <Shield size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                    Buat Akun Admin Baru
                  </div>
                  {adminFormError && (
                    <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 6, padding: '8px 12px', fontSize: 12, color: '#991B1B', marginBottom: 10 }}>
                      {adminFormError}
                    </div>
                  )}
                  <form onSubmit={handleCreateAdmin} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Nama</label>
                      <input
                        type="text" className="form-input"
                        value={adminForm.name}
                        onChange={e => setAdminForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Nama admin"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email" className="form-input"
                        value={adminForm.email}
                        onChange={e => setAdminForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="email@domain.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">WhatsApp</label>
                      <input
                        type="tel" className="form-input"
                        value={adminForm.phone}
                        onChange={e => setAdminForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="08xx-xxxx-xxxx"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Kata Sandi</label>
                      <input
                        type="password" className="form-input"
                        value={adminForm.password}
                        onChange={e => setAdminForm(f => ({ ...f, password: e.target.value }))}
                        placeholder="Min. 6 karakter"
                        required
                        minLength={6}
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddAdmin(false)}>Batal</button>
                      <button type="submit" className="btn btn-primary btn-sm">
                        <Shield size={13} /> Buat Akun Admin
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tabel pengguna */}
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Pengguna</th>
                      <th>Email / WhatsApp</th>
                      <th>Peran</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => {
                      const initials = u.initials || u.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                      const isAdmin = u.role === 'Admin'
                      return (
                        <tr key={u.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                                background: isAdmin ? '#FEF3C7' : 'var(--futsal-soft)',
                                color: isAdmin ? '#92400E' : 'var(--futsal)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, fontWeight: 800
                              }}>
                                {initials}
                              </div>
                              <span style={{ fontWeight: 700, fontSize: 13 }}>{u.name}</span>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: 13 }}>{u.email}</span>
                            {u.phone && <span style={{ display: 'block', fontSize: 11, color: 'var(--ink-muted)' }}>{u.phone}</span>}
                          </td>
                          <td>
                            <span style={{
                              fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                              background: isAdmin ? '#FEF3C7' : 'var(--futsal-soft)',
                              color: isAdmin ? '#92400E' : 'var(--futsal)'
                            }}>
                              {u.role}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 5 }}>
                              {u.role === 'Pelanggan' && (
                                <button
                                  className="btn btn-outline btn-sm"
                                  style={{ fontSize: 11 }}
                                  onClick={() => {
                                    if (window.confirm(`Jadikan ${u.name} sebagai Admin?`)) {
                                      onUpdateUserRole(u.id, 'Admin')
                                    }
                                  }}
                                >
                                  <Shield size={11} /> Jadikan Admin
                                </button>
                              )}
                              {u.role === 'Admin' && (
                                <button
                                  className="btn btn-outline btn-sm"
                                  style={{ fontSize: 11 }}
                                  onClick={() => {
                                    if (window.confirm(`Turunkan ${u.name} menjadi Pelanggan?`)) {
                                      onUpdateUserRole(u.id, 'Pelanggan')
                                    }
                                  }}
                                >
                                  <User size={11} /> Jadikan Pelanggan
                                </button>
                              )}
                              <button
                                className="btn btn-outline btn-sm"
                                style={{ fontSize: 11, color: 'var(--status-batal-ink)', borderColor: '#FCA5A5' }}
                                onClick={() => {
                                  if (window.confirm(`Hapus akun ${u.name}? Tindakan ini tidak dapat dibatalkan.`)) {
                                    onDeleteUser(u.id)
                                  }
                                }}
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--ink-muted)', fontSize: 14 }}>
                    <Users size={24} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.3 }} />
                    Tidak ada pengguna ditemukan.
                  </div>
                )}
              </div>

              {/* Catatan hak akses */}
              <div style={{
                marginTop: 16, background: 'var(--futsal-soft)', border: '1px solid #c3d7f7',
                borderRadius: 'var(--radius-md)', padding: '12px 16px',
                fontSize: 12, color: 'var(--futsal)', display: 'flex', gap: 8, alignItems: 'flex-start'
              }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Pengaturan Hak Akses:</strong> Pelanggan tidak bisa mengakses halaman Admin.
                  Admin bisa melihat semua pemesanan dan laporan. Perubahan di sini disimpan sementara di browser (demo).
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
