# Pregnancy Care Tracker (Next.js + Supabase + Docker)

Web app ca nhan de theo doi thai ky:

- Tinh ngay thai: hien thi ngay thu bao nhieu, be duoc x tuan y ngay.
- Theo doi can nang theo ngay, dat rule tang can theo tuan/thang, canh bao neu lech muc tieu.
- Dat canh bao theo ngay / tuan / thang thai.

## 1) Chuan bi Supabase

1. Tao project Supabase.
2. Vao SQL Editor, chay file `supabase/schema.sql`.
3. Trong Authentication > Providers, bat Email OTP (magic link).
4. Trong Project Settings > API, lay:
   - `Project URL`
   - `anon public key`

## 2) Cau hinh moi truong

Tao file `.env.local` tu `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## 3) Chay local khong Docker

```bash
npm install
npm run dev
```

Mo `http://localhost:3000`.

## 4) Chay bang Docker

```bash
docker compose up --build
```

Mo `http://localhost:3000`.

## 5) Deploy

- Deploy Next.js len Vercel hoac chay container tren VPS.
- Dat 2 env var giong `.env.local` tren moi truong deploy.
- Du lieu nam o Supabase nen ban dang nhap o dau cung thay du lieu.

## Ghi chu logic

- Tuan thai tinh tu `LMP`:
  - `pregnancyDay = (today - lmpDate) + 1`
  - `week = floor((pregnancyDay - 1)/7) + 1`
  - `day = (pregnancyDay - 1) % 7`
- Muc tieu can nang duoc cong don theo cac khoang tuan trong `weight_target_rules`.
- Alert theo thang la thang thai xap xi: moi 4 tuan tinh 1 thang.
