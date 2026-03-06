# ✅ Pregnancy Care Tracker - Bước tiếp theo

## ✔︎ Những gì đã hoàn thành

- ✅ Next.js TypeScript + Tailwind setup
- ✅ Supabase cloud integration (auth + 4 tables)
- ✅ Tính ngày thai + tuần/ngày
- ✅ Nhập cân + biểu đồ target vs actual
- ✅ Rule tăng cân theo tuần
- ✅ Cảnh báo theo ngày/tuần/tháng
- ✅ Docker + docker-compose
- ✅ Production build pass
- ✅ README + hướng dẫn chi tiết

---

## 🎯 Để bắt đầu sử dụng

### 1. Supabase Setup (10 phút)
- [ ] Tạo project mới ở supabase.com
- [ ] **Quan trọng**: Nếu chạy schema cũ trước, hãy xóa toàn bộ table cũ trước
  - Vào SQL Editor, chạy:
    ```sql
    drop table if exists public.alerts cascade;
    drop table if exists public.weight_target_rules cascade;
    drop table if exists public.weight_logs cascade;
    drop table if exists public.pregnancy_settings cascade;
    ```
- [ ] Chạy `supabase/schema.sql` trong SQL Editor (phiên bản public mode)
- [ ] **Không cần bật Email OTP** (vì không dùng auth)
- [ ] Copy Project URL & anon key

### 2. Chạy local (2 phút)
- [ ] Tạo `.env.local` từ `.env.example`
- [ ] Paste Supabase URL & key vào
- [ ] Chạy `npm run dev`
- [ ] Mở `http://localhost:3000`

### 3. Test end-to-end (5 phút)
- [ ] Mở `http://localhost:3000`
- [ ] Bạn sẽ thấy ngay form thiết lập (không cần đăng nhập)
- [ ] Nhập ngày LMP
- [ ] Thêm 1 bản ghi cân
- [ ] Thêm 1 rule tăng cân
- [ ] Thêm 1 cảnh báo
- [ ] Xem biểu đồ

---

## 🚀 Deploy (tương lai)

Hai option:

### Vercel (dễ nhất, free tier)
1. Push code lên GitHub
2. Kết nối repo với Vercel
3. Thêm 2 env var Supabase
4. Deploy!

### Docker trên VPS
1. Cài Docker + Docker Compose
2. Clone repo
3. Tạo `.env.local`
4. `docker compose up -d`

---

## 📌 Cấu trúc thư mục

```
counterDate/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main UI component
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Styles
│   └── lib/
│       ├── pregnancy.ts      # Tính toán thai kỳ
│       ├── types.ts          # Type definitions
│       └── supabase/
│           └── client.ts     # Supabase client
├── supabase/
│   └── schema.sql            # Database schema
├── Dockerfile
├── docker-compose.yml
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md / HƯỚNG_DẪN.md
```

---

## 🛠️ Mở rộng trong tương lai

**Có thể thêm:**
- Dữ liệu kiểm tra máu (huyết lượng, đường huyết...)
- Hình ảnh siêu âm theo tuần
- Symptoms tracker (buồn nôn, mệt mỏi...)
- Notification bằng email/push
- Export dữ liệu (PDF report)
- Multi-user (chia sẻ với partner/bác sĩ)

**Công cụ có thể dùng:**
- Supabase Real-time (notifications)
- Vercel Cron (automated alerts)
- NextAuth (nếu muốn social login)

---

## 🔒 Lưu ý bảo mật

- Environment variable **không commit** vào Git
- `.env.local` được .gitignore rồi
- RLS policy trên Supabase đã bật
- Chỉ user thấy được dữ liệu của chính mình
- Magic link an toàn hơn password

---

## 📞 Nếu cần help

1. Check console (F12 > Console tab)
2. Check Supabase Logs
3. Xem lại HƯỚNG_DẪN.md
4. Reset: `docker compose down && rm -rf .next node_modules && npm install`

---

**Chúc bạn an toàn trong suốt thai kỳ! 💚**
