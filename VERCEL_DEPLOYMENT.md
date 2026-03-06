# Vercel Deployment Guide - Hướng Dẫn Deploy Lên Vercel

## 📋 Yêu cầu trước khi bắt đầu

- ✅ Tài khoản Vercel (https://vercel.com/signup)
- ✅ Tài khoản GitHub, GitLab hoặc Bitbucket
- ✅ Git cài sẵn trên máy
- ✅ Thông tin Supabase (URL + Anon Key)

---

## 🚀 Các bước triển khai

### Bước 1: Chuẩn bị code

```bash
# Đảm bảo code đã commit
cd e:\TuPT\project\counterDate
git status

# Nếu có thay đổi, commit chúng
git add .
git commit -m "Ready for Vercel deployment"
```

### Bước 2: Push lên GitHub

```bash
# Nếu chưa có remote repository, tạo mới trên GitHub
# 1. Vào https://github.com/new
# 2. Tạo repository tên "counterDate"
# 3. Chọn Private hoặc Public

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/counterDate.git
git branch -M main
git push -u origin main
```

### Bước 3: Liên kết Vercel với GitHub

1. **Vào https://vercel.com/dashboard**
2. Nhấn **"Add New..."** → **"Project"**
3. Chọn **"Import Git Repository"**
4. Chọn repository **"counterDate"**
5. Nhấn **"Import"**

### Bước 4: Cấu hình Environment Variables trên Vercel

Trong bước setup trên Vercel, sẽ có mục **"Environment Variables"**

Thêm các biến này từ Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Cách lấy từ Supabase:**
1. Vào https://app.supabase.com
2. Chọn project
3. Settings → **API** 
4. Copy **Project URL** và **Anon Key**

### Bước 5: Deploy

1. Nhấn **"Deploy"** trên trang Vercel
2. Chờ ~3-5 phút hoàn thành
3. Sau khi done, Vercel sẽ cho bạn URL như: `https://counterdate-xxx.vercel.app`

---

## ✅ Xác thực deployment thành công

Sau khi deploy xong:

1. Mở URL từ Vercel
2. Kiểm tra các tính năng:
   - [ ] Dashboard tải được
   - [ ] Có thể nhập ngày LMP
   - [ ] Có thể nhập cân nặng
   - [ ] Có thể thêm cảnh báo
   - [ ] Có thể cài đặt PWA (nếu HTTPS)
   - [ ] Supabase có kết nối

---

## 🔧 Cấu hình tên miền custom (Tùy chọn)

Nếu bạn có tên miền riêng:

1. Trên Vercel Dashboard → Project Settings
2. Chọn **"Domains"**
3. Thêm tên miền của bạn
4. Làm theo hướng dẫn DNS cấu hình

---

## 🔄 Triển khai cập nhật

Mỗi lần bạn push code lên GitHub:

```bash
# Thay đổi code
git add .
git commit -m "Update feature XYZ"
git push origin main
```

✅ Vercel **tự động build & deploy** lần mới!

Xem trạng thái deployment:
- Vào https://vercel.com/dashboard
- Xem **"Deployments"** tab

---

## 🐛 Troubleshooting

### Build fails trên Vercel

**Lỗi: "Module not found"**
- ✅ Kiểm tra `npm install` chạy locally
- ✅ Kiểm tra import paths đúng (case-sensitive!)
- ✅ Xóa `node_modules` và `.next`, chạy `npm install` lại

**Lỗi: "NEXT_PUBLIC_SUPABASE_URL is not defined"**
- ✅ Kiểm tra Environment Variables trên Vercel
- ✅ Đảm bảo variable names **chính xác**
- ✅ Redeploy sau khi thêm variables

### PWA không hoạt động

PWA yêu cầu **HTTPS** (Vercel tự động cấp)

- ✅ Nếu dùng custom domain, đảm bảo SSL enabled
- ✅ Truy cập qua HTTPS, không HTTP

### Supabase không kết nối

- ✅ Kiểm tra Supabase environment variables đúng
- ✅ Kiểm tra RLS policies ở Supabase (public access)
- ✅ Kiểm tra CORS settings

```sql
-- Vercel domain cần được allow trong CORS
-- Thêm origin: https://your-domain.vercel.app
```

---

## 📊 Monitoring & Analytics

Trên Vercel Dashboard:
- **Deployments** - Lịch sử deploy
- **Builds** - Build logs
- **Functions** - Serverless function logs
- **Performance** - Analytics ứng dụng
- **Settings** - Cấu hình project

---

## 🛡️ Security Best Practices

- ✅ Không commit `.env.local`
- ✅ Luôn dùng NEXT_PUBLIC_ prefix cho client-side variables
- ✅ Set environment variables trên Vercel, không hardcode
- ✅ Set repository làm Private trên GitHub
- ✅ Kiểm tra Supabase RLS policies

---

## 📝 Quick Reference

**Vercel URL pattern:**
```
https://[project-name]-[git-username].vercel.app
```

**Redeploy lần cuối:**
Trên Vercel Dashboard → Deployments → Click deployment → "Redeploy"

**View logs:**
Deployments → Click deployment → "Logs"

---

## 🎉 Kết thúc!

Ứng dụng của bạn giờ sẽ live trên Vercel! 🚀

Mỗi khi push code, Vercel tự động build & deploy mới.

**Hãy share URL của bạn nhé! 😊**
