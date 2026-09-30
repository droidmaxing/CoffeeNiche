# CoffeeNiche POS

Aplikasi web POS cafe/restaurant berbasis Next.js + TypeScript + MySQL + Prisma + Tailwind CSS + Zustand.

## Fitur

- Dashboard operasional
- POS / transaksi kasir
- Riwayat transaksi
- Manajemen menu, kategori, modifier, diskon
- User role Owner/Admin/Kasir
- Theme customization dan store settings
- Database schema dengan MySQL + Prisma
- Arsitektur modular untuk scalability

## Prasyarat

- Node.js 18+
- MySQL 8+
- npm

## Setup environment

1. Salin file `.env.example` menjadi `.env`
2. Sesuaikan koneksi MySQL Anda:

```bash
DATABASE_URL="mysql://root:root@localhost:3306/coffeeniche"
NEXTAUTH_SECRET="replace-with-secure-secret"
NEXT_PUBLIC_APP_NAME="CoffeeNiche"
```

## Setup MySQL dengan Laragon

Jalankan MySQL melalui Laragon. Untuk konfigurasi Laragon bawaan (user `root` tanpa password), URL koneksi di `.env` adalah:

```env
DATABASE_URL="mysql://root@localhost:3306/coffeeniche"
```

Jika Anda menggunakan password atau port MySQL berbeda, sesuaikan URL tersebut. Prisma akan membuat database `coffeeniche` saat menjalankan migrasi jika user MySQL memiliki izin.

## Install dependencies

```bash
npm install
```

## Run Prisma migration

```bash
npx prisma migrate dev --name init
```

Jika ingin generate client tanpa migrasi:

```bash
npx prisma generate
```

## Seed data

```bash
npx tsx prisma/seed.ts
```

File `prisma/seed.ts` akan mengisi default data kategori, produk, dan store.

## Menjalankan aplikasi

```bash
npm run dev
```

Buka browser ke:

```bash
http://localhost:3000
```

## Build production

```bash
npm run build
npm run start
```

## Struktur utama

- `app/` - App Router pages
- `components/` - UI components
- `lib/` - utility, validation, data, Prisma client
- `stores/` - Zustand store
- `prisma/` - schema dan seed
- `types/` - shared type definitions

## Catatan penting

- Data historis transaksi disimpan sebagai snapshot pada `TransactionItem`.
- Transaksi tidak dibuat hard delete; status `VOID` digunakan untuk pembatalan.
- Semua master data utama menggunakan status aktif/nonaktif agar aman untuk perubahan di masa depan.
