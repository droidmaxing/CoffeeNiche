# AGENTS.md — CoffeeNiche

Panduan kerja untuk agent AI (dan manusia) di repo ini. Baca sebelum menulis kode.

## 1. Fakta repo

- Remote: `git@github.com:droidmaxing/CoffeeNiche.git` — branch kerja: `master`
- Stack: Next.js 16 (App Router, TypeScript strict), Prisma ORM, MySQL 8.0
- Autentikasi: sesi JWT kustom (`jose`) di `lib/auth.ts` + cookie httpOnly; secret dari env `NEXTAUTH_SECRET` (wajib ≥32 karakter); hash password `bcryptjs`. Repo ini **tidak** memakai NextAuth.js.
- Database: MySQL 8.0, nama schema `coffeeniche_db`
- Struktur: `app/` (routes App Router), `components/`, `lib/`, `prisma/schema.prisma`, `prisma/seed.ts`, `proxy.ts` (middleware). Repo ini **tidak** memakai folder `src/`.

## 2. Menjalankan (Docker Compose)

```bash
# Compose sudah mengisi DATABASE_URL + NEXTAUTH_SECRET untuk service `app`.
# Override lokal (opsional): salin .env.example -> .env (sudah di-gitignore) — jangan commit.
docker compose up -d --build  # mysql (healthy) -> app: prisma migrate deploy + generate + seed + build + start
docker compose ps             # coffeeniche-mysql (healthy), coffeeniche-app (up)
curl -fsS http://127.0.0.1:3002
docker compose logs -f --tail=50 app
docker compose down           # JANGAN pakai -v: volume coffeeniche_mysql_data berisi data
```

Port host: web `3002:3000`, mysql `3309:3306`.
Pengembangan lokal langsung (tanpa compose):
```bash
npm install
npx prisma generate
npm run dev                   # buka http://localhost:3000
```

Seed manual (bila DB di-reset): `npm run db:seed` — akun bawaan: `owner@coffeeniche.id`, `admin@coffeeniche.id`, `kasir@coffeeniche.id` (semua password `coffeeniche123`, di-hash bcrypt cost 10).

## 3. Gate wajib sebelum commit (harus hijau)

```bash
npx prisma generate     # WAJIB sebelum tsc/build agar client sinkron
npm run lint            # ESLint (0 warning/error)
npx tsc --noEmit        # Typecheck TypeScript (strict mode)
npm test                # unit test (node --test via tsx, tests/*.test.ts)
npm run build           # Next.js production build
```

Semua 5 langkah di atas sudah diverifikasi exit 0 di host ini (Node 22); CI menjalankannya di Ubuntu + Node 20.
CI: `.github/workflows/ci.yml` menjalankan generate → lint → typecheck → test → build di Ubuntu runner dengan Node 20.

## 4. Database & migrasi

- Skema ada di `prisma/schema.prisma`.
- Alur perubahan skema:
  1. Ubah `prisma/schema.prisma`.
  2. Buat migrasi: `npx prisma migrate dev --name <deskripsi_singkat>` (bila DB lokal tersedia) ATAU buat file migrasi di `prisma/migrations/`.
  3. Generate ulang client: `npx prisma generate`.
  4. Perbarui `prisma/seed.ts` bila ada enum atau kolom wajib baru.
- Migrasi yang sudah pernah ter-commit tidak boleh diedit langsung.
- Password di `seed.ts` wajib memakai hash `bcrypt.hashSync(..., 10)`.

## 5. Aturan wajib

Lakukan:
- Jalankan `npx prisma generate` sebelum typecheck.
- Cek kode yang ada sebelum membuat komponen baru; manfaatkan UI library (Tailwind, Lucide icons) yang sudah ada.
- Jaga TypeScript strict: hindari `any` eksplisit, tangani nilai `null`/`undefined`.
- Jalankan 5 langkah gate di bagian 3 dan laporkan hasilnya.

Jangan:
- Ubah `postcss.config.mjs` tanpa alasan kuat (file ini diperlukan agar Tailwind ter-compile di Next.js).
- Commit `.env`, password database asli, atau `NEXTAUTH_SECRET` ke Git. Gunakan nilai placeholder di `.env.example`.
- Menggunakan `docker compose down -v` di server produksi / staging karena menghapus volume data.
- Mengklaim build/typecheck sukses tanpa benar-benar menjalankannya.

## 6. Konvensi commit

Format: `<tipe>: <deskripsi bahasa Indonesia>`, contoh:
`feat: tambah filter kategori pada menu`, `fix: sinkronkan hash bcrypt pada seed user`.

## 7. Definisi selesai

1. 5 langkah gate bagian 3 lulus (exit code 0).
2. Perubahan terverifikasi di runtime container (`docker compose up -d --build` + cek browser / curl port 3002).
3. `git status` bersih; tidak ada credential/`.env` yang ter-stage.

## 8. Jebakan yang diketahui

- Container `coffeeniche-app` bergantung pada healthcheck `coffeeniche-mysql` sebelum start; tunggu 10-20 detik saat `docker compose up`.
- Variabel `DATABASE_URL` di container compose harus mengarah ke host `mysql` (`mysql://...:3306/coffeeniche_db`), BUKAN `localhost` atau `127.0.0.1`.
- Dockerfile memakai `RUN npm run build || true` — kegagalan build TIDAK terlihat saat `docker compose build`; gerbang sebenarnya adalah perintah gate di bagian 3 (dan CI). Jalankan gate manual sebelum push.
- Pastikan `NEXTAUTH_SECRET` (dipakai `lib/auth.ts`) minimal 32 karakter; tanpa itu login gagal HTTP 500 dengan `NEXTAUTH_SECRET must be configured with at least 32 characters`. Compose sudah mengisinya; untuk `npm run dev` di host, salin `.env.example` → `.env`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
