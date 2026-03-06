import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pregnancy Care Tracker",
  description: "Track pregnancy day count, weight gain targets, and reminders.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pregnancy Care",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-title": "Pregnancy Care",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Pregnancy Care",
    "theme-color": "#1f7a4f",
    "msapplication-TileColor": "#1f7a4f",
    "msapplication-TileImage": "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        <meta name="theme-color" content="#1f7a4f" />
        <meta name="description" content="Công cụ theo dõi thai kỳ - Cân nặng, cảnh báo, thông tin thai kỳ" />
        
        {/* Apple Web App Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Pregnancy Care" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        
        {/* PWA Meta */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon-192x192.svg" />
        
        {/* Additional PWA Support */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Pregnancy Care" />
        <meta name="msapplication-TileColor" content="#1f7a4f" />
        <meta name="msapplication-TileImage" content="/icons/icon-192x192.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
