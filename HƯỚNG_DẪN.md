# Hướng dẫn triển khai Pregnancy Care Tracker

## 📋 Tóm tắt dự án

Web app Next.js để theo dõi cuộc thai kỳ cá nhân:
- **Tính ngày thai**: Hiển thị hôm nay là ngày thứ bao nhiêu, bé được x tuần y ngày.
- **Theo dõi cân nặng**: Nhập cân theo ngày, so sánh với dải mục tiêu, cảnh báo nếu lệch.
- **Cảnh báo nhắc nhở**: Đặt theo ngày/tuần/tháng thai, app sẽ hiển thị khi đến hạn.
- **Dữ liệu đồng bộ**: Lưu trên Supabase cloud, dùng được ở nhiều thiết bị.
- **Không cần đăng nhập**: Ai có URL cũng vào được (vì là personal app 1 user).

---

## 🔧 Chuẩn bị Supabase

### 1. Tạo project Supabase
1. Truy cập [supabase.com](https://supabase.com)
2. Đăng ký hoặc đăng nhập bằng GitHub.
3. Nhấn **New Project**.
4. Chọn region gần nhất (ví dụ: Singapore).
5. Đợi project khởi tạo (**~2 phút**).

### 2. Chạy SQL schema
1. Vào **SQL Editor** (mục bên trái).
2. Paste toàn bộ nội dung file `supabase/schema.sql` của dự án này.
3. Nhấn **Run** (hoặc Ctrl+Shift+Enter).
4. Xác nhận: bạn sẽ thấy các bảng được tạo.

**Lưu ý**: Schema này không cần Supabase Auth (vì là public). RLS đã bị disable.

### 3. Lấy thông tin kết nối
1. Vào **Project Settings** > **API**.
2. Copy:
   - **Project URL** (ví dụ: `https://xxxxxxxxxxx.supabase.co`)
   - **anon public key**


---

## 🚀 Chạy ứng dụng

### A. Chạy trên máy (không Docker)

#### Bước 1: Cài đặt môi trường

Tạo file `.env.local` ở gốc dự án:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Thay `YOUR_PROJECT` và `YOUR_ANON_KEY` bằng giá trị từ mục 4 ở trên.

#### Bước 2: Install & chạy
```bash
npm install
npm run dev
```

**Kết quả**: Server khởi chạy tại `http://localhost:3000`

Mỗi lần thay đổi code, trình duyệt sẽ tự reload.

#### Bước 3: Build production
```bash
npm run build
npm start
```

---

### B. Chạy bằng Docker

#### Bước 1: Tạo file `.env.local`

Giống như mục A nhưng sẽ được Docker tự động load:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

#### Bước 2: Build & chạy container
```bash
docker compose up --build
```

**Kết quả**: App chạy tại `http://localhost:3000`

Để chạy nền:
```bash
docker compose up -d
```

Để dừng:
```bash
docker compose down
```

---

## 💾 Sử dụng ứng dụng

### Lần đầu tiên
1. Mở `http://localhost:3000`
2. Bạn sẽ thấy ngay form thiết lập (không cần đăng nhập)

### Thiết lập thai kỳ
1. **Ngày đầu thai kỳ (LMP)**: Nhập ngày đầu kỳ kinh cuối
2. **Cân nặng baseline** (tùy chọn): Cân nặng lúc biết có thai
3. **Timezone**: Mặc định Asia/Ho_Chi_Minh
4. Nhấn **Lưu thiết lập**

### Theo dõi cân nặng
1. **Nhập cân nặng theo ngày**:
   - Chọn ngày
   - Nhập cân (kg)
   - (Tùy chọn) Thêm ghi chú
   - Nhấn **Thêm bản ghi**

2. **Đặt rule tăng cân theo tuần**:
   - Ví dụ: tuần 14-20 tăng 0.4-0.5kg/tuần
   - App sẽ tính dải mục tiêu min/max theo thời gian
   - Hiển thị cảnh báo nếu vượt hoặc thiếu

3. **Biểu đồ so sánh**:
   - Xem visualize: thực tế vs dải kỳ vọng
   - Giúp bạn nhận ra xu hướng sớm

### Cảnh báo nhắc nhở
1. **Thêm cảnh báo**:
   - Theo ngày: nhập ngày cụ thể
   - Theo tuần: nhập số tuần thai (ví dụ: tuần 20, siêu âm chứng thực)
   - Theo tháng thai xấp xỉ (1-3 tháng)
2. Viết tiêu đề và nội dung
3. Nhấn **Thêm cảnh báo**

Mỗi lần mở app, nếu hôm nay có cảnh báo đến hạn, sẽ hiển thị banner ở đầu trang.

---

## 📊 Cấu trúc dữ liệu

Các bảng trong Supabase:

### `pregnancy_settings`
- `user_id`: Fixed ID `00000000-0000-0000-0000-000000000001` (không cần auth)
- `lmp_date`: Ngày đầu kỳ kinh cuối
- `baseline_weight_kg`: Cân nặng gốc (tùy chọn)
- `timezone`: Múi giờ (mặc định: Asia/Ho_Chi_Minh)

### `weight_logs`
- `id`: UUID (khóa chính)
- `user_id`: ID cố định (không cần auth)
- `date`: Ngày nhập cân
- `weight_kg`: Cân nặng (kg)
- `note`: Ghi chú (tùy chọn)

### `weight_target_rules`
Mỗi dòng là một khoảng tuần với rule tăng cân:
- `user_id`: ID cố định (không cần auth)
- `start_week` - `end_week`: Tuần từ/đến
- `min_per_week_kg` - `max_per_week_kg`: Tăng cân tối thiểu/tối đa mỗi tuần

### `alerts`
- `user_id`: ID cố định (không cần auth)
- `trigger_type`: "date" | "week" | "month"
- `trigger_date`: Ngày cụ thể (nếu type=date)
- `trigger_value`: Tuần hoặc tháng (nếu type=week|month)
- `title` - `message`: Nội dung cảnh báo
- `is_active`: Có active hay không

---

## 🔐 Bảo mật

⚠️ **Lưu ý quan trọng**:
- App **không có auth**, ai có URL cũng vào được.
- Vì là personal use 1 user, nên **giữ URL riêng tư, không chia sẻ công khai**.
- RLS đã bị disable (vì không cần auth).
- Tất cả dữ liệu dùng fixed user ID, không cần đăng nhập.

---

## 🛠️ Lỗi thường gặp

### "Missing Supabase environment variables"
→ Kiểm tra file `.env.local` có đúng 2 biến không? Có reload server chưa?

### "Không thể tải dữ liệu. Kiểm tra kết nối Supabase..."
→ Check:
1. URL & key đúng chưa?
2. Schema đã chạy xong chưa?
3. Internet connection có tốt không?

### "Email không hợp lệ"
→ Vào Supabase > Project Settings > Email Provider, kiểm tra cấu hình email có bật không?

### "Cảnh báo không xuất hiện"
→ 
1. Kiểm tra timezone match hôm nay không?
2. Alert có is_active=true không?
3. Trigger date/value có chính xác không?

---

## 🌐 Deploy lên VPS/Cloud

### Vercel (Recommended)
1. Push code lên GitHub
2. Trên Vercel, connect GitHub repo
3. Đặt 2 env var:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
4. Deploy!

### Docker trên VPS
```bash
git clone <your-repo>
cd counterDate
cp .env.example .env.local
# Edit .env.local với thông tin Supabase
docker compose up -d
```

App sẽ chạy tại `http://your-vps-ip:3000`

---

## 📝 Ghi chú

- **Múi giờ**: Hiện tại fixed Asia/Ho_Chi_Minh, có thể thay đổi trong form thiết lập.
- **Tuần thai**: Tính từ LMP + 1 ngày, chia cho 7 lấy tuần.
- **Tháng thai xấp xỉ**: Mỗi 4 tuần = 1 tháng (tính để canh báo).
- **Cân nặng**: Lưu thành `numeric(5,2)` trong DB, tối đa 999.99 kg.

---

## 💬 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra console trình duyệt (F12) có error nào không?
2. Xem Supabase Logs trong project trên web.
3. Build lại: `npm run build`
4. Restart docker: `docker compose restart`

**Chúc mamma khỏe mạnh! 🎉**
