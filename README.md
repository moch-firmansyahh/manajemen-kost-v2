<div align="center">

# 🏠 Kontrakan Pa Iman

### Sistem Manajemen Kost Digital

Aplikasi web **full-stack** untuk membantu pemilik kost mengelola kamar, data penghuni, dan pencatatan pembayaran sewa bulanan secara digital, efisien, dan otomatis.

**[Demo Live](https://manajemen-kost-nine.vercel.app)** · **[Laporkan Bug](https://github.com/moch-firmansyahh/manajemen-kost-v2/issues)**

</div>

---

## 📋 Daftar Isi

- [Tech Stack](#-tech-stack)
- [Fitur Utama](#-fitur-utama)
- [Struktur Folder](#-struktur-folder)
- [Panduan Instalasi](#-panduan-instalasi)
- [Kredensial Login](#-kredensial-login)
- [Progressive Web App](#-progressive-web-app-pwa)
- [Build Produksi](#-build-produksi)

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Bahasa** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **UI Library** | Shadcn UI, Lucide React |
| **State** | Custom Hooks + Shared Listener Dispatch |
| **Backend** | Express.js + Node.js |
| **ORM** | Prisma ORM |
| **Database** | PostgreSQL (Supabase) |
| **Deployment** | Vercel |
| **PWA** | Web App Manifest + Standalone Mode |

---

## ✨ Fitur Utama

### 📊 Dashboard (`/`)
- Statistik real-time: total kamar, kamar terisi, kamar kosong, pendapatan bulan berjalan
- Tabel penghuni terbaru dengan scroll-snap per baris (maks 4 tampil)
- Tabel tagihan belum lunas dengan scroll-snap per baris (maks 4 tampil)
- Dropdown notifikasi dengan polling otomatis setiap 5 detik

### 🚪 Manajemen Kamar (`/kamar`)
- Pencarian instan berdasarkan nomor atau tipe kamar
- Filter berdasarkan status: *Tersedia*, *Terisi*, *Maintenance*
- Tabel dengan scroll-snap per baris (maks 9 tampil)
- CRUD lengkap: tambah, edit, hapus kamar
- Detail kamar (`/kamar/[id]`): riwayat penghuni & pembayaran

### 👥 Manajemen Penghuni (`/penghuni`)
- Tab filter: Penghuni Aktif & Alumni
- Pencarian berdasarkan nama & urutan tanggal masuk
- CRUD lengkap + fitur Checkout (otomatis update status kamar)
- Detail penghuni (`/penghuni/[id]`): data diri, kamar, riwayat pembayaran

### 💳 Manajemen Pembayaran (`/pembayaran`)
- Pencatatan transaksi pembayaran sewa bulanan
- Filter berdasarkan status (*Lunas*, *Belum Bayar*, *Terlambat*) & tahun
- Detail pembayaran (`/pembayaran/[id]`): struk invoice

### 🎨 UI/UX
- **Tema Ganda**: Light & Dark mode (default: Light)
- **Animasi Transisi**: Welcome Screen (cold start) & House Loader (navigasi antar halaman)
- **Responsive**: Mendukung breakpoint `sm`, `md`, `lg` di semua halaman
- **PWA**: Dapat diinstal sebagai aplikasi di HP (Android & iOS)

---

## 📁 Struktur Folder

```
manajemen-kost-v2/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Skema database (Kamar, Penghuni, Pembayaran, User)
│   │   └── seed.ts                # Seed data dummy (40 kamar, penghuni, pembayaran)
│   └── src/
│       ├── index.ts               # Entry point Express server
│       ├── routes/                 # API routes (auth, kamar, penghuni, pembayaran)
│       └── middleware/             # Auth middleware (JWT)
│
├── frontend/
│   ├── public/
│   │   ├── Logo-Kost.png          # Logo asli (landscape)
│   │   ├── Logo-Kost-Square.png   # Logo kotak untuk ikon PWA
│   │   └── manifest.json          # Konfigurasi PWA
│   └── src/
│       ├── app/
│       │   ├── layout.tsx         # Root layout (Sidebar, ThemeProvider, PWA)
│       │   ├── page.tsx           # Dashboard
│       │   ├── login/page.tsx     # Halaman login
│       │   ├── kamar/             # Halaman & detail kamar
│       │   ├── penghuni/          # Halaman & detail penghuni
│       │   ├── pembayaran/        # Halaman & detail pembayaran
│       │   └── profile/           # Profil & ganti sandi
│       ├── components/
│       │   ├── ui/                # Komponen Shadcn UI + HouseLoader + WelcomeScreen
│       │   ├── layout/            # Sidebar & Navbar
│       │   ├── dashboard/         # StatCard
│       │   ├── kamar/             # KamarTable, KamarForm, KamarBadge
│       │   ├── penghuni/          # PenghuniTable, PenghuniForm, PenghuniCard
│       │   └── pembayaran/        # PembayaranTable, PembayaranForm, StatusBadge
│       ├── hooks/
│       │   ├── useKamar.ts        # CRUD kamar via API
│       │   ├── usePenghuni.ts     # CRUD penghuni via API
│       │   └── usePembayaran.ts   # CRUD pembayaran via API
│       ├── lib/
│       │   └── utils.ts           # Helper: cn(), format tanggal, format rupiah
│       └── types/
│           └── index.ts           # Definisi tipe & interface TypeScript
```

---

## 🚀 Panduan Instalasi

### Prasyarat
- **Node.js** versi 18+
- **Git** terpasang di sistem
- **Database PostgreSQL** (disarankan menggunakan [Supabase](https://supabase.com))

### 1. Kloning Repositori

```bash
git clone https://github.com/moch-firmansyahh/manajemen-kost-v2.git
cd manajemen-kost-v2
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/` dengan isi:

```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
PORT=5000
JWT_SECRET="rahasia_kost_pak_iman"
```

Jalankan migrasi & seed database:

```bash
npx prisma db push
npx prisma db seed
```

Jalankan server backend:

```bash
npm run dev
```

### 3. Setup Frontend

Buka terminal baru:

```bash
cd frontend
npm install
npm run dev
```

Akses aplikasi di browser: **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Kredensial Login

| Field | Nilai |
|---|---|
| **Email** | `firmanajah366@gmail.com` |
| **Password** | `Iman12345` |

---

## 📱 Progressive Web App (PWA)

Aplikasi ini mendukung instalasi langsung di HP tanpa melalui App Store:

1. Buka website di browser HP (Chrome / Safari)
2. Ketuk menu **⋮** → **"Add to Home Screen"** (Android) atau **Share** → **"Add to Home Screen"** (iOS)
3. Aplikasi akan terpasang di layar utama dengan tampilan fullscreen tanpa URL bar

---

## 🏗️ Build Produksi

```bash
cd frontend
npm run build
```

> Proyek dikonfigurasi dengan pemeriksaan tipe TypeScript ketat dan dijamin lulus kompilasi 100% tanpa error.

---

<div align="center">

**Kontrakan Pa Iman** © 2026 · Tugas Besar CCI Frontend Web Development

</div>
