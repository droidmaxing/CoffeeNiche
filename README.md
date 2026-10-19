# CoffeeNiche POS

Aplikasi web POS cafe/restaurant berbasis Next.js + TypeScript + MySQL + Prisma + Tailwind CSS + Zustand.

## Fitur

- Dashboard operasional
- POS / transaksi kasir
- Riwayat transaksi
- Manajemen menu, kategori, modifier, diskon, dan voucher
- User role Owner/Admin/Kasir
- Theme customization dan store settings
- Database schema dengan MySQL + Prisma
- Arsitektur modular untuk scalability

## Prasyarat

- Node.js 20.9 atau lebih baru (Next.js 16) dan npm
- MySQL 8.x - lokal (Laragon/XAMPP) atau lewat Docker Compose
- Docker Engine + Compose v2 (opsional; cara tercepat menjalankan seluruh stack)

## Menjalankan dengan Docker Compose

```bash
docker compose up -d --build
docker compose ps                    # coffeeniche-mysql (healthy), coffeeniche-app
curl -fsS http://127.0.0.1:3002      # aplikasi
docker compose logs -f --tail=50 app
docker compose down                  # JANGAN pakai -v: volume data MySQL ikut terhapus
```

Compose mengisi `DATABASE_URL` dan `NEXTAUTH_SECRET` untuk service `app`, lalu menjalankan
`prisma migrate deploy` + generate + seed + build + start secara otomatis.

Port host: aplikasi `3002:3000`, MySQL `3309:3306`.

Akun seed: `owner@coffeeniche.id`, `admin@coffeeniche.id`, `kasir@coffeeniche.id`
(password awal `coffeeniche123`, di-hash bcrypt cost 10). Ganti sebelum dipakai di luar lokal.

## Menjalankan di host (tanpa Docker)

1. Salin `.env.example` menjadi `.env` dan sesuaikan:
   - `DATABASE_URL` - arahkan ke MySQL lokal, misalnya `mysql://coffeeniche_user:<password>@127.0.0.1:3309/coffeeniche_db`
   - `NEXTAUTH_SECRET` - string acak **minimal 32 karakter**. Tanpa ini login gagal dengan HTTP 500.
2. `npm install`
3. `npx prisma migrate deploy` (atau `npx prisma migrate dev --name init` bila skema berubah)
4. `npm run db:seed` untuk mengisi data awal
5. `npm run dev` lalu buka `http://localhost:3000`

Untuk MySQL bawaan Laragon (user `root` tanpa password), URL koneksinya
`mysql://root@localhost:3306/coffeeniche`.

## Perintah berguna

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan server pengembangan |
| `npm run lint` | Memeriksa aturan ESLint |
| `npx tsc --noEmit` | Typecheck TypeScript (strict) |
| `npm test` | Unit test (`node --test` via tsx, `tests/*.test.ts`) |
| `npm run build` | Build produksi Next.js |
| `npm run start` | Menjalankan build produksi |
| `npm run db:seed` | Mengisi akun dan data awal |
| `npx prisma studio` | Membuka Prisma Studio |

Gate sebelum commit (semua harus exit 0): `npx prisma generate` -> `npm run lint` ->
`npx tsc --noEmit` -> `npm test` -> `npm run build`. CI di `.github/workflows/ci.yml`
menjalankan urutan yang sama pada Node 20.

## Struktur utama

- `app/` - App Router pages dan API routes
- `components/` - UI components
- `lib/` - utilitas, autentikasi (`lib/auth.ts`), Prisma client, logika diskon voucher
- `stores/` - Zustand store (POS dan theme)
- `prisma/` - schema, migrasi, dan seed
- `tests/` - unit test
- `proxy.ts` - middleware

## Catatan penting

- Autentikasi memakai sesi JWT kustom (`jose`) pada cookie httpOnly, **bukan** NextAuth.js.
  Secret dibaca dari `NEXTAUTH_SECRET` saat runtime; build tidak memerlukannya.
- Data historis transaksi disimpan sebagai snapshot pada `TransactionItem`.
- Transaksi tidak dibuat hard delete; status `VOID` digunakan untuk pembatalan.
- Semua master data utama memakai status aktif/nonaktif agar aman untuk perubahan di masa depan.
- Diskon voucher dihitung di satu tempat (`lib/voucher.ts`) dan dipakai bersama oleh
  `POST /api/vouchers/validate` serta `POST /api/transactions`, sehingga nominal di pratinjau
  sama dengan nominal yang tercatat.
- Jangan commit `.env`, kredensial, atau `NEXTAUTH_SECRET`; gunakan placeholder di `.env.example`.

Aturan kerja untuk agen AI maupun kontributor ada di `AGENTS.md`.
