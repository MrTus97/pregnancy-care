# Hướng Dẫn Triển Khai PWA - Pregnancy Care Tracker

## 📱 PWA đã được cấu hình hoàn thành!

Ứng dụng Pregnancy Care Tracker giờ đây có thể được cài đặt trên các thiết bị như một app native!

## ✨ Các tính năng PWA

- ✅ **Offline Support** - Hoạt động mà không cần internet
- ✅ **Installable** - Cài đặt trên home screen
- ✅ **App-like Experience** - Giao diện giống app native
- ✅ **Service Worker** - Cache thông minh, tải nhanh
- ✅ **Available on All Devices** - Desktop, iOS, Android

## 🚀 Triển Khai (Deployment)

### Trên Server VPS / Hosting

1. **Push code lên repository**
```bash
git add .
git commit -m "Add PWA support"
git push origin main
```

2. **Build trên server**
```bash
# SSH vào server
ssh user@your-server.com

# Clone repo
git clone <your-repo-url>
cd counterDate

# Cài dependencies
npm install

# Build production
npm run build

# Start app
npm start
# hoặc dùng PM2/Docker
pm2 start ecosystem.config.js
```

3. **Cấu hình Nginx/Apache**
Đảm bảo các header được set đúng:
```nginx
# Nginx config
server {
  listen 443 ssl http2;
  server_name yourdomain.com;
  
  # Important: Add security headers
  add_header X-Content-Type-Options nosniff;
  add_header X-Frame-Options SAMEORIGIN;
  add_header X-XSS-Protection "1; mode=block";
  
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_cache_bypass $http_upgrade;
  }
  
  # Serve manifest with correct MIME type
  location /manifest.json {
    add_header Content-Type application/manifest+json;
  }
  
  # Cache static assets
  location /_next/static {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

4. **SSL Certificate (HTTPS)**
⚠️ **QUAN TRỌNG**: PWA **yêu cầu HTTPS**. Sử dụng Let's Encrypt:
```bash
certbot certonly --standalone -d yourdomain.com
certbot renew --dry-run  # Test auto-renewal
```

### Với Docker

```bash
# Build image
docker build -t pregnancy-care .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  pregnancy-care
```

### Với Docker Compose

Ứng dụng đã có `docker-compose.yml` sẵn sàng!
```bash
docker-compose up -d
```

## 📲 Hướng dẫn cài đặt cho người dùng

### iPhone / iPad 📱

1. Mở **Safari**
2. Truy cập trang web: `https://yourdomain.com`
3. Nhấn **⎕ Share** (icon chia sẻ)
4. Chọn **"Add to Home Screen"**
5. Đặt tên (mặc định: "Pregnancy Care")
6. Nhấn **Add**

✅ App sẽ xuất hiện trên home screen!

### Android 🤖

1. Mở **Chrome** (hoặc trình duyệt khác)
2. Truy cập: `https://yourdomain.com`
3. Hộp thoại "Install" sẽ xuất hiện tự động
4. Nhấn **Install** (hoặc chọn từ menu: More > Install app)
5. App sẽ thêm vào home screen

### Desktop 💻

1. Mở trình duyệt (Chrome, Edge, Firefox)
2. Truy cập trang web
3. Nhấn icon **+** hoặc **...** → "Install app"
4. Xác nhận cài đặt

## 🔍 Xác thực PWA hoạt động

### Trong DevTools (F12)

1. Mở **Developer Tools** (F12)
2. Đi tới **Application** tab
3. Kiểm tra:
   - ✅ **Manifest** - Phải show "manifest valid"
   - ✅ **Service Workers** - Phải show "/sw" running
   - ✅ **Storage** - Phải thấy cached files

### Kiểm tra Manifest

```bash
curl https://yourdomain.com/manifest.json
```

Phải trả về JSON hợp lệ với tất cả các field.

## 🎨 Tùy chỉnh Icon

Icons hiện tại là SVG. Để có icons đẹp hơn:

1. **Tạo icon mới** (192x192 & 512x512 pixels)
2. **Save as PNG** vào `public/icons/`
3. **Update manifest.json** để reference PNG files
4. **Rebuild**: `npm run build`

Công cụ tạo icon:
- Figma (free)
- Canva
- GIMP
- ImageMagick

```bash
# Tạo PNG từ SVG (với ImageMagick)
convert -density 192 public/icons/icon-192x192.svg -resize 192x192 public/icons/icon-192x192.png
convert -density 512 public/icons/icon-192x192.svg -resize 512x512 public/icons/icon-512x512.png
```

## 🔐 Security Checklist

- ✅ HTTPS enabled
- ✅ manifest.json served correctly
- ✅ Service worker registered
- ✅ Content Security Policy headers set
- ✅ X-Content-Type-Options: nosniff
- ✅ Supabase anon key < configured securely

## 📊 Files sinh ra bởi PWA

Những file sau tự động tạo trong build:
- `/public/sw.js` - Service Worker (Workbox)
- `/public/workbox-*.js` - Workbox library
- `/public/manifest.json` - PWA manifest (bạn tạo)
- `/public/browserconfig.xml` - Windows tiles (bạn tạo)
- `/public/icons/` - App icons (bạn tạo)

## 🐛 Troubleshooting

### "Cannot add to home screen"
- ✅ Kiểm tra HTTPS
- ✅ Kiểm tra manifest.json hợp lệ
- ✅ Kiểm tra service worker đang chạy

### "Offline mode not working"
- ✅ Kiểm tra service worker trong DevTools
- ✅ Refresh trang lần đầu tiên offline
- ✅ Kiểm tra Network tab → Application Cache

### "Icon không hiển thị"
- ✅ Kiểm tra file PNG tồn tại
- ✅ Kiểm tra path đúng trong manifest.json
- ✅ Icon phải ít nhất 192x192 pixels

## 📚 Tài liệu tham khảo

- [Web.dev - Install PWA](https://web.dev/install-criteria/)
- [MDN - Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [next-pwa Documentation](https://github.com/shadowwalker/next-pwa)
- [Workbox - Web Service Workers](https://developers.google.com/web/tools/workbox)

## 📝 Checklist trước khi go live

- [ ] HTTPS cấu hình
- [ ] Icons tạo (192x512)
- [ ] manifest.json test
- [ ] Service worker working
- [ ] DevTools check passed
- [ ] Test install iPhone
- [ ] Test install Android
- [ ] Test install Desktop
- [ ] Test offline mode
- [ ] Supabase CORS configured
- [ ] Custom domain setup

---

**✨ Congratulations!** Ứng dụng Pregnancy Care Tracker của bạn giờ là một PWA hoàn toàn! 🎉
