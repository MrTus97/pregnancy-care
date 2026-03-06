import type { NextConfig } from "next";
// @ts-ignore
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const withPWAConfig = withPWA({
  dest: "public",
  disable: false,
  register: true,
  skipWaiting: false,
  reloadOnOnline: true,
  clientsClaim: true,
});

export default withPWAConfig(nextConfig);
