<div align="center">

# 🏠 Kontrakan Pa Iman
### *Sistem Manajemen Kost Digital Modern & Responsif*

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-5.0-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

Aplikasi web **Full-Stack Digital Management** yang dirancang khusus untuk pemilik kost dalam mengelola unit kamar, data penghuni (aktif & alumni), dan pencatatan riwayat pembayaran bulanan secara efisien, terstruktur, dan otomatis.

[🌐 **Demo Live App**](https://manajemen-kost-nine.vercel.app) · [🐛 **Laporkan Issue / Bug**](https://github.com/moch-firmansyahh/manajemen-kost-v2/issues)

---

</div>

## 📌 Daftar Isi
- [✨ Fitur Utama](#-fitur-utama)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Struktur Folder Project](#-struktur-folder-project)
- [🚀 Panduan Instalasi & Jalankan Lokal](#-panduan-instalasi--jalankan-lokal)
- [🔑 Kredensial Akses Demo](#-kredensial-akses-demo)
- [📱 Progressive Web App (PWA)](#-progressive-web-app-pwa)
- [🏗️ Build & Verifikasi Produksi](#️-build--verifikasi-produksi)
- [📄 Lisensi & Informasi Tugas](#-lisensi--informasi-tugas)

---

## ✨ Fitur Utama

### 📊 **Dashboard Utama (`/`)**
- **Ringkasan Real-Time**: 4 Stat Card interaktif (Total Kamar, Terisi, Kosong, Estimasi Pendapatan Bulan Ini).
- **Tabel Penghuni Terbaru**: Daftar penghuni baru masuk dengan baris yang nyaman & teratur.
- **Tabel Tagihan Pending**: Monitoring otomatis untuk pembayaran sewa yang belum lunas.
- **Notifikasi Sistem**: Popover notifikasi dengan penanda status & interaksi cepat.

### 🚪 **Manajemen Kamar (`/kamar`)**
- **Filter & Search**: Pencarian instan via nomor/tipe kamar dan filter status (*Tersedia*, *Terisi*, *Maintenance*).
- **Operasi CRUD**: Modals form modern untuk Tambah, Edit, dan Hapus unit kamar.
- **Detail Kamar (`/kamar/[id]`)**: Halaman khusus menampilkan histori lengkap penghuni dan riwayat transaksi sewa kamar tersebut.

### 👥 **Manajemen Penghuni (`/penghuni`)**
- **Pengelompokan Tab**: Tab terpisah untuk **Penghuni Aktif** dan **Alumni**.
- **Pencarian Nama**: Pencarian cepat penghuni berdasarkan nama atau kamar.
- **Sistem Checkout**: Fitur checkout penghuni yang secara otomatis meng-update status kamar kembali menjadi *Tersedia*.
- **Detail Penghuni (`/penghuni/[id]`)**: Profil lengkap, kontak, informasi identitas, dan riwayat tagihan sewa.

### 💳 **Manajemen Pembayaran (`/pembayaran`)**
- **Pencatatan Transaksi**: Pencatatan tagihan sewa bulanan dengan status (*Lunas*, *Belum Bayar*, *Terlambat*).
- **Filter Tahun & Status**: Memudahkan pencarian riwayat transaksi berdasarkan periode dan kondisi pembayaran.
- **Struk Invoice (`/pembayaran/[id]`)**: Halaman detail struk invoice pembayaran yang siap dicetak/diunduh.

### 🎨 **Keunggulan UI & UX**
- **Dual Theme Support**: Mode Gelap (Dark Mode) dan Mode Terang (Light Mode) dengan peralihan mulus.
- **Animasi & Transisi**: Welcome Screen interaktif saat awal membuka app dan House Loader halus antar navigasi halaman.
- **Desain Fully Responsive**: Dioptimalkan untuk semua ukuran layar (Mobile, Tablet, Desktop).

---

## 🛠️ Tech Stack

| Layer | Teknologi Utama | Keterangan / Versi |
|---|---|---|
| **Frontend Framework** | **Next.js 16** | App Router, React 19, Server & Client Components |
| **Bahasa Pemrograman** | **TypeScript** | Strict Type Checking di seluruh codebase |
| **Styling & UI** | **Tailwind CSS v4** | Shadcn UI, Radix UI Primitives, Lucide React Icons |
| **Theme & UI Effects** | **Next Themes** | Dark / Light Mode Provider & Smooth Animations |
| **Backend API** | **Express.js 5** | RESTful API Architecture |
| **ORM & Database** | **Prisma ORM** | PostgreSQL Database (Hosted di Supabase) |
| **Authentication** | **JWT & Cookie-Based** | Secure Token-Based Authentication Flow |
| **Deployment** | **Vercel** | Automated Continuous Deployment (Frontend & Backend API) |
| **PWA Support** | **Web App Manifest** | App Icon, Standalone Display Mode, Mobile Web Installable |

---

## 📁 Struktur Folder Project

```
manajemen-kost-v2/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema (Kamar, Penghuni, Pembayaran, User)
│   │   └── seed.ts                # Seeder data dummy awal
│   └── src/
│       ├── index.ts               # Entry point Express server
│       ├── routes/                 # API Endpoints (auth, kamar, penghuni, pembayaran)
│       └── middleware/             # Middleware otentikasi & validasi
│
├── frontend/
│   ├── public/
│   │   ├── Logo-Kost.png          # Logo utama
│   │   ├── Logo-Kost-Square.png   # Ikon PWA (Kotak)
│   │   └── manifest.json          # Konfigurasi PWA Manifest
│   └── src/
│       ├── app/
│       │   ├── layout.tsx         # Root Layout (Sidebar, ThemeProvider, Toast)
│       │   ├── page.tsx           # Halaman Dashboard utama
│       │   ├── login/page.tsx     # Halaman Login Admin
│       │   ├── kamar/             # Halaman daftar & detail kamar
│       │   ├── penghuni/          # Halaman daftar & detail penghuni
│       │   ├── pembayaran/        # Halaman daftar & detail pembayaran
│       │   └── profile/           # Halaman profil admin & ubah password
│       ├── components/
│       │   ├── ui/                # Komponen Shadcn UI & Loader Custom
│       │   ├── layout/            # Sidebar, Navbar, Mobile Navigation
│       │   ├── dashboard/         # StatCard & Widget Dashboard
│       │   ├── kamar/             # KamarTable, KamarForm, KamarBadge
│       │   ├── penghuni/          # PenghuniTable, PenghuniForm, PenghuniCard
│       │   └── pembayaran/        # PembayaranTable, PembayaranForm, StatusBadge
│       ├── hooks/
│       │   ├── useKamar.ts        # Hook manajemen data & state kamar
│       │   ├── usePenghuni.ts     # Hook manajemen data & state penghuni
│       │   └── usePembayaran.ts   # Hook manajemen data & state pembayaran
│       ├── lib/
│       │   └── utils.ts           # Helper utilities (cn, formatRupiah, formatDate)
│       └── types/
│           └── index.ts           # Definisi interface TypeScript global
```

---

## 🚀 Panduan Instalasi & Jalankan Lokal

### Prasyarat System
- **Node.js** (v18.x atau lebih baru)
- **npm** atau **pnpm** / **yarn**
- Database **PostgreSQL** (Lokal atau Cloud Supabase)

### 1️⃣ Clone Repositori
```bash
git clone https://github.com/moch-firmansyahh/manajemen-kost-v2.git
cd manajemen-kost-v2
```

### 2️⃣ Configuration & Setup Backend
```bash
cd backend
npm install
```
Buat file `.env` di dalam directory `backend/`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/db_manajemen_kost?schema=public"
PORT=5000
JWT_SECRET="rahasia_kost_pak_iman"
```
Jalankan migrasi database dan seeding data dummy:
```bash
npx prisma db push
npx prisma db seed
```
Jalankan dev server backend:
```bash
npm run dev
```

### 3️⃣ Setup & Jalankan Frontend
Buka terminal baru pada root project:
```bash
cd frontend
npm install
npm run dev
```
Akses aplikasi web di browser pada link: **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Kredensial Akses Demo

Anda dapat menggunakan akun administrator berikut untuk mencoba aplikasi:

| Parameter | Kredensial |
|---|---|
| **Email Login** | `firmanajah366@gmail.com` |
| **Password** | `Iman12345` |

---

## 📱 Progressive Web App (PWA)

Aplikasi telah terkonfigurasi PWA sehingga dapat di-install secara langsung di smartphone Android & iOS:

1. Buka link **[manajemen-kost-nine.vercel.app](https://manajemen-kost-nine.vercel.app)** di browser HP.
2. **Android (Chrome)**: Ketuk titik tiga `⋮` di pojok kanan atas ➔ Pilih **"Add to Home screen"** / **"Install App"**.
3. **iOS (Safari)**: Ketuk tombol **Share** ➔ Pilih **"Add to Home Screen"**.
4. Aplikasi akan tampil layaknya aplikasi native tanpa bar browser URL.

---

## 🏗️ Build & Verifikasi Produksi

Untuk memastikan tidak ada TypeScript error dan melakukan build bundle produksi:

```bash
cd frontend
npm run build
```

> 🟢 Codebase dikonfigurasi dengan standar ketat TypeScript & ESLint, menjamin kompilasi sukses 100% tanpa error.

---

<div align="center">

**Kontrakan Pa Iman** © 2026 · *Dikembangkan untuk Tugas Besar CCI Frontend Web Development*

</div>
