# PWA Setup Guide - Hướng Dẫn Cấu Hình PWA

## Cấu hình đã được hoàn thành ✅

PWA (Progressive Web App) đã được cấu hình hoàn toàn để bạn có thể cài đặt app trên:
- 📱 iPhone/iPad (qua "Thêm vào Home Screen")
- 🤖 Android (qua cửa sổ cài đặt tự động)
- 💻 Desktop

## Sử dụng trên iPhone 📱

1. Mở Safari
2. Truy cập trang web
3. Nhấn **⎕ Chia sẻ** (Share button)
4. Chọn **"Thêm vào Home Screen"** (Add to Home Screen)
5. Nhập tên app (mặc định: "Pregnancy Care")
6. Nhấn **Thêm** (Add)

App sẽ xuất hiện trên màn hình chính như một app thường!

## Sử dụng trên Android 🤖

1. Mở Chrome/trình duyệt web
2. Truy cập trang web
3. Một hộp thoại sẽ xuất hiện với nút "Cài đặt" (Install)
4. Nhấn **Cài đặt** để thêm app vào home screen
5. App sẽ xuất hiện trên màn hình chính

## Ưu điểm khi cài đặt PWA

✨ **Offline Support**: Có thể sử dụng app khi không có kết nối internet
📱 **App-like Experience**: Giao diện như app native, không có thanh địa chỉ
⚡ **Nhanh hơn**: Tải nhanh nhất trong lần mở tiếp theo
📲 **Cài đặt dễ**: Không cần vào App Store/Play Store

## Icons (Biểu tượng)

Các icons đã được cấu hình trong `public/manifest.json`:
- 192x192px - Dùng cho màn hình chính
- 512x512px - Dùng cho splash screen

**Lưu ý**: Để có icons đẹp hơn, hãy thay thế các file PNG trong `public/icons/` bằng các biểu tượng tùy chỉnh của bạn.

## Tạo PNG Icons từ SVG

Bạn có thể dùng các công cụ online như:
- https://convertio.co/svg-png/
- https://image.online-convert.com/convert-to-png
- https://cloudconvert.com/

Hoặc dùng ImageMagick (nếu cài sẵn):
```bash
convert -density 192 public/icons/icon-192x192.svg -resize 192x192 public/icons/icon-192x192.png
convert -density 512 public/icons/icon-192x192.svg -resize 512x512 public/icons/icon-512x512.png
```

## Files đã tạo

- `public/manifest.json` - Cấu hình PWA
- `public/browserconfig.xml` - Cấu hình Windows tiles
- `public/icons/icon-192x192.svg` - App icon (SVG)
- `src/app/components/PWAInstallPrompt.tsx` - Component hiển thị hướng dẫn cài đặt
- `next.config.ts` - Cấu hình next-pwa
- `src/app/layout.tsx` - Meta tags PWA

## Kiểm tra PWA

Mở DevTools (F12) → Application tab:
1. Xem phần "Manifest" để kiểm tra manifest.json
2. Xem phần "Service Workers" để kiểm tra service worker
3. Nếu "manifest valid" ✅ thì PWA đã cấu hình đúng!
