// AuthModal.jsx — Modal Masuk dan Daftar ArenaBook
// - Tab "Masuk": email/WA + kata sandi, ikon di dalam input
// - Tab "Daftar": nama, email, WA, kata sandi, konfirmasi, checkbox ketentuan
// - Registrasi selalu role Pelanggan (tidak ada pilihan role di UI)
// - Mode Demo: 2 tombol outline tanpa menampilkan kata sandi di layar
// Catatan keamanan: role ditentukan di sini hanya untuk demo.
// Pada versi final, server yang menentukan role setelah verifikasi.

import { useState, useEffect } from 'react'
import {
  X, Eye, EyeOff, Mail, Phone, User, Lock,
  LogIn, UserPlus, AlertCircle, Check, ChevronRight
} from 'lucide-react'

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  currentUser,
  allUsers = [],
  onLogin,
  onRegister,
  onSelectUser,
  onLogout,
  contextMessage = ''
}) {
  // 'login' | 'register' | 'demo'
  const [tab, setTab] = useState(initialMode)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // --- State form masuk ---
  const [loginId, setLoginId] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [showLoginPass, setShowLoginPass] = useState(false)
  const [rememberMe, setRememberMe] = useState(false) // default TIDAK tercentang

  // --- State form daftar ---
  const [reg, setReg] = useState({
    name: '', email: '', phone: '',
    password: '', confirmPassword: '', agreeTerms: false
  })
  const [showRegPass, setShowRegPass] = useState(false)
  const [showRegConfirm, setShowRegConfirm] = useState(false)

  // Reset saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setTab(initialMode || 'login')
      setError('')
      setSuccess('')
      setLoginId('')
      setLoginPass('')
      setShowLoginPass(false)
      setRememberMe(false)
      setReg({ name: '', email: '', phone: '', password: '', confirmPassword: '', agreeTerms: false })
    }
  }, [isOpen, initialMode])

  if (!isOpen) return null

  // ---- Handler Masuk ----
  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!loginId.trim() || !loginPass) {
      setError('Mohon isi email/nomor WhatsApp dan kata sandi.')
      return
    }

    const result = onLogin(loginId.trim(), loginPass)
    if (result.success) {
      setSuccess('Masuk berhasil!')
      setTimeout(onClose, 500)
    } else {
      setError(result.message)
    }
  }

  // ---- Handler Daftar ----
  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validasi field
    if (!reg.name.trim()) { setError('Nama lengkap tidak boleh kosong.'); return }
    if (!reg.email.trim()) { setError('Email tidak boleh kosong.'); return }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(reg.email.trim())) { setError('Format email tidak valid.'); return }

    // Validasi format WhatsApp: harus 08xx atau +62
    const waRegex = /^(08\d{8,11}|(\+62)\d{9,12})$/
    const cleanPhone = reg.phone.replace(/[-\s]/g, '')
    if (!waRegex.test(cleanPhone)) { setError('Nomor WhatsApp tidak valid. Gunakan format 08xx atau +62xx.'); return }

    // Validasi kata sandi minimal 8 karakter
    if (reg.password.length < 8) { setError('Kata sandi minimal 8 karakter.'); return }

    // Validasi konfirmasi kata sandi
    if (reg.password !== reg.confirmPassword) { setError('Konfirmasi kata sandi tidak cocok.'); return }

    // Validasi persetujuan ketentuan
    if (!reg.agreeTerms) { setError('Anda harus menyetujui Ketentuan Layanan untuk mendaftar.'); return }

    // Cek email sudah terdaftar
    const emailExists = allUsers.some(u => u.email.toLowerCase() === reg.email.trim().toLowerCase())
    if (emailExists) { setError('Email sudah terdaftar. Silakan masuk atau gunakan email lain.'); return }

    // Cek nomor WA sudah terdaftar
    const phoneExists = allUsers.some(u => u.phone.replace(/[-\s]/g, '') === cleanPhone)
    if (phoneExists) { setError('Nomor WhatsApp sudah terdaftar.'); return }

    const initials = reg.name.trim().split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    const newUser = {
      id: `usr-${Date.now()}`,
      name: reg.name.trim(),
      email: reg.email.trim().toLowerCase(),
      phone: reg.phone.trim(),
      password: reg.password,
      role: 'Pelanggan', // Selalu Pelanggan — keamanan: server harus menolak role lain
      initials: initials || 'U'
    }

    const result = onRegister(newUser)
    if (result.success) {
      setSuccess('Akun berhasil dibuat! Selamat datang.')
      setTimeout(onClose, 600)
    } else {
      setError(result.message || 'Pendaftaran gagal. Coba lagi.')
    }
  }

  // ---- Demo: masuk cepat tanpa kata sandi di layar ----
  const handleQuickLogin = (role) => {
    const user = allUsers.find(u => u.role === role)
    if (user) {
      onSelectUser(user)
      onClose()
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Masuk atau Daftar">
      <div className="modal-box" style={{ maxWidth: 480 }}>
        {/* Header modal */}
        <div className="modal-header">
          <div>
            <div className="modal-title">
              {tab === 'demo' ? 'Mode Demo — Pilih Akun' : tab === 'register' ? 'Buat Akun ArenaBook' : 'Masuk ke ArenaBook'}
            </div>
            {contextMessage && (
              <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2 }}>{contextMessage}</p>
            )}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Tutup modal">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Tab Masuk / Daftar */}
          {tab !== 'demo' && (
            <div className="auth-tabs" style={{ marginBottom: 20 }}>
              <button
                className={`auth-tab${tab === 'login' ? ' active' : ''}`}
                onClick={() => { setTab('login'); setError(''); setSuccess('') }}
              >
                <LogIn size={15} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                Masuk
              </button>
              <button
                className={`auth-tab${tab === 'register' ? ' active' : ''}`}
                onClick={() => { setTab('register'); setError(''); setSuccess('') }}
              >
                <UserPlus size={15} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                Daftar
              </button>
            </div>
          )}

          {/* Pesan error/sukses */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              background: '#FEE2E2', border: '1px solid #FCA5A5',
              borderRadius: 'var(--radius-sm)', padding: '10px 12px',
              marginBottom: 14, fontSize: 13, color: '#991B1B'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--status-lunas-bg)', border: '1px solid #86EFAC',
              borderRadius: 'var(--radius-sm)', padding: '10px 12px',
              marginBottom: 14, fontSize: 13, color: 'var(--status-lunas-ink)'
            }}>
              <Check size={16} />
              <span>{success}</span>
            </div>
          )}

          {/* ========== FORM MASUK ========== */}
          {tab === 'login' && (
            <form className="auth-form" onSubmit={handleLoginSubmit} noValidate>
              {/* Email / Nomor WA */}
              <div className="form-group">
                <label className="form-label" htmlFor="login-id">Email atau Nomor WhatsApp</label>
                <div className="input-wrapper">
                  <span className="input-icon"><Mail size={18} /></span>
                  <input
                    id="login-id"
                    type="text"
                    className="form-input"
                    placeholder="nama@email.com atau 08xxxxxxxxxx"
                    value={loginId}
                    onChange={e => setLoginId(e.target.value)}
                    autoComplete="username"
                    required
                    style={{ paddingLeft: 42 }}
                  />
                </div>
              </div>

              {/* Kata sandi */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" htmlFor="login-pass">Kata Sandi</label>
                  <button
                    type="button"
                    className="auth-forgot"
                    onClick={() => alert('Hubungi admin untuk reset kata sandi:\n[ISI NOMOR WHATSAPP GOR]')}
                  >
                    Lupa kata sandi?
                  </button>
                </div>
                <div className="input-wrapper">
                  <span className="input-icon"><Lock size={18} /></span>
                  <input
                    id="login-pass"
                    type={showLoginPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Masukkan kata sandi"
                    value={loginPass}
                    onChange={e => setLoginPass(e.target.value)}
                    autoComplete="current-password"
                    required
                    style={{ paddingLeft: 42, paddingRight: 42 }}
                  />
                  <button
                    type="button"
                    className="input-action"
                    onClick={() => setShowLoginPass(v => !v)}
                    aria-label={showLoginPass ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showLoginPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Ingat saya (default TIDAK tercentang) */}
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <span>Ingat saya di perangkat ini</span>
              </label>

              {/* Tombol masuk */}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 4 }}>
                <LogIn size={17} /> Masuk
              </button>

              {/* Mode demo */}
              <div className="auth-demo">
                <p className="auth-demo-label">Mode demo: coba tanpa mendaftar</p>
                <div className="auth-demo-btns">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleQuickLogin('Pelanggan')}
                  >
                    Sebagai Pelanggan
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleQuickLogin('Admin')}
                  >
                    Sebagai Admin
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ========== FORM DAFTAR ========== */}
          {tab === 'register' && (
            <form className="auth-form" onSubmit={handleRegisterSubmit} noValidate>
              {/* Nama Lengkap */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">Nama Lengkap</label>
                <div className="input-wrapper">
                  <span className="input-icon"><User size={18} /></span>
                  <input
                    id="reg-name"
                    type="text"
                    className="form-input"
                    placeholder="Nama lengkap Anda"
                    value={reg.name}
                    onChange={e => setReg(r => ({ ...r, name: e.target.value }))}
                    autoComplete="name"
                    required
                    style={{ paddingLeft: 42 }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email</label>
                <div className="input-wrapper">
                  <span className="input-icon"><Mail size={18} /></span>
                  <input
                    id="reg-email"
                    type="email"
                    className="form-input"
                    placeholder="nama@email.com"
                    value={reg.email}
                    onChange={e => setReg(r => ({ ...r, email: e.target.value }))}
                    autoComplete="email"
                    required
                    style={{ paddingLeft: 42 }}
                  />
                </div>
              </div>

              {/* Nomor WhatsApp */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-phone">Nomor WhatsApp</label>
                <div className="input-wrapper">
                  <span className="input-icon"><Phone size={18} /></span>
                  <input
                    id="reg-phone"
                    type="tel"
                    className="form-input"
                    placeholder="08xxxxxxxxxx atau +62xxxxxxxxxx"
                    value={reg.phone}
                    onChange={e => setReg(r => ({ ...r, phone: e.target.value }))}
                    autoComplete="tel"
                    required
                    style={{ paddingLeft: 42 }}
                  />
                </div>
              </div>

              {/* Kata sandi */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-pass">Kata Sandi</label>
                <div className="input-wrapper">
                  <span className="input-icon"><Lock size={18} /></span>
                  <input
                    id="reg-pass"
                    type={showRegPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Minimal 8 karakter"
                    value={reg.password}
                    onChange={e => setReg(r => ({ ...r, password: e.target.value }))}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    style={{ paddingLeft: 42, paddingRight: 42 }}
                  />
                  <button
                    type="button"
                    className="input-action"
                    onClick={() => setShowRegPass(v => !v)}
                    aria-label={showRegPass ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showRegPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                <span className="form-hint">Minimal 8 karakter.</span>
              </div>

              {/* Konfirmasi kata sandi */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">Konfirmasi Kata Sandi</label>
                <div className="input-wrapper">
                  <span className="input-icon"><Lock size={18} /></span>
                  <input
                    id="reg-confirm"
                    type={showRegConfirm ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Ulangi kata sandi"
                    value={reg.confirmPassword}
                    onChange={e => setReg(r => ({ ...r, confirmPassword: e.target.value }))}
                    autoComplete="new-password"
                    required
                    style={{ paddingLeft: 42, paddingRight: 42 }}
                  />
                  <button
                    type="button"
                    className="input-action"
                    onClick={() => setShowRegConfirm(v => !v)}
                    aria-label={showRegConfirm ? 'Sembunyikan konfirmasi' : 'Tampilkan konfirmasi'}
                  >
                    {showRegConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {reg.confirmPassword && reg.password !== reg.confirmPassword && (
                  <span className="form-error">Kata sandi tidak cocok.</span>
                )}
                {reg.confirmPassword && reg.password === reg.confirmPassword && reg.password.length >= 8 && (
                  <span style={{ fontSize: 12, color: 'var(--status-lunas-ink)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Check size={12} /> Kata sandi cocok
                  </span>
                )}
              </div>

              {/* Persetujuan ketentuan */}
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={reg.agreeTerms}
                  onChange={e => setReg(r => ({ ...r, agreeTerms: e.target.checked }))}
                  required
                />
                <span>
                  Saya menyetujui{' '}
                  <button
                    type="button"
                    style={{ color: 'var(--futsal)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}
                    onClick={() => alert('Ketentuan Layanan ArenaBook:\n• Pemesanan bersifat mengikat setelah pembayaran dikonfirmasi.\n• Pembatalan lebih dari 1 jam sebelum jadwal tidak mendapat refund.')}
                  >
                    Ketentuan Layanan
                  </button>
                </span>
              </label>

              {/* Catatan peran akun */}
              <div style={{
                background: 'var(--futsal-soft)', border: '1px solid #c3d7f7',
                borderRadius: 'var(--radius-sm)', padding: '10px 12px',
                fontSize: 12, color: 'var(--futsal)', display: 'flex', gap: 7, alignItems: 'flex-start'
              }}>
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>
                  Akun yang didaftarkan otomatis mendapat peran <strong>Pelanggan</strong>.
                  Pembuatan akun Admin hanya dapat dilakukan oleh Admin melalui panel pengelolaan.
                </span>
              </div>

              {/* Tombol buat akun */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 4 }}
                disabled={!reg.agreeTerms}
              >
                <UserPlus size={17} /> Buat Akun
              </button>

              {/* Tautan ke masuk */}
              <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-muted)' }}>
                Sudah punya akun?{' '}
                <button
                  type="button"
                  style={{ color: 'var(--futsal)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}
                  onClick={() => { setTab('login'); setError('') }}
                >
                  Masuk sekarang <ChevronRight size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </button>
              </p>
            </form>
          )}

          {/* ========== PANEL MODE DEMO ========== */}
          {tab === 'demo' && (
            <div>
              <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 16 }}>
                Pilih akun demo untuk menjelajahi fitur aplikasi tanpa perlu mendaftar.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Tombol demo pelanggan */}
                <button
                  className="btn btn-outline"
                  style={{ justifyContent: 'flex-start', gap: 12 }}
                  onClick={() => handleQuickLogin('Pelanggan')}
                >
                  <div style={{ width: 36, height: 36, background: 'var(--futsal-soft)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={18} color="var(--futsal)" />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Masuk sebagai Pelanggan</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>Pesan lapangan, bayar, lihat riwayat</div>
                  </div>
                </button>

                {/* Tombol demo admin */}
                <button
                  className="btn btn-outline"
                  style={{ justifyContent: 'flex-start', gap: 12 }}
                  onClick={() => handleQuickLogin('Admin')}
                >
                  <div style={{ width: 36, height: 36, background: '#FEF3C7', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={18} color="#92400E" />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Masuk sebagai Admin</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>Dashboard, kelola lapangan, laporan</div>
                  </div>
                </button>
              </div>

              {/* Daftar akun aktif */}
              {allUsers.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                    Akun Tersedia
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {allUsers.map(u => (
                      <button
                        key={u.id}
                        className="btn btn-outline btn-sm"
                        style={{ justifyContent: 'flex-start', gap: 10 }}
                        onClick={() => { onSelectUser(u); onClose() }}
                      >
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                          background: u.role === 'Admin' ? '#FEF3C7' : 'var(--futsal-soft)',
                          color: u.role === 'Admin' ? '#92400E' : 'var(--futsal)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 800
                        }}>
                          {u.initials || u.name[0]}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{u.role}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Logout jika sudah login */}
              {currentUser && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ width: '100%', color: 'var(--status-batal-ink)' }}
                    onClick={() => { onLogout(); onClose() }}
                  >
                    Keluar dari {currentUser.name}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
