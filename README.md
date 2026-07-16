# Manajemen Kost V2

Aplikasi Web Manajemen Kost digital berbasis **Next.js 15 (App Router)** dan **Express.js + Prisma ORM + PostgreSQL/Supabase** untuk membantu pemilik kost mengelola kamar, data penghuni, dan pencatatan riwayat pembayaran bulanan secara digital, efisien, dan otomatis.

---

## 🛠️ Tech Stack & Arsitektur

### 1. Frontend
* **Core Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4 (dengan kustomisasi warna hijau logo Kontrakan Pak Iman)
* **UI Components:** Shadcn UI & Lucide React
* **State Management:** Custom React Hooks (`useKamar`, `usePenghuni`, `usePembayaran`) dengan Shared State Listener Dispatch untuk sinkronisasi antarkomponen secara real-time.

### 2. Backend
* **Runtime:** Node.js
* **Framework API:** Express.js
* **ORM:** Prisma ORM
* **Database:** PostgreSQL (Hosted on Supabase)

---

## ✨ Fitur Utama

### 📊 Dashboard Dinamis (`/`)
* **Statistik Utama:** Total kamar, Kamar terisi, Kamar kosong, dan total Pendapatan bulan berjalan.
* **Tabel Penghuni Terbaru:** Daftar 5 penghuni yang baru masuk sebulan terakhir dengan scrollarea.
* **Tabel Tagihan Terlambat:** Menampilkan daftar penghuni dengan status pembayaran terlambat secara alfabetis (A-Z).
* **Dropdown Notifikasi:** Polling otomatis setiap 5 detik yang mendeteksi perubahan status pembayaran terlambat baru secara langsung tanpa refresh halaman.

### 🚪 Manajemen Kamar (`/kamar`)
* **Fitur Pencarian:** Cari kamar secara instan berdasarkan nomor kamar atau tipe kamar.
* **Filter Status:** Filter kamar berdasarkan kategori *Tersedia*, *Terisi*, dan *Maintenance*.
* **Tabel Scroll Snapping:** Tampilan tabel modern yang dibatasi visual maksimal 9 kamar dengan efek snapping per baris kamar untuk menghindari scroll bar ganda.
* **Detail Kamar (`/kamar/[id]`):** Berisi informasi detail kamar, riwayat penghuni yang pernah menempati, dan riwayat pembayaran khusus kamar tersebut.

### 👥 Manajemen Penghuni (`/penghuni`)
* **Filter Tab Aktif/Alumni:** Memisahkan data penghuni yang masih menyewa dan mantan penghuni (alumni).
* **Pencarian Nama:** Cari nama penghuni secara instan.
* **Urutan Tanggal:** Mengurutkan daftar penghuni berdasarkan tanggal masuk (Terbaru / Terlama).
* **Aksi CRUD:** Tambah, edit, hapus, serta fitur *Checkout* (otomatis mengubah status kamar terkait menjadi tersedia).
* **Detail Penghuni (`/penghuni/[id]`):** Berisi berkas data diri lengkap, informasi kamar yang ditempati, dan riwayat pembayaran lengkap milik penghuni.

### 💳 Manajemen Pembayaran (`/pembayaran`)
* **Pencatatan Transaksi:** Formulir tambah/edit transaksi pembayaran sewa bulanan.
* **Filter Fleksibel:** Filter berdasarkan status pembayaran (*Lunas*, *Belum Bayar*, *Terlambat*) dan filter berdasarkan Tahun Pembayaran.
* **Detail Pembayaran (`/pembayaran/[id]`):** Menampilkan rincian struk invoice pembayaran sewa bulanan.

---

## 🔑 Kredensial Login Default (Admin)

Untuk masuk ke dashboard panel administrasi, gunakan akun administrator default berikut:
* **Email:** `firmanajah366@gmail.com`
* **Kata Sandi:** `Iman12345`

---

## 🚀 Panduan Menjalankan Project Secara Lokal

### Prasyarat
* Node.js versi 18 ke atas.
* Git terpasang di sistem.

### Langkah 1: Kloning Repositori
```bash
git clone https://github.com/moch-firmansyahh/manajemen-kost-v2.git
cd manajemen-kost-v2
```

### Langkah 2: Konfigurasi & Jalankan Backend
1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Pasang dependensi:
   ```bash
   npm install
   ```
3. Salin file `.env.example` ke `.env` dan konfigurasikan url database PostgreSQL Supabase Anda:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
   PORT=5000
   JWT_SECRET="rahasia_kost_pak_iman"
   ```
4. Push skema prisma ke database:
   ```bash
   npx prisma db push
   ```
5. Jalankan seed data untuk mengisi database dengan data kamar (A1-A20 & B1-B20), data penghuni fiktif 2024-2026, dan riwayat pembayaran:
   ```bash
   npx prisma db seed
   ```
6. Jalankan server backend dalam mode pengembangan:
   ```bash
   npm run dev
   ```

### Langkah 3: Jalankan Frontend
1. Buka terminal baru dan masuk ke direktori frontend:
   ```bash
   cd frontend
   ```
2. Pasang dependensi:
   ```bash
   npm install
   ```
3. Jalankan server frontend dalam mode pengembangan:
   ```bash
   npm run dev
   ```
4. Aplikasi dapat diakses di browser pada alamat [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Verifikasi Build Produksi (Frontend)
Untuk memverifikasi kesiapan deployment frontend ke server produksi:
```bash
cd frontend
npm run build
```
Proyek frontend dikonfigurasi dengan pemeriksaan tipe TypeScript ketat dan dijamin lulus kompilasi 100% tanpa error.
