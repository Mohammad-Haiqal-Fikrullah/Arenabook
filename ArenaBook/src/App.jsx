// App.jsx — Komponen utama ArenaBook
// Mengelola seluruh state aplikasi, navigasi, dan render halaman.
// Tema: terang (putih/abu), aksen oranye, biru futsal, hijau badminton.
// Catatan keamanan: Pengamanan di JavaScript hanya untuk demo.
// Pada versi final, pengecekan role dilakukan di server.

import { useMemo, useState } from 'react'
import {
  Activity, CalendarDays, Check, ChevronRight,
  CircleDollarSign, Clock3, CreditCard, LayoutDashboard,
  LogOut, Menu, Plus, Search, ShieldCheck, Ticket,
  Users, X, ChartNoAxesCombined, User, Info, LogIn,
  UserPlus, AlertCircle, Dumbbell, MapPin, ArrowRight
} from 'lucide-react'

import {
  initialCourts,
  seedBookings,
  timeSlots,
  demoUsers,
  money,
  dateLabel
} from './data/mockData'

import AuthModal from './components/AuthModal'
import CourtDetailsModal from './components/CourtDetailsModal'
import BookingModal from './components/BookingModal'
import PaymentGatewayModal from './components/PaymentGatewayModal'
import TicketModal from './components/TicketModal'
import AdminPanel from './components/AdminPanel'
import ReportsPanel from './components/ReportsPanel'

// ============================================================
// Komponen: Ilustrasi SVG Lapangan (tampak atas)
// Futsal = vinyl biru, Badminton = lantai hijau
// ============================================================
function CourtIllustration({ type, height = 160 }) {
  if (type === 'Futsal') {
    return (
      <svg
        viewBox="0 0 320 160"
        style={{ width: '100%', height }}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Latar vinyl biru */}
        <rect width="320" height="160" fill="#1E5FD0" />
        {/* Garis lapangan putih */}
        <rect x="20" y="20" width="280" height="120" fill="none" stroke="white" strokeWidth="2.5" strokeOpacity="0.7" />
        {/* Garis tengah */}
        <line x1="160" y1="20" x2="160" y2="140" stroke="white" strokeWidth="2" strokeOpacity="0.7" />
        {/* Lingkaran tengah */}
        <circle cx="160" cy="80" r="28" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.7" />
        <circle cx="160" cy="80" r="3" fill="white" fillOpacity="0.7" />
        {/* Kotak gawang kiri */}
        <rect x="20" y="52" width="40" height="56" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.7" />
        {/* Kotak gawang kanan */}
        <rect x="260" y="52" width="40" height="56" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.7" />
        {/* Label */}
        <text x="160" y="155" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="9" fontFamily="sans-serif">Lapangan Futsal</text>
      </svg>
    )
  }
  // Badminton — lantai hijau
  return (
    <svg
      viewBox="0 0 320 160"
      style={{ width: '100%', height }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Latar hijau */}
      <rect width="320" height="160" fill="#2E9E5B" />
      {/* Border lapangan */}
      <rect x="30" y="15" width="260" height="130" fill="none" stroke="white" strokeWidth="2.5" strokeOpacity="0.7" />
      {/* Garis net (tengah) */}
      <line x1="160" y1="15" x2="160" y2="145" stroke="white" strokeWidth="2.5" strokeOpacity="0.9" />
      {/* Garis servis kiri */}
      <line x1="80" y1="15" x2="80" y2="145" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
      {/* Garis servis kanan */}
      <line x1="240" y1="15" x2="240" y2="145" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
      {/* Garis belakang ganda kiri */}
      <line x1="30" y1="38" x2="80" y2="38" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
      {/* Garis belakang ganda kanan */}
      <line x1="240" y1="38" x2="290" y2="38" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
      {/* Garis belakang bawah kiri */}
      <line x1="30" y1="122" x2="80" y2="122" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
      {/* Garis belakang bawah kanan */}
      <line x1="240" y1="122" x2="290" y2="122" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
      {/* Label */}
      <text x="160" y="155" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="9" fontFamily="sans-serif">Lapangan Badminton</text>
    </svg>
  )
}

// ============================================================
// Komponen: Chip jenis lapangan (ikon + teks)
// ============================================================
function CourtChip({ type, code }) {
  const isFutsal = type === 'Futsal'
  return (
    <span className={isFutsal ? 'chip-futsal' : 'chip-badminton'}>
      {isFutsal ? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/></svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      )}
      {type} {code && <span style={{ opacity: 0.65, fontWeight: 400 }}>· {code}</span>}
    </span>
  )
}

// ============================================================
// Komponen: Chip status (selalu ikon + teks, bukan warna saja)
// ============================================================
function StatusChip({ status }) {
  // Normalisasi status dari data lama
  const normalize = (s) => {
    if (!s) return 'dibatalkan'
    const sl = s.toLowerCase()
    if (sl.includes('konfirmasi') || sl.includes('lunas') || sl.includes('berhasil')) return 'lunas'
    if (sl.includes('menunggu') || sl.includes('tertunda')) return 'menunggu'
    return 'dibatalkan'
  }
  const key = normalize(status)

  const config = {
    lunas: {
      cls: 'chip-status lunas',
      icon: <Check size={12} />,
      label: 'Lunas'
    },
    menunggu: {
      cls: 'chip-status menunggu',
      icon: <Clock3 size={12} />,
      label: 'Menunggu Pembayaran'
    },
    dibatalkan: {
      cls: 'chip-status dibatalkan',
      icon: <X size={12} />,
      label: 'Dibatalkan'
    }
  }

  const c = config[key] || config.dibatalkan
  return <span className={c.cls}>{c.icon}{c.label}</span>
}

// ============================================================
// Komponen: Kartu statistik
// ============================================================
function StatCard({ label, value, sub, iconBg, iconColor, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon-box" style={{ background: iconBg }}>
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  )
}

// ============================================================
// Komponen: Kartu lapangan (digunakan di halaman Ringkasan & Katalog)
// ============================================================
function CourtCard({ court, onBook, onOpenDetails, expanded = false }) {
  const isMaintenance = court.status === 'Pemeliharaan'

  return (
    <article className="court-card">
      <div className={`court-illustration ${court.type === 'Futsal' ? 'futsal-bg' : 'badminton-bg'}`}>
        <CourtIllustration type={court.type} height={130} />
      </div>
      <div className="court-info">
        <CourtChip type={court.type} code={court.id} />
        <div>
          <div className="court-name">{court.name}</div>
          {isMaintenance && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#FEF3C7', color: '#92400E', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, marginTop: 4 }}>
              <AlertCircle size={11} /> Pemeliharaan
            </span>
          )}
        </div>
        <div className="court-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Users size={13} /> {court.capacity}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
            <Clock3 size={13} /> 08.00–22.00
          </span>
          {expanded && court.surface && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <MapPin size={13} /> {court.surface}
            </span>
          )}
        </div>
        {expanded && court.description && (
          <p className="catalog-desc">{court.description}</p>
        )}
        <div className="court-price">{money(court.price)}<span style={{ fontSize: 12, fontWeight: 400, color: 'var(--ink-muted)' }}>/jam</span></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-outline btn-sm"
            style={{ flex: 1 }}
            onClick={() => onOpenDetails(court)}
          >
            <Info size={14} /> Fasilitas &amp; Detail
          </button>
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
            disabled={isMaintenance}
            onClick={() => onBook(court)}
          >
            {isMaintenance ? 'Tidak Tersedia' : 'Pilih Jadwal'}
          </button>
        </div>
      </div>
    </article>
  )
}

// ============================================================
// KOMPONEN UTAMA: App
// ============================================================
export default function App() {
  // --- State navigasi ---
  const [page, setPage] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState(null) // { msg, type }

  // --- State data ---
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('arenabook_users')
      if (saved) return JSON.parse(saved)
    } catch (e) { console.error(e) }
    return demoUsers
  })

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('arenabook_current_user')
      if (saved) return JSON.parse(saved)
    } catch (e) { console.error(e) }
    return demoUsers[0]
  })

  const [courts, setCourts] = useState(initialCourts)
  const [bookings, setBookings] = useState(seedBookings)

  // --- State filter ---
  const todayStr = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [filterType, setFilterType] = useState('Semua')
  const [searchHistory, setSearchHistory] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')

  // --- State modal ---
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authInitialMode, setAuthInitialMode] = useState('login')
  const [authContextMessage, setAuthContextMessage] = useState('')
  const [detailedCourt, setDetailedCourt] = useState(null)
  const [bookingCourt, setBookingCourt] = useState(null)
  const [initialSlotTime, setInitialSlotTime] = useState('')
  const [activePaymentBooking, setActivePaymentBooking] = useState(null)
  const [activeTicketBooking, setActiveTicketBooking] = useState(null)

  // --- Helpers ---
  const showToast = (msg, type = 'info') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4500)
  }

  const openAuth = (mode = 'login', message = '') => {
    setAuthInitialMode(mode)
    setAuthContextMessage(message)
    setIsAuthOpen(true)
  }

  // ---- Handler login ----
  const handleLogin = (identifier, password) => {
    const idLower = identifier.trim().toLowerCase()
    const foundUser = users.find(u =>
      u.email.toLowerCase() === idLower || u.phone === identifier.trim()
    )
    if (!foundUser) {
      return { success: false, message: 'Akun dengan email atau nomor WhatsApp tersebut belum terdaftar. Silakan daftar terlebih dahulu.' }
    }
    if (foundUser.password && foundUser.password !== password) {
      return { success: false, message: 'Email atau kata sandi salah.' }
    }
    setCurrentUser(foundUser)
    try { localStorage.setItem('arenabook_current_user', JSON.stringify(foundUser)) } catch (e) { console.error(e) }
    showToast(`Selamat datang, ${foundUser.name}!`, 'success')
    return { success: true }
  }

  // ---- Handler registrasi ----
  // Keamanan: role selalu dipaksa 'Pelanggan' di sini.
  // Pada versi final, server yang menentukan role, bukan client.
  const handleRegister = (newUser) => {
    const sanitizedUser = { ...newUser, role: 'Pelanggan', badge: undefined }
    const updatedUsers = [sanitizedUser, ...users]
    setUsers(updatedUsers)
    setCurrentUser(sanitizedUser)
    try {
      localStorage.setItem('arenabook_users', JSON.stringify(updatedUsers))
      localStorage.setItem('arenabook_current_user', JSON.stringify(sanitizedUser))
    } catch (e) { console.error(e) }
    showToast(`Pendaftaran berhasil! Selamat datang, ${sanitizedUser.name}.`, 'success')
    return { success: true }
  }

  // ---- Tambah admin (hanya admin yang bisa) ----
  const handleAddAdminUser = (adminData) => {
    if (currentUser?.role !== 'Admin') {
      showToast('Akses ditolak: Hanya Admin yang dapat membuat akun Admin baru.', 'error')
      return { success: false, message: 'Akses ditolak' }
    }
    const newAdmin = {
      id: `admin-${Date.now()}`,
      name: adminData.name.trim(),
      email: adminData.email.trim().toLowerCase(),
      phone: adminData.phone.trim(),
      role: 'Admin',
      password: adminData.password,
      initials: adminData.name.trim().split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'AD',
      badge: 'Admin Venue'
    }
    const updated = [newAdmin, ...users]
    setUsers(updated)
    try { localStorage.setItem('arenabook_users', JSON.stringify(updated)) } catch (e) { console.error(e) }
    showToast(`Akun Admin ${newAdmin.name} berhasil dibuat.`, 'success')
    return { success: true }
  }

  const handleUpdateUserRole = (userId, newRole) => {
    if (currentUser?.role !== 'Admin') { showToast('Akses ditolak.', 'error'); return }
    const updated = users.map(u =>
      u.id === userId ? { ...u, role: newRole, badge: newRole === 'Admin' ? 'Admin Venue' : undefined } : u
    )
    setUsers(updated)
    try { localStorage.setItem('arenabook_users', JSON.stringify(updated)) } catch (e) { console.error(e) }
    showToast(`Peran pengguna diperbarui menjadi ${newRole}.`, 'success')
  }

  const handleDeleteUser = (userId) => {
    if (currentUser?.role !== 'Admin') { showToast('Akses ditolak.', 'error'); return }
    const updated = users.filter(u => u.id !== userId)
    setUsers(updated)
    try { localStorage.setItem('arenabook_users', JSON.stringify(updated)) } catch (e) { console.error(e) }
    showToast('Akun pengguna berhasil dihapus.')
  }

  const handleSelectUser = (user) => {
    setCurrentUser(user)
    try { localStorage.setItem('arenabook_current_user', JSON.stringify(user)) } catch (e) { console.error(e) }
    showToast(`Beralih ke akun: ${user.name} (${user.role})`)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    try { localStorage.removeItem('arenabook_current_user') } catch (e) { console.error(e) }
    showToast('Anda telah keluar dari akun.')
    if (page === 'admin' || page === 'reports') setPage('overview')
  }

  // ---- Filtered bookings ----
  const visibleBookings = useMemo(() => {
    return bookings.filter(b => {
      // Pelanggan hanya melihat pemesanan miliknya
      if (currentUser?.role !== 'Admin' && currentUser) {
        if (b.customer !== currentUser.name) return false
      }
      const matchStatus = statusFilter === 'Semua' || b.status === statusFilter ||
        (statusFilter === 'Lunas' && (b.payment === 'Berhasil' || b.status === 'Terkonfirmasi')) ||
        (statusFilter === 'Menunggu Pembayaran' && b.status === 'Menunggu Pembayaran') ||
        (statusFilter === 'Dibatalkan' && b.status === 'Dibatalkan')
      const matchSearch =
        b.id.toLowerCase().includes(searchHistory.toLowerCase()) ||
        b.court.toLowerCase().includes(searchHistory.toLowerCase()) ||
        b.customer.toLowerCase().includes(searchHistory.toLowerCase())
      return matchStatus && matchSearch
    })
  }, [bookings, statusFilter, searchHistory, currentUser])

  // ---- Hitung statistik dari data (tidak hardcode) ----
  const stats = useMemo(() => {
    const userBookings = currentUser?.role === 'Admin'
      ? bookings
      : bookings.filter(b => b.customer === currentUser?.name)
    const lunas = userBookings.filter(b => b.payment === 'Berhasil' || b.status === 'Terkonfirmasi').length
    const menunggu = userBookings.filter(b => b.status === 'Menunggu Pembayaran').length
    const dibatalkan = userBookings.filter(b => b.status === 'Dibatalkan').length
    const pendapatan = userBookings
      .filter(b => b.payment === 'Berhasil' || b.status === 'Terkonfirmasi')
      .reduce((s, b) => s + b.total, 0)
    return { total: userBookings.length, lunas, menunggu, dibatalkan, pendapatan }
  }, [bookings, currentUser])

  // Hitung slot kosong hari ini
  const freeSlots = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    let bookedToday = 0
    courts.forEach(court => {
      timeSlots.forEach(slot => {
        const isBooked = bookings.some(b => {
          if (b.court !== court.name || b.date !== today || b.status === 'Dibatalkan') return false
          const sIdx = timeSlots.indexOf(b.time)
          const thisIdx = timeSlots.indexOf(slot)
          return thisIdx >= sIdx && thisIdx < sIdx + (b.duration || 1)
        })
        if (!isBooked && court.status !== 'Pemeliharaan') bookedToday++
      })
    })
    const totalPossible = courts.filter(c => c.status !== 'Pemeliharaan').length * timeSlots.length
    return totalPossible - (totalPossible - bookedToday > 0 ? (totalPossible - bookedToday) : 0)
    // Sederhanakan: kembalikan jumlah slot kosong
  }, [bookings, courts])

  const freeSlotsCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    let free = 0
    courts.forEach(court => {
      if (court.status === 'Pemeliharaan') return
      timeSlots.forEach(slot => {
        const isBooked = bookings.some(b => {
          if (b.court !== court.name || b.date !== today || b.status === 'Dibatalkan') return false
          const sIdx = timeSlots.indexOf(b.time)
          const thisIdx = timeSlots.indexOf(slot)
          return thisIdx >= sIdx && thisIdx < sIdx + (b.duration || 1)
        })
        if (!isBooked) free++
      })
    })
    return free
  }, [bookings, courts])

  // ---- Booking flow ----
  const handleOpenBooking = (court, slotTime = '') => {
    if (!currentUser) {
      openAuth('login', 'Masuk atau daftar untuk memesan lapangan.')
      return
    }
    setBookingCourt(court)
    setInitialSlotTime(slotTime)
  }

  const handleCreateBooking = (data) => {
    // Format kode booking: AB-YYYYMMDD-XXX
    const dateFormatted = data.date.replace(/-/g, '')
    const randomSuffix = String(Math.floor(100 + Math.random() * 900))
    const bookingId = `AB-${dateFormatted}-${randomSuffix}`

    const newBooking = {
      id: bookingId,
      court: data.court.name,
      courtId: data.court.id,
      type: data.court.type,
      date: data.date,
      time: data.time,
      duration: data.duration,
      total: data.total,
      payment: 'Tertunda',
      status: 'Menunggu Pembayaran',
      customer: data.customer,
      phone: data.phone,
      method: data.method,
      vaNumber: data.vaNumber,
      createdAt: new Date().toISOString()
    }

    // Cek bentrok jadwal sebelum menyimpan
    const conflict = bookings.some(b => {
      if (b.courtId !== data.court.id || b.date !== data.date || b.status === 'Dibatalkan') return false
      const sIdx = timeSlots.indexOf(b.time)
      const newIdx = timeSlots.indexOf(data.time)
      return newIdx >= sIdx && newIdx < sIdx + (b.duration || 1)
    })

    if (conflict) {
      showToast('Slot sudah terisi, silakan pilih jam lain.', 'error')
      return
    }

    setBookings(prev => [newBooking, ...prev])
    setBookingCourt(null)
    setInitialSlotTime('')
    setActivePaymentBooking(newBooking)
    showToast(`Pemesanan ${bookingId} dibuat! Selesaikan pembayaran.`, 'success')
  }

  const handleSimulatePaymentSuccess = (bookingId) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, payment: 'Berhasil', status: 'Terkonfirmasi' } : b
    ))
    setActivePaymentBooking(prev => prev ? { ...prev, payment: 'Berhasil', status: 'Terkonfirmasi' } : null)
    showToast(`Pembayaran ${bookingId} berhasil. Pemesanan terkonfirmasi!`, 'success')
  }

  const handleSimulatePaymentFailure = (bookingId) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, payment: 'Gagal', status: 'Dibatalkan' } : b
    ))
    setActivePaymentBooking(prev => prev ? { ...prev, payment: 'Gagal', status: 'Dibatalkan' } : null)
    showToast(`Pembayaran ${bookingId} gagal. Pemesanan dibatalkan.`, 'error')
  }

  // Pelanggan hanya bisa batalkan pemesanan miliknya yang masih menunggu pembayaran
  const handleCancelBooking = (bookingId) => {
    const b = bookings.find(x => x.id === bookingId)
    if (!b) return
    if (currentUser?.role !== 'Admin' && b.customer !== currentUser?.name) {
      showToast('Anda tidak dapat membatalkan pemesanan milik orang lain.', 'error')
      return
    }
    if (b.status !== 'Menunggu Pembayaran' && currentUser?.role !== 'Admin') {
      showToast('Hanya pemesanan yang menunggu pembayaran yang dapat dibatalkan.', 'error')
      return
    }
    setBookings(prev => prev.map(x => x.id === bookingId ? { ...x, status: 'Dibatalkan', payment: 'Gagal' } : x))
    showToast(`Pemesanan ${bookingId} berhasil dibatalkan.`)
  }

  const handleUpdateBookingStatus = (bookingId, newStatus, newPayment) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: newStatus, payment: newPayment } : b
    ))
    showToast(`Status pemesanan ${bookingId} diperbarui.`, 'success')
  }

  const handleToggleCourtStatus = (courtId) => {
    setCourts(prev => prev.map(c =>
      c.id === courtId ? { ...c, status: c.status === 'Tersedia' ? 'Pemeliharaan' : 'Tersedia' } : c
    ))
    showToast('Status lapangan diperbarui.', 'success')
  }

  const handleUpdateCourtPrice = (courtId, newPrice) => {
    setCourts(prev => prev.map(c =>
      c.id === courtId ? { ...c, price: newPrice } : c
    ))
    showToast('Tarif lapangan berhasil diperbarui.', 'success')
  }

  // ---- Navigasi ----
  const isAdmin = currentUser?.role === 'Admin'

  const navPelanggan = [
    { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'courts', label: 'Katalog Lapangan', icon: Dumbbell },
    { id: 'schedule', label: 'Jadwal', icon: CalendarDays },
    { id: 'history', label: 'Riwayat & E-Tiket', icon: Ticket }
  ]

  const navAdmin = [
    { id: 'admin', label: 'Dashboard Admin', icon: Users },
    { id: 'reports', label: 'Laporan Transaksi', icon: ChartNoAxesCombined }
  ]

  // Judul halaman
  const pageTitles = {
    overview: 'Ringkasan',
    courts: 'Katalog Lapangan',
    schedule: 'Jadwal & Ketersediaan',
    history: 'Riwayat & E-Tiket',
    admin: 'Dashboard Admin',
    reports: 'Laporan Transaksi'
  }

  // Format tanggal header
  const headerDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  // Inisial pengguna
  const userInitials = currentUser?.initials ||
    (currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '?')

  // Navigasi ke halaman & tutup sidebar mobile
  const navigate = (pageId) => {
    setPage(pageId)
    setSidebarOpen(false)
  }

  return (
    <div className="app-shell">
      {/* ==================== SIDEBAR ==================== */}
      {/* Overlay mobile */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`} aria-label="Navigasi utama">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <line x1="12" y1="3" x2="12" y2="21"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
            </svg>
          </div>
          <span className="sidebar-logo-text">ArenaBook</span>
        </div>

        {/* Kartu venue */}
        <div className="sidebar-venue">
          <div className="sidebar-venue-name">Arena Panggulaan</div>
          <div className="sidebar-venue-desc">1 venue · 2 lapangan</div>
        </div>

        {/* Menu utama */}
        <nav className="sidebar-nav" aria-label="Menu pelanggan">
          <span className="nav-section-label">Menu Utama</span>
          {navPelanggan.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className={`nav-item${page === item.id ? ' active' : ''}`}
                onClick={() => navigate(item.id)}
                aria-current={page === item.id ? 'page' : undefined}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            )
          })}

          {/* Menu admin — hanya tampil untuk role Admin */}
          {isAdmin && (
            <>
              <span className="nav-section-label" style={{ marginTop: 8 }}>Pengelolaan</span>
              {navAdmin.map(item => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    className={`nav-item${page === item.id ? ' active' : ''}`}
                    onClick={() => navigate(item.id)}
                    aria-current={page === item.id ? 'page' : undefined}
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </>
          )}
        </nav>

        {/* Footer sidebar */}
        <div className="sidebar-footer">
          <p className="sidebar-help">
            Butuh bantuan? Hubungi admin lewat WhatsApp:{' '}
            <a href="https://wa.me/[ISI_NOMOR_WA]" target="_blank" rel="noopener noreferrer">
              [ISI NOMOR WHATSAPP GOR]
            </a>
          </p>
          {currentUser ? (
            <button className="sidebar-logout-btn" onClick={handleLogout}>
              <LogOut size={16} aria-hidden="true" />
              Keluar
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              style={{ width: '100%' }}
              onClick={() => openAuth('login')}
            >
              <LogIn size={15} /> Masuk
            </button>
          )}
        </div>
      </aside>

      {/* ==================== AREA KONTEN ==================== */}
      <div className="main-content">
        {/* Header */}
        <header className="content-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Tombol hamburger (mobile) */}
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu navigasi"
            >
              <Menu size={20} />
            </button>
            <div className="header-left">
              <span className="header-date">{headerDate}</span>
              <h1 className="header-title">{pageTitles[page] || 'ArenaBook'}</h1>
            </div>
          </div>
          <div className="header-right">
            {/* Badge Mode Demo — satu-satunya indikator demo */}
            <span className="badge-demo">Mode Demo</span>

            {currentUser ? (
              <div className="user-chip" onClick={() => openAuth('demo')} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && openAuth('demo')}>
                <div className="user-avatar" aria-hidden="true">{userInitials}</div>
                <div className="user-info">
                  <span className="user-name">{currentUser.name.split(' ')[0]}</span>
                  <span className="user-role">{currentUser.role}</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline btn-sm" onClick={() => openAuth('login')}>
                  <LogIn size={15} /> Masuk
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => openAuth('register')}>
                  <UserPlus size={15} /> Daftar
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Body halaman */}
        <main className="page-body" id="main-content">

          {/* ========== HALAMAN: RINGKASAN ========== */}
          {page === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Sapaan + Hero */}
              <div className="hero-card">
                <div>
                  <h2 className="hero-title">
                    {currentUser ? `Halo, ${currentUser.name.split(' ')[0]}.` : 'Selamat datang.'}
                  </h2>
                  <p className="hero-sub">Pilih jam yang masih kosong, pesan, lalu bayar.</p>
                  <div className="hero-actions">
                    <button className="btn btn-primary" onClick={() => navigate('schedule')}>
                      Pesan Lapangan <ArrowRight size={16} />
                    </button>
                    <button className="btn btn-outline" onClick={() => navigate('courts')}>
                      Lihat Katalog
                    </button>
                  </div>
                </div>
                <div className="hero-slot-card">
                  <div className="hero-slot-label">Jam kosong hari ini</div>
                  <div className="hero-slot-number">{freeSlotsCount}</div>
                  <div className="hero-slot-detail">
                    {courts.map(c => {
                      const todayFree = timeSlots.filter(slot => {
                        const isBooked = bookings.some(b => {
                          if (b.court !== c.name || b.date !== todayStr || b.status === 'Dibatalkan') return false
                          const sIdx = timeSlots.indexOf(b.time)
                          const thisIdx = timeSlots.indexOf(slot)
                          return thisIdx >= sIdx && thisIdx < sIdx + (b.duration || 1)
                        })
                        return !isBooked
                      }).length
                      return <div key={c.id}>{c.type}: {todayFree} slot</div>
                    })}
                  </div>
                </div>
              </div>

              {/* Statistik */}
              <div className="stats-grid">
                <StatCard
                  label="Total Pemesanan"
                  value={stats.total}
                  sub={`${stats.lunas} lunas · ${stats.menunggu} menunggu · ${stats.dibatalkan} dibatalkan`}
                  iconBg="var(--futsal-soft)"
                  iconColor="var(--futsal)"
                  icon={<Ticket size={20} />}
                />
                <StatCard
                  label="Lunas"
                  value={stats.lunas}
                  iconBg="var(--status-lunas-bg)"
                  iconColor="var(--status-lunas-ink)"
                  icon={<Check size={20} />}
                />
                <StatCard
                  label="Menunggu Pembayaran"
                  value={stats.menunggu}
                  iconBg="var(--status-menunggu-bg)"
                  iconColor="var(--status-menunggu-ink)"
                  icon={<Clock3 size={20} />}
                />
                <StatCard
                  label="Total Pendapatan"
                  value={money(stats.pendapatan)}
                  sub="Hanya dari pemesanan lunas"
                  iconBg="#FEE2E2"
                  iconColor="var(--cta)"
                  icon={<CircleDollarSign size={20} />}
                />
              </div>

              {/* Grid dua kolom: Pilih Lapangan + Pemesanan Terbaru */}
              <div className="two-col-grid">
                {/* Pilih lapangan */}
                <div className="card">
                  <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Pilih Lapangan</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {courts.map(court => (
                      <CourtCard
                        key={court.id}
                        court={court}
                        onBook={handleOpenBooking}
                        onOpenDetails={setDetailedCourt}
                      />
                    ))}
                  </div>
                </div>

                {/* Pemesanan terbaru */}
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800 }}>Pemesanan Terbaru</h3>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => navigate('history')}
                    >
                      Lihat semua
                    </button>
                  </div>
                  <div className="booking-list">
                    {bookings.slice(0, 5).map(b => (
                      <div key={b.id} className="booking-item">
                        <div className={`booking-type-icon ${b.type === 'Futsal' ? 'futsal' : 'badminton'}`} aria-hidden="true">
                          {b.type === 'Futsal'
                            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
                            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                          }
                        </div>
                        <div className="booking-info">
                          <div className="booking-name">{b.court}</div>
                          <div className="booking-meta">{dateLabel(b.date)} · Jam {b.time} · {b.duration} jam</div>
                        </div>
                        <div className="booking-right">
                          <div className="booking-price">{money(b.total)}</div>
                          <StatusChip status={b.status} />
                        </div>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <p style={{ fontSize: 13, color: 'var(--ink-muted)', textAlign: 'center', padding: '20px 0' }}>
                        Belum ada pemesanan. Yuk pilih jadwal pertamamu.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========== HALAMAN: KATALOG LAPANGAN ========== */}
          {page === 'courts' && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Katalog Lapangan Olahraga</h2>
                <p style={{ fontSize: 14, color: 'var(--ink-muted)' }}>2 lapangan tersedia di Arena Panggulaan.</p>
              </div>

              {/* Filter chip */}
              <div className="catalog-filter">
                {['Semua', 'Futsal', 'Badminton'].map(f => (
                  <button
                    key={f}
                    className={`filter-chip${filterType === f ? ' active' : ''}`}
                    onClick={() => setFilterType(f)}
                    aria-pressed={filterType === f}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Kartu katalog */}
              <div className="catalog-grid">
                {courts
                  .filter(c => filterType === 'Semua' || c.type === filterType)
                  .map(court => (
                    <article key={court.id} className="catalog-card">
                      <div className={`catalog-illustration ${court.type === 'Futsal' ? 'futsal-bg' : 'badminton-bg'}`}>
                        <CourtIllustration type={court.type} height={200} />
                      </div>
                      <div className="catalog-card-body">
                        <div className="catalog-card-header">
                          <div>
                            <CourtChip type={court.type} code={court.id} />
                            <div className="catalog-card-name" style={{ marginTop: 6 }}>{court.name}</div>
                          </div>
                          <div className="catalog-price">{money(court.price)}<span style={{ fontSize: 12, fontWeight: 400 }}>/jam</span></div>
                        </div>
                        <div>
                          <div className="catalog-spec-row"><Users size={15} />{court.capacity}</div>
                          <div className="catalog-spec-row"><MapPin size={15} />{court.surface}</div>
                          <div className="catalog-spec-row"><Clock3 size={15} />08.00–22.00</div>
                        </div>
                        <p className="catalog-desc">{court.description}</p>
                        <div className="catalog-actions">
                          <button className="btn btn-outline btn-sm" onClick={() => setDetailedCourt(court)}>
                            <Info size={14} /> Fasilitas &amp; Detail
                          </button>
                          <button
                            className="btn btn-primary btn-sm"
                            disabled={court.status === 'Pemeliharaan'}
                            onClick={() => handleOpenBooking(court)}
                          >
                            Pilih Jadwal
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>

              {/* Info box */}
              <div className="catalog-info-box">
                <Info size={16} style={{ flexShrink: 0 }} />
                <span>Tarif dihitung per jam. Jam yang sudah dipesan tidak bisa dipilih lagi.</span>
              </div>
            </div>
          )}

          {/* ========== HALAMAN: JADWAL & KETERSEDIAAN ========== */}
          {page === 'schedule' && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Jadwal &amp; Ketersediaan</h2>
                <p style={{ fontSize: 14, color: 'var(--ink-muted)' }}>Pilih tanggal dan lapangan. Slot yang terisi tidak bisa dipesan.</p>
              </div>

              {/* Pemilih tanggal + filter + legenda */}
              <div className="card" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <div className="form-group" style={{ gap: 4 }}>
                  <label className="form-label" htmlFor="schedule-date">Tanggal</label>
                  <input
                    id="schedule-date"
                    type="date"
                    className="form-input"
                    min={todayStr}
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    style={{ width: 180 }}
                  />
                </div>
                <div className="form-group" style={{ gap: 4 }}>
                  <label className="form-label" htmlFor="schedule-filter">Lapangan</label>
                  <select
                    id="schedule-filter"
                    className="form-input"
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    style={{ width: 160 }}
                  >
                    <option value="Semua">Semua</option>
                    <option value="Futsal">Futsal</option>
                    <option value="Badminton">Badminton</option>
                  </select>
                </div>
                <div className="schedule-legend" style={{ marginTop: 20 }}>
                  <div className="legend-item"><div className="legend-dot available" /><span>Tersedia</span></div>
                  <div className="legend-item"><div className="legend-dot occupied" /><span>Terisi</span></div>
                  <div className="legend-item"><div className="legend-dot selected" /><span>Dipilih</span></div>
                </div>
              </div>

              {/* Kartu jadwal per lapangan */}
              {courts
                .filter(c => filterType === 'Semua' || c.type === filterType)
                .map(court => {
                  const isMaintenance = court.status === 'Pemeliharaan'
                  return (
                    <div key={court.id} className="schedule-court-card">
                      <div className="schedule-court-header">
                        <div>
                          <CourtChip type={court.type} />
                          <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}>{court.name}</div>
                          <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 2 }}>
                            {money(court.price)}/jam · 08.00–22.00
                            {isMaintenance && (
                              <span style={{ marginLeft: 8, background: '#FEF3C7', color: '#92400E', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>
                                Pemeliharaan
                              </span>
                            )}
                          </div>
                        </div>
                        {!isMaintenance && (
                          <button className="btn btn-outline btn-sm" onClick={() => handleOpenBooking(court)}>
                            Pesan Manual
                          </button>
                        )}
                      </div>

                      {isMaintenance ? (
                        <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--ink-muted)', fontSize: 14 }}>
                          <AlertCircle size={24} style={{ display: 'block', margin: '0 auto 8px', color: '#92400E' }} />
                          Lapangan ini sedang dalam pemeliharaan dan tidak tersedia untuk dipesan.
                        </div>
                      ) : (
                        <div className="slot-grid">
                          {timeSlots.map(slot => {
                            const isBooked = bookings.some(b => {
                              if (b.court !== court.name || b.date !== selectedDate || b.status === 'Dibatalkan') return false
                              const sIdx = timeSlots.indexOf(b.time)
                              const thisIdx = timeSlots.indexOf(slot)
                              return thisIdx >= sIdx && thisIdx < sIdx + (b.duration || 1)
                            })
                            const isPast = selectedDate === todayStr && parseInt(slot.split(':')[0]) < new Date().getHours()

                            return (
                              <button
                                key={slot}
                                className={`slot-btn${isBooked ? ' occupied' : isPast ? ' unavailable' : ''}`}
                                disabled={isBooked || isPast}
                                onClick={() => handleOpenBooking(court, slot)}
                                aria-label={`${court.name} pukul ${slot}, ${isBooked ? 'Terisi' : isPast ? 'Tidak tersedia' : 'Tersedia'}`}
                              >
                                <strong>{slot}</strong>
                                <div style={{ fontSize: 11, fontWeight: 400, marginTop: 2 }}>
                                  {isBooked ? 'Terisi' : isPast ? 'Lewat' : 'Tersedia'}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          )}

          {/* ========== HALAMAN: RIWAYAT & E-TIKET ========== */}
          {page === 'history' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Riwayat &amp; E-Tiket</h2>
                  <p style={{ fontSize: 14, color: 'var(--ink-muted)' }}>Pantau status pemesanan dan unduh e-tiket digital.</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('courts')}>
                  <Plus size={16} /> Pemesanan Baru
                </button>
              </div>

              {!currentUser && (
                <div className="card" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <div style={{ width: 40, height: 40, background: 'var(--futsal-soft)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} color="var(--futsal)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Anda belum masuk</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>Masuk untuk melihat riwayat pemesanan akun Anda.</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openAuth('login')}><LogIn size={14} /> Masuk</button>
                    <button className="btn btn-primary btn-sm" onClick={() => openAuth('register')}><UserPlus size={14} /> Daftar</button>
                  </div>
                </div>
              )}

              {/* Filter pencarian */}
              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div className="input-wrapper" style={{ flex: 1, minWidth: 200 }}>
                    <span className="input-icon"><Search size={18} /></span>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Cari kode, nama, atau lapangan..."
                      value={searchHistory}
                      onChange={e => setSearchHistory(e.target.value)}
                      style={{ paddingLeft: 42 }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['Semua', 'Terkonfirmasi', 'Menunggu Pembayaran', 'Dibatalkan'].map(s => (
                      <button
                        key={s}
                        className={`filter-chip${statusFilter === s ? ' active' : ''}`}
                        onClick={() => setStatusFilter(s)}
                        aria-pressed={statusFilter === s}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tabel riwayat */}
              <div className="card">
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Kode Pemesanan</th>
                        <th>Lapangan &amp; Jadwal</th>
                        <th>Total Biaya</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleBookings.map(b => (
                        <tr key={b.id}>
                          <td>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--futsal)', fontSize: 13 }}>{b.id}</span>
                            <span style={{ display: 'block', fontSize: 12, color: 'var(--ink-muted)' }}>{b.customer}</span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 700, fontSize: 13 }}>{b.court}</span>
                            <span style={{ display: 'block', fontSize: 12, color: 'var(--ink-muted)' }}>
                              {dateLabel(b.date)} · Jam {b.time} ({b.duration} jam)
                            </span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 700 }}>{money(b.total)}</span>
                            <span style={{ display: 'block', fontSize: 11, color: 'var(--ink-muted)' }}>{b.method || 'QRIS'}</span>
                          </td>
                          <td><StatusChip status={b.status} /></td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              {b.status === 'Menunggu Pembayaran' && (
                                <>
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => setActivePaymentBooking(b)}
                                  >
                                    <CreditCard size={13} /> Bayar
                                  </button>
                                  <button
                                    className="btn btn-outline btn-sm"
                                    style={{ color: 'var(--status-batal-ink)', borderColor: '#FCA5A5' }}
                                    onClick={() => handleCancelBooking(b.id)}
                                    aria-label={`Batalkan pemesanan ${b.id}`}
                                  >
                                    <X size={13} />
                                  </button>
                                </>
                              )}
                              {(b.status === 'Terkonfirmasi' || b.payment === 'Berhasil') && (
                                <button
                                  className="btn btn-outline btn-sm"
                                  style={{ color: 'var(--status-lunas-ink)', borderColor: '#86EFAC' }}
                                  onClick={() => setActiveTicketBooking(b)}
                                >
                                  <Ticket size={13} /> E-Tiket
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

                  {visibleBookings.length === 0 && (
                    <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--ink-muted)', fontSize: 14 }}>
                      <Ticket size={32} style={{ display: 'block', margin: '0 auto 10px', opacity: 0.3 }} />
                      {currentUser
                        ? 'Belum ada pemesanan. Yuk pilih jadwal pertamamu.'
                        : 'Masuk untuk melihat riwayat pemesanan Anda.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========== HALAMAN: DASHBOARD ADMIN ========== */}
          {page === 'admin' && (
            isAdmin ? (
              <AdminPanel
                bookings={bookings}
                courts={courts}
                users={users}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onToggleCourtStatus={handleToggleCourtStatus}
                onUpdateCourtPrice={handleUpdateCourtPrice}
                onOpenPaymentModal={setActivePaymentBooking}
                onOpenTicketModal={setActiveTicketBooking}
                onAddAdminUser={handleAddAdminUser}
                onUpdateUserRole={handleUpdateUserRole}
                onDeleteUser={handleDeleteUser}
              />
            ) : (
              <div className="error-page">
                <div style={{ width: 60, height: 60, background: 'var(--status-menunggu-bg)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={28} color="#92400E" />
                </div>
                <div className="error-page-title">Akses Terbatas</div>
                <p className="error-page-desc">
                  Halaman ini hanya untuk Admin. Akun Anda saat ini:{' '}
                  <strong>{currentUser ? `${currentUser.name} (${currentUser.role})` : 'Tamu'}</strong>.
                </p>
                <button className="btn btn-primary" onClick={() => navigate('overview')}>
                  Kembali ke Ringkasan
                </button>
              </div>
            )
          )}

          {/* ========== HALAMAN: LAPORAN TRANSAKSI ========== */}
          {page === 'reports' && (
            isAdmin ? (
              <ReportsPanel bookings={bookings} courts={courts} />
            ) : (
              <div className="error-page">
                <div style={{ width: 60, height: 60, background: 'var(--status-menunggu-bg)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChartNoAxesCombined size={28} color="#92400E" />
                </div>
                <div className="error-page-title">Akses Terbatas</div>
                <p className="error-page-desc">
                  Laporan transaksi hanya tersedia untuk Admin pengelola.
                </p>
                <button className="btn btn-primary" onClick={() => navigate('overview')}>
                  Kembali ke Ringkasan
                </button>
              </div>
            )
          )}

        </main>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* 1. Auth (login/daftar/demo) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => { setIsAuthOpen(false); setAuthContextMessage('') }}
        initialMode={authInitialMode}
        currentUser={currentUser}
        allUsers={users}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onSelectUser={handleSelectUser}
        onLogout={handleLogout}
        contextMessage={authContextMessage}
      />

      {/* 2. Detail lapangan */}
      <CourtDetailsModal
        court={detailedCourt}
        isOpen={!!detailedCourt}
        onClose={() => setDetailedCourt(null)}
        onBookCourt={handleOpenBooking}
      />

      {/* 3. Form pemesanan */}
      <BookingModal
        court={bookingCourt}
        isOpen={!!bookingCourt}
        onClose={() => { setBookingCourt(null); setInitialSlotTime('') }}
        onCreateBooking={handleCreateBooking}
        initialDate={selectedDate}
        initialTime={initialSlotTime}
        existingBookings={bookings}
        currentUser={currentUser}
      />

      {/* 4. Gateway pembayaran (simulasi) */}
      <PaymentGatewayModal
        booking={activePaymentBooking}
        isOpen={!!activePaymentBooking}
        onClose={() => setActivePaymentBooking(null)}
        onSimulateSuccess={handleSimulatePaymentSuccess}
        onSimulateFailure={handleSimulatePaymentFailure}
        onViewTicket={b => { setActivePaymentBooking(null); setActiveTicketBooking(b) }}
      />

      {/* 5. E-Tiket digital */}
      <TicketModal
        booking={activeTicketBooking}
        isOpen={!!activeTicketBooking}
        onClose={() => setActiveTicketBooking(null)}
      />

      {/* Toast notifikasi */}
      {toast && (
        <div
          className="toast-container"
          role="alert"
          aria-live="polite"
        >
          <div className={`toast ${toast.type || 'info'}`}>
            {toast.type === 'success' && <Check size={16} color="var(--badminton)" />}
            {toast.type === 'error' && <AlertCircle size={16} color="#EF4444" />}
            {toast.type === 'info' && <Info size={16} color="var(--futsal)" />}
            {!toast.type && <Check size={16} />}
            <span style={{ flex: 1, fontSize: 13 }}>{toast.msg}</span>
            <button
              onClick={() => setToast(null)}
              className="modal-close"
              aria-label="Tutup notifikasi"
              style={{ width: 24, height: 24 }}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
