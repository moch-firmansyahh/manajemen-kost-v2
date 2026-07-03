# Manajemen Kost

Aplikasi web untuk pemilik kost dalam mengelola kamar, penghuni, dan pembayaran sewa bulanan secara digital. Dilengkapi dashboard statistik dan CRUD lengkap untuk setiap entitas.

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [ShadcnUI](https://ui.shadcn.com/) - UI Library

## Fitur Utama

- Dashboard statistik (total kamar, kamar terisi, kamar kosong, pendapatan bulan ini)
- Manajemen kamar (tambah, lihat detail, edit, hapus)
- Manajemen penghuni (tambah, lihat profil, edit, hapus)
- Pencatatan pembayaran sewa bulanan (tambah, lihat riwayat, edit, hapus)
- Status pembayaran (lunas, belum bayar, terlambat)
- Filter dan pencarian data penghuni

## Struktur Folder

```
manajemen-kost/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── kamar/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── penghuni/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── pembayaran/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navbar.tsx
│   │   ├── kamar/
│   │   │   ├── KamarCard.tsx
│   │   │   ├── KamarForm.tsx
│   │   │   └── KamarTable.tsx
│   │   ├── penghuni/
│   │   │   ├── PenghuniCard.tsx
│   │   │   ├── PenghuniForm.tsx
│   │   │   └── PenghuniTable.tsx
│   │   └── pembayaran/
│   │       ├── PembayaranForm.tsx
│   │       └── PembayaranTable.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useKamar.ts
│   │   ├── usePenghuni.ts
│   │   └── usePembayaran.ts
│   └── types/
│       └── index.ts
├── public/
├── .eslintrc.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Cara Menjalankan Project

### Prerequisites

Pastikan sudah terinstall:

- Node.js versi 18 ke atas
- npm atau yarn

### Instalasi

1. Clone repository ini

```bash
git clone https://github.com/username/manajemen-kost.git
```

2. Masuk ke folder project

```bash
cd manajemen-kost
```

3. Install dependencies

```bash
npm install
```

4. Install ShadcnUI

```bash
npx shadcn@latest init
```

5. Jalankan development server

```bash
npm run dev
```

6. Buka browser dan akses

```
http://localhost:3000
```

## Implementasi Teori

| Teori                           | Implementasi                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| TailwindCSS & Responsive Design | Seluruh halaman menggunakan Tailwind dengan breakpoint sm, md, lg                     |
| Component & Hooks               | Komponen reusable di folder components/, custom hooks di folder hooks/                |
| Routing & Dynamic Routing       | App Router Next.js dengan dynamic route [id] untuk detail kamar, penghuni, pembayaran |
| Data Fetching                   | useEffect untuk fetch data dari API routes atau JSON lokal                            |
| Conditional Rendering           | Tampilan berbeda berdasarkan status kamar dan status pembayaran                       |

## Author

Moch Firmansyah - 103012400137 - IF-48-08 - Telkom University
