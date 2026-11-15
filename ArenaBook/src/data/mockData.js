// mockData.js — Sumber data demo ArenaBook
// Semua tanggal pemesanan bersifat RELATIF terhadap hari ini
// sehingga data selalu terlihat relevan saat demo.
// Data lapangan sesuai kondisi nyata Arena Panggulaan.

// ---- Helper: tanggal relatif dari hari ini ----
function relDate(daysOffset) {
  const d = new Date()
  d.setDate(d.getDate() + daysOffset)
  return d.toISOString().split('T')[0]
}

// ============================================================
// DATA LAPANGAN — sesuai kondisi nyata Arena Panggulaan
// HAPUS semua klaim tidak terverifikasi:
//   - "FIFA Grade", "BWF Standard"
//   - Dimensi "25m x 15m", "13.4m x 6.1m"
//   - Deskripsi "rumput sintetis monofilament"
// ============================================================
export const initialCourts = [
  {
    id: 'FUT-01',
    name: 'Ben Stadium',
    type: 'Futsal',
    price: 150000,
    capacity: '5 vs 5 (10–12 pemain)',
    // Lantai vinyl biru — sesuai warna lapangan asli
    surface: 'Lantai vinyl biru',
    status: 'Tersedia', // 'Tersedia' | 'Pemeliharaan'
    description: 'Lapangan futsal indoor untuk latihan, sparring, dan turnamen kecil.',
    // Fasilitas yang belum dikonfirmasi ditulis sebagai placeholder
    facilities: [
      '[ISI FASILITAS LAPANGAN FUTSAL]'
    ],
    rules: [
      'Wajib menggunakan sepatu futsal',
      'Dilarang merokok di area lapangan',
      'Harap hadir 10 menit sebelum slot dimulai'
    ]
  },
  {
    id: 'BDM-01',
    name: 'Lapangan Bulu Tangkis Panggulaan',
    type: 'Badminton',
    price: 50000,
    capacity: '2–4 pemain (tunggal / ganda)',
    // Lantai hijau — sesuai warna lapangan asli
    surface: 'Lantai hijau',
    status: 'Tersedia',
    description: 'Lapangan badminton indoor untuk permainan tunggal maupun ganda.',
    facilities: [
      '[ISI FASILITAS LAPANGAN BADMINTON]'
    ],
    rules: [
      'Wajib mengenakan sepatu olahraga dalam ruangan',
      'Dilarang memakai sepatu berbekas kotoran ke lapangan',
      'Maksimal 4 pemain per slot'
    ]
  }
]

// ============================================================
// SLOT WAKTU — 08:00 sampai 21:00 (tiap jam)
// Lapangan buka 08.00–22.00; slot terakhir mulai 21:00
// ============================================================
export const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00'
]

// ============================================================
// SEED BOOKINGS — tanggal relatif, variasi status:
//   3 lunas (Terkonfirmasi), 1 menunggu, 1 dibatalkan
// ============================================================
export const seedBookings = [
  {
    id: `AB-${relDate(1).replace(/-/g, '')}-001`,
    court: 'Ben Stadium',
    courtId: 'FUT-01',
    type: 'Futsal',
    date: relDate(1),   // besok
    time: '19:00',
    duration: 2,
    total: 300000,
    payment: 'Berhasil',
    status: 'Terkonfirmasi',
    customer: 'Rizky Pratama',
    phone: '0812-3456-7890',
    method: 'QRIS',
    vaNumber: null,
    createdAt: new Date().toISOString()
  },
  {
    id: `AB-${relDate(2).replace(/-/g, '')}-002`,
    court: 'Lapangan Bulu Tangkis Panggulaan',
    courtId: 'BDM-01',
    type: 'Badminton',
    date: relDate(2),   // 2 hari lagi
    time: '10:00',
    duration: 1,
    total: 50000,
    payment: 'Tertunda',
    status: 'Menunggu Pembayaran',
    customer: 'Nadia Putri',
    phone: '0857-9876-5432',
    method: 'BCA Virtual Account',
    vaNumber: '8808085798765432',
    createdAt: new Date().toISOString()
  },
  {
    id: `AB-${relDate(3).replace(/-/g, '')}-003`,
    court: 'Ben Stadium',
    courtId: 'FUT-01',
    type: 'Futsal',
    date: relDate(3),   // 3 hari lagi
    time: '15:00',
    duration: 1,
    total: 150000,
    payment: 'Berhasil',
    status: 'Terkonfirmasi',
    customer: 'Fajar Ramadhan',
    phone: '0813-1122-3344',
    method: 'Mandiri Virtual Account',
    vaNumber: '8902081311223344',
    createdAt: new Date().toISOString()
  },
  {
    id: `AB-${relDate(-1).replace(/-/g, '')}-004`,
    court: 'Lapangan Bulu Tangkis Panggulaan',
    courtId: 'BDM-01',
    type: 'Badminton',
    date: relDate(-1),  // kemarin
    time: '16:00',
    duration: 2,
    total: 100000,
    payment: 'Berhasil',
    status: 'Terkonfirmasi',
    customer: 'Budi Santoso',
    phone: '0821-9988-7766',
    method: 'QRIS',
    vaNumber: null,
    createdAt: new Date().toISOString()
  },
  {
    id: `AB-${relDate(-2).replace(/-/g, '')}-005`,
    court: 'Ben Stadium',
    courtId: 'FUT-01',
    type: 'Futsal',
    date: relDate(-2),  // 2 hari lalu
    time: '17:00',
    duration: 1,
    total: 150000,
    payment: 'Gagal',
    status: 'Dibatalkan',
    customer: 'Arya Permana',
    phone: '0878-5544-3322',
    method: 'GoPay / E-Wallet',
    vaNumber: null,
    createdAt: new Date().toISOString()
  }
]

// ============================================================
// AKUN DEMO — 1 Admin, 2 Pelanggan
// Kata sandi akun demo tidak ditampilkan di UI
// ============================================================
export const demoUsers = [
  {
    id: 'usr-1',
    name: 'Rizky Pratama',
    email: 'rizky.pratama@example.com',
    phone: '0812-3456-7890',
    role: 'Pelanggan',
    password: 'password123',
    initials: 'RP'
  },
  {
    id: 'usr-2',
    name: 'Nadia Putri',
    email: 'nadia.putri@example.com',
    phone: '0857-9876-5432',
    role: 'Pelanggan',
    password: 'password123',
    initials: 'NP'
  },
  {
    id: 'admin-1',
    name: 'Admin Arena Panggulaan',
    email: 'admin.arena@arenabook.id',
    phone: '0811-0000-8888',
    role: 'Admin',
    password: 'admin123',
    initials: 'AD',
    badge: 'Admin Venue'
  }
]

// ============================================================
// METODE PEMBAYARAN (simulasi)
// ============================================================
export const paymentMethods = [
  {
    id: 'QRIS',
    name: 'QRIS',
    category: 'QR Code',
    desc: 'Scan via GoPay, BCA, OVO, Dana, ShopeePay, dll.',
    icon: 'QrCode',
    badge: 'Instan'
  },
  {
    id: 'BCA Virtual Account',
    name: 'BCA Virtual Account',
    category: 'Virtual Account',
    desc: 'Transfer dari m-BCA atau KlikBCA',
    icon: 'Landmark',
    badge: 'Otomatis'
  },
  {
    id: 'Mandiri Virtual Account',
    name: 'Mandiri Virtual Account',
    category: 'Virtual Account',
    desc: 'Transfer via Livin by Mandiri atau ATM Mandiri',
    icon: 'Building2',
    badge: 'Otomatis'
  },
  {
    id: 'GoPay / E-Wallet',
    name: 'GoPay / E-Wallet',
    category: 'E-Wallet',
    desc: 'Pembayaran dari aplikasi e-wallet',
    icon: 'Smartphone',
    badge: 'Cepat'
  },
  {
    id: 'Tunai (Kasir)',
    name: 'Tunai di Kasir',
    category: 'Tunai',
    desc: 'Bayar langsung ke kasir GOR. Status dikonfirmasi oleh Admin.',
    icon: 'Banknote',
    badge: 'Offline'
  }
]

// ---- Formatter mata uang Rupiah ----
export const money = n =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(n)

// ---- Format tanggal ke Bahasa Indonesia ----
export const dateLabel = value => {
  if (!value) return '-'
  try {
    const parts = value.split('-')
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    }
    return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return value
  }
}
