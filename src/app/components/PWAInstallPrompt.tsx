"use client";

import { useEffect, useState } from "react";

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check for iOS
    const ua = navigator.userAgent.toLowerCase();
    const isIOSDevice =
      /iphone|ipad|ipod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for Android install prompt
    let deferredPrompt: any;
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    const deferredPrompt = (window as any).deferredPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        setShowPrompt(false);
      }
      (window as any).deferredPrompt = null;
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (isInstalled) {
    return null;
  }

  if (isIOS) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 16,
          left: 16,
          right: 16,
          padding: 12,
          background: "#1f7a4f",
          color: "#fff",
          borderRadius: 8,
          fontSize: "0.9rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          zIndex: 1000,
        }}
      >
        <p style={{ margin: "0 0 8px 0" }}>
          📱 <strong>Thêm vào Home Screen</strong>
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", opacity: 0.9 }}>
          Nhấn <strong>⎕ Chia sẻ</strong> → <strong>Thêm vào Home Screen</strong>
        </p>
        <button
          onClick={handleDismiss}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Đã hiểu
        </button>
      </div>
    );
  }

  if (showPrompt) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 16,
          left: 16,
          right: 16,
          padding: 16,
          background: "#1f7a4f",
          color: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        <p style={{ margin: "0 0 12px 0", fontWeight: 600 }}>
          📱 Cài đặt Pregnancy Care
        </p>
        <p style={{ margin: "0 0 12px 0", fontSize: "0.9rem", opacity: 0.95 }}>
          Thêm app vào màn hình chính để truy cập nhanh hơn
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleInstallClick}
            style={{
              flex: 1,
              background: "#fff",
              color: "#1f7a4f",
              border: "none",
              padding: "8px 16px",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            Cài đặt
          </button>
          <button
            onClick={handleDismiss}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Sau này
          </button>
        </div>
      </div>
    );
  }

  return null;
}
