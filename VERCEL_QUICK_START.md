# 🚀 Deploy Vercel - Hướng Dẫn Chi Tiết (5 Phút)

## 📝 Checklist nhanh

- [ ] Có tài khoản Vercel (vercel.com)
- [ ] Có tài khoản GitHub
- [ ] Có Supabase URL + Anon Key
- [ ] Code đã commit
- [ ] Sẵn sàng push lên GitHub

---

## ⚡ 5 Bước Deploy

### **Bước 1️⃣: Kiểm tra code đã sẵn**

```powershell
cd e:\TuPT\project\counterDate
git status
```

Nếu có file thay đổi (không phải `.next`, `node_modules`):
```powershell
git add .
git commit -m "Ready for Vercel deployment"
```

### **Bước 2️⃣: Tạo Repository GitHub**

1. Vào **https://github.com/new**
2. Đặt tên: `counterDate` (hoặc tên khác)
3. Chọn **"Private"** (để bảo mật)
4. Nhấn **"Create repository"**

### **Bước 3️⃣: Push Code lên GitHub**

Sao chép command từ GitHub và chạy:

```powershell
# Nếu lần đầu push (GitHub sẽ show các command)
git remote add origin https://github.com/YOUR_USERNAME/counterDate.git
git branch -M main
git push -u origin main
```

Thay `YOUR_USERNAME` bằng username GitHub của bạn!

✅ Chờ code push xong

### **Bước 4️⃣: Kết nối Vercel với GitHub**

1. Vào **https://vercel.com/dashboard**
2. Nhấn **"Add New"** → **"Project"**
3. Nhấn **"Import Git Repository"**
4. **Dán link repository GitHub:**
   ```
   https://github.com/YOUR_USERNAME/counterDate
   ```
5. Nhấn **"Import"**

### **Bước 5️⃣: Set Environment Variables**

**Bước 5.1** - Lấy Supabase Keys:
1. Vào **https://app.supabase.com**
2. Chọn project của bạn
3. Mở **Settings** → **API**
4. Copy 2 giá trị:
   - **Project URL** (cái URL dài có `.supabase.co`)
   - **anon public** (cái key dài)

**Bước 5.2** - Thêm vào Vercel:

Trong form **"Environment Variables"** trên Vercel, thêm:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` |

**Quan trọng:** Đảm bảo copy **đúng giá trị**, không có space đầu/cuối!

### **Bước 6️⃣: Deploy!**

1. Nhấn **"Deploy"** (button cuối cùng trên trang)
2. Chờ ~2-3 phút hoàn thành
3. Bạn sẽ thấy "✅ Congratulations! Your project is live"
4. Copy URL từ Vercel (sẽ là: `https://counterDate-xxx.vercel.app`)

---

## ✨ Upload thành công!

**Url của app:** 
```
https://counterDate-[random].vercel.app
```

Bây giờ:
- ✅ App live trên internet
- ✅ Có thể share URL cho mọi người
- ✅ Mỗi khi push code, Vercel tự động build & deploy

---

## 📱 Cài PWA trên điện thoại

**iPhone:**
1. Mở Safari → truy cập URL
2. Nhấn **⎕ Share** → **"Add to Home Screen"**
3. Đặt tên → **"Add"**

**Android:**
1. Mở Chrome → truy cập URL
2. Hộp thoại install sẽ pop-up
3. Nhấn **"Install"** → App thêm vào home screen

---

## 🔄 Cập nhật app sau này

Mỗi lần bạn muốn update:

```powershell
# 1. Làm thay đổi code

# 2. Commit & Push
git add .
git commit -m "Update: add new feature"
git push origin main

# 3. Vercel tự động deploy (xem trạng thái: https://vercel.com/dashboard)
```

**Không cần làm gì trên Vercel nữa!** Nó tự động.

---

## 🐛 Nếu gặp lỗi

### ❌ "Build failed"

**Giải pháp:**
1. Xem logs trên Vercel: Deployments → Click deployment → "Logs"
2. Lỗi thường là:
   - Import path sai (case-sensitive!)
   - Biến environment sai
   - Package chưa cài

**Thử fix:**
```powershell
# Xóa & cài lại locally
rm -r node_modules
npm install
npm run build  # Test build locally
```

Nếu build thành công locally nhưng fail on Vercel:
- Check environment variables đúng trên Vercel
- Check `.gitignore` không exclude file quan trọng

### ❌ "Supabase không kết nối"

**Giải pháp:**
1. Check `NEXT_PUBLIC_SUPABASE_URL` đúng (không có space)
2. Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` đúng
3. Kiểm tra Supabase RLS: 
   - Vào Supabase → SQL Editor → run lệnh cho public access
   - Đảm bảo schema public có RLS disabled

### ❌ "PWA không add được"

PWA yêu cầu HTTPS (Vercel có sẵn):
- Mở qua HTTPS, không HTTP
- Nếu dùng custom domain, enable SSL
- Clear cache & reload page

---

## 📊 Xem app statistics

**Vercel Dashboard:**
- **Deployments** - Lịch sử deploy
- **Analytics** - Có bao nhiêu người truy cập
- **Functions** - API logs (nếu có)
- **Settings** - Cấu hình project

---

## 🔐 Bảo mật

⚠️ **QUAN TRỌNG:**
- ✅ GitHub repository: **PRIVATE**
- ✅ Environment variables: Chỉ set trên Vercel, không commit
- ✅ Supabase Anon Key: Public key, OK expose lên client
- ✅ SQL RLS: Đảm bảo prevent unauthorized access

---

## 📞 Cần giúp?

Nếu gặp vấn đề:
1. Xem logs: Vercel Dashboard → Deployments
2. Check environment variables đúng
3. Xem `.env.example` có variable nào bị thiếu không
4. Local test: `npm run build` + `npm run start`

---

## ✅ Done! 🎉

App của bạn giờ đã **LIVE** trên internet!

**Share URL:** `https://counterDate-xxx.vercel.app`

**Mỗi lần update:** `git push origin main` → tự động deploy

Enjoy! 🚀
