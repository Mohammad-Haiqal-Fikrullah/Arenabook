# PROMPT PEMBUATAN SLIDE PRESENTASI (PPT) ARENABOOK

Dokumen ini berisi:
1. **Prompt Utama (Siap Salin)** untuk dimasukkan ke AI pembuatan presentasi (ChatGPT, Claude, Gamma.app, Tome, Copilot, dll.).
2. **Struktur Rinci Tiap Slide** (lengkap dengan Latar Belakang, Rumusan Masalah, Batasan Masalah, Metode Pengembangan, dan Alur Sistem).
3. **Poin Pembicaraan (Talking Points)** untuk panduan berbicara saat presentasi di depan dosen/penguji.

---

## 1. PROMPT UNTUK AI (COPY-PASTE SIAP PAKAI)

> **Instruksi Penggunaan:** Salin teks di dalam blok kuotasi di bawah ini dan tempelkan ke AI (seperti ChatGPT, Claude, atau Gamma.app) untuk langsung meng-generate struktur slide PPT lengkap.

```text
Bertindaklah sebagai akademisi dan UI/UX presentation specialist. Buatkan draft slide presentasi PowerPoint (10–12 slide) yang formal, terstruktur, padat, dan persuasif untuk tugas/proyek sistem informasi berikut:

Judul Proyek: "Rancang Bangun Sistem Informasi Pemesanan Lapangan Olahraga Berbasis Web (Studi Kasus: ArenaBook - Arena Panggulaan)"
Objek Sistem: Venue Arena Panggulaan (2 Lapangan: Futsal Ben Stadium & Badminton Lapangan Bulu Tangkis Panggulaan).
Teknologi: Frontend Web (React + Tailwind CSS, Plus Jakarta Sans, Responsive UI).

Struktur presentasi WAJIB memuat poin-poin utama:
1. Latar Belakang Masalah
2. Rumusan Masalah
3. Batasan Masalah
4. Metode Pengembangan Sistem
5. Arsitektur 8 Modul Sistem & Hak Akses Pengguna (RBAC)
6. Alur Transaksi, Pencegahan Bentrok Jadwal, & E-Tiket Digital
7. Kesimpulan dan Rencana Pengembangan

Untuk setiap slide, berikan:
- Judul Slide
- Konten Poin-Poin (Bullet Points ringkas dan tegas, bukan paragraf panjang)
- Rekomendasi Visual/Diagram/Ikon yang cocok
- Script Presentasi (Narasi 2-3 kalimat yang diucapkan presenter)

Tuliskan seluruh isi materi dalam Bahasa Indonesia yang formal dan mudah dipahami.
```

---

## 2. STRUKTUR DETAIL KONTEN PPT (OUTLINE 11 SLIDE)

### SLIDE 1: JUDUL & IDENTITAS
* **Judul Utama:** Rancang Bangun Sistem Informasi Booking Lapangan Olahraga Berbasis Web
* **Sub-judul:** Studi Kasus: ArenaBook – Arena Panggulaan
* **Informasi:** Nama Mahasiswa / Tim Penyusun, NIM, Program Studi, Dosen Pembimbing, Tahun Akademik.
* **Elemen Visual:** Logo ArenaBook (aksen biru & hijau lapangan), mockup perangkat (laptop & smartphone).

---

### SLIDE 2: LATAR BELAKANG MASALAH
* **Poin Masalah Nyata:**
  1. **Pemesanan Manual Tidak Efisien:** Pelanggan harus menghubungi via chat/telepon satu per satu hanya untuk menanyakan slot jam kosong.
  2. **Tingginya Risiko Jadwal Bentrok (Double Booking):** Pencatatan manual di buku kasir sering menimbulkan dua penyewa di jam dan lapangan yang sama.
  3. **Transparansi Tarif & Ketersediaan Rendah:** Pelanggan kesulitan mengetahui fasilitas, tarif per jam, dan kondisi operasional secara real-time.
  4. **Pencatatan Keuangan Rentan Hilang:** Rekap omzet kasir fisik rawan salah hitung dan sulit diaudit saat pergantian shift kasir.
* **Solusi yang Ditawarkan:** Menghadirkan platform reservasi online mandiri dengan validasi bentrok instan, e-tiket digital, dan pelaporan otomatis.

---

### SLIDE 3: RUMUSAN MASALAH
* **Pertanyaan Penelitian / Pengembangan:**
  1. Bagaimana merancang antarmuka sistem booking yang intuitif dan responsif untuk kemudahan akses pelanggan?
  2. Bagaimana membangun logika validasi ketersediaan jadwal slot jam secara otomatis guna mencegah terjadinya tabrakan jadwal (*collision avoidance*)?
  3. Bagaimana mengimplementasikan kontrol hak akses peran (*Role-Based Access Control*) yang memisahkan otoritas antara Pelanggan dan Admin?
  4. Bagaimana menyajikan rekapitulasi laporan transaksi keuangan yang akurat berbasis status pembayaran terverifikasi?

---

### SLIDE 4: BATASAN MASALAH
* **Batasan Sistem:**
  1. **Ruang Lingkup Objek:** Sistem difokuskan untuk 1 venue tunggal (Arena Panggulaan) dengan 2 lapangan resmi: Futsal (Ben Stadium) dan Badminton (Lapangan Bulu Tangkis Panggulaan).
  2. **Simulasi Transaksi (Mode Demo):** Proses transaksi menggunakan antarmuka simulasi payment gateway (QRIS, VA BCA/Mandiri, E-Wallet, dan Kasir Tunai) tanpa penarikan dana perbankan riil.
  3. **Hak Akses 2 Peran:**
     - **Pelanggan:** Registrasi mandiri, melihat jadwal, booking lapangan, simulasi pembayaran, mengunduh E-Tiket.
     - **Admin:** Mengelola status lapangan (Tersedia/Pemeliharaan), penyesuaian tarif, konfirmasi kasir tunai, kelola peran pengguna, dan ekspor laporan transaksi.
  4. **Penyimpanan Status:** Berbasis client-side data store lokal yang tersinkronisasi untuk kebutuhan prototipe dan demonstrasi sidang/tugas akhir.

---

### SLIDE 5: METODE PENGEMBANGAN SISTEM
* **Metodologi:** *Prototyping Model / SDLC (Software Development Life Cycle)*
* **Tahapan Kerja:**
  1. **Analisis Kebutuhan (Requirement Gathering):** Mengidentifikasi kendala reservasi dan menetapkan 8 modul utama sistem informasi booking.
  2. **Perancangan Desain (UI/UX Design):** Menerapkan tema terang (*light theme*), palet warna berbasis lantai lapangan asli (Biru Vinyl & Hijau Badminton), tipografi tunggal *Plus Jakarta Sans*.
  3. **Implementasi Kode (Coding & Development):** Membangun komponen berbasis modular, single data-store, fungsi pencegahan bentrok, serta proteksi hak akses.
  4. **Pengujian Sistem (Testing & Evaluation):** Menguji validasi form (email/WA/password), deteksi bentrok jadwal, simulasi bayar sukses/gagal, dan proteksi URL halaman admin.

---

### SLIDE 6: ARSITEKTUR & 8 MODUL SISTEM
* **Daftar 8 Modul Fungsional ArenaBook:**
  1. **Modul 1 – Registrasi & Login:** Form validasi ketat, otomatis role Pelanggan, proteksi pembuatan akun admin.
  2. **Modul 2 – Informasi Lapangan:** Spesifikasi teknis (lantai, kapasitas, jam buka) tanpa klaim fiktif.
  3. **Modul 3 – Jadwal & Ketersediaan:** Grid slot waktu 08.00–22.00, penonaktifan otomatis slot terisi/lewat waktu.
  4. **Modul 4 – Pemesanan Online:** Perhitungan dinamis `Total = Tarif × Durasi`, nomor kode booking unik (`AB-YYYYMMDD-XXX`).
  5. **Modul 5 – Pembayaran (Simulasi):** Multi-metode (QRIS, VA Bank, E-Wallet, Kasir Tunai) dengan timer mundur 15 menit.
  6. **Modul 6 – Riwayat & Status Booking:** Filter pencarian status (Terkonfirmasi, Menunggu, Dibatalkan).
  7. **Modul 7 – Dashboard & Manajemen Admin:** Konfirmasi pelunasan kasir, ubah tarif, set mode pemeliharaan lapangan.
  8. **Modul 8 – Laporan & Analitik Keuangan:** Audit transaksi berdasarkan rentang tanggal, jenis lapangan, dan ekspor CSV.

---

### SLIDE 7: HAK AKSES PENGGUNA (ROLE-BASED ACCESS CONTROL)
* **Tabel Matriks Akses:**
  | Fitur Sistem | Pelanggan | Admin Pengelola |
  |---|:---:|:---:|
  | Registrasi Akun Umum | ✅ (Otomatis Pelanggan) | ❌ (Dibuat Khusus via Admin) |
  | Login Sistem | ✅ | ✅ |
  | Eksplorasi Katalog & Jadwal | ✅ | ✅ |
  | Pemesanan & Pembayaran | ✅ | ✅ |
  | E-Tiket Digital Pass | ✅ (Hanya booking sendiri) | ✅ (Semua booking) |
  | Manajemen Tarif & Lapangan | ❌ (Akses Ditolak) | ✅ |
  | Konfirmasi Kasir Tunai | ❌ (Akses Ditolak) | ✅ |
  | Manajemen Akun Pengguna | ❌ (Akses Ditolak) | ✅ |
  | Laporan Transaksi & Ekspor CSV| ❌ (Akses Ditolak) | ✅ |
* **Prinsip Keamanan:** Registrasi publik tidak menyediakan opsi pemilihan role Admin untuk mencegah eskalasi wewenang sepihak (*Privilege Escalation*).

---

### SLIDE 8: LOGIKA PENCEGAHAN BENTROK JADWAL (CORE LOGIC)
* **Algoritma Validasi Jadwal:**
  - Setiap slot waktu diuji terhadap database pemesanan aktif pada tanggal dan lapangan yang sama.
  - Slot berdurasi multi-jam (misal: 2 jam mulai pukul 19:00) otomatis mengunci jam 19:00 dan jam 20:00.
  - Lapangan berstatus **Pemeliharaan** secara sistematis mengunci seluruh slot jam pada tanggal yang dipilih.
* **Alur Penanganan:**
  - Jika terjadi tabrakan: Sistem menampilkan peringatan bentrok dan menonaktifkan tombol pemesanan.
  - Jika aman: Sistem mencatat pemesanan dengan status `Menunggu Pembayaran`.

---

### SLIDE 9: E-TIKET DIGITAL & KASIR CHECK-IN
* **Karakteristik E-Tiket:**
  - Hanya dapat diterbitkan jika transaksi berstatus **Terkonfirmasi (Lunas)**.
  - Memuat kode booking alfanumerik unik, tanggal, jam sewa, nama pemesan, dan total biaya.
  - Dilengkapi kode QR untuk simulasi validasi check-in fisik di gerbang masuk lapangan.
  - Fitur **Cetak E-Tiket** langsung terhubung ke utilitas cetak browser (*Print to PDF*).

---

### SLIDE 10: HASIL IMPLEMENTASI & KEUNGGULAN UI/UX
* **Karakteristik Desain Baru (V2):**
  - **Tema Terang Bersih (*Clean Light Theme*):** Meningkatkan keterbacaan (*contrast ratio* 4.5:1), bebas dari efek gelap neon berlebihan.
  - **Identitas Warna Nyata:** Biru Vinyl untuk Futsal Ben Stadium dan Hijau untuk Lapangan Badminton.
  - **Responsif & Aksesibilitas:** Nyaman digunakan di layar smartphone (360px) maupun monitor desktop.
  - **Transparansi Data:** Semua angka statistik dan pendapatan dihitung otomatis dari transaksi riil yang lunas.

---

### SLIDE 11: KESIMPULAN & SARAN PENGEMBANGAN
* **Kesimpulan:**
  1. Sistem informasi ArenaBook berhasil mengotomatisasi proses reservasi lapangan olahraga secara efisien dan transparan.
  2. Fitur validasi slot waktu berhasil mengeliminasi potensi jadwal ganda (*double booking*).
  3. Pembagian peran hak akses (Pelanggan vs Admin) menjamin keamanan operasional dan akuntabilitas pelaporan keuangan.
* **Saran Pengembangan Lanjutan:**
  1. Integrasi API Payment Gateway riil (Midtrans/Xendit) dengan verifikasi *webhook*.
  2. Implementasi notifikasi pengingat jadwal otomatis melalui WhatsApp API / SMS Gateway.
  3. Pengembangan backend database terpusat (PostgreSQL/MySQL) dengan otentikasi JWT (*JSON Web Token*).

---

## 3. PANDUAN PRESENTASI (TALKING POINTS SINGKAT)

- **Saat menjelaskan Latar Belakang:** *"Banyak pengelola lapangan olahraga saat ini masih mengandalkan buku catatan fisik atau WhatsApp, yang sering berujung pada double booking dan komplain pelanggan. ArenaBook hadir sebagai solusi digital mandiri."*
- **Saat menjelaskan Batasan Masalah:** *"Perlu kami garis bawahi bahwa sistem ini difokuskan pada studi kasus venue Arena Panggulaan dengan 2 lapangan, dan modul pembayaran saat ini menggunakan simulasi front-end demi keamanan pengujian akademik."*
- **Saat menjelaskan Demo Hak Akses:** *"Dari segi keamanan, pengguna umum yang mendaftar secara otomatis mendapat hak akses Pelanggan. Akun Admin tidak dapat dibuat sembarangan melalui halaman registrasi umum."*
- **Saat Penutup:** *"Dengan demikian, ArenaBook tidak hanya mempermudah penyewa dalam memilih jadwal, namun juga memberikan kendali penuh kepada pengelola dalam memantau pendapatan venue secara real-time."*

