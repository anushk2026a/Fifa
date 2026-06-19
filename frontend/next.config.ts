import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles Next.js natively — no static export needed.
  // output: "export" has been removed so Vercel can use its built-in
  // Next.js runtime (SSR, image optimization, etc.).
  trailingSlash: true,
  images: {
    // Allow country flag images (used on the match cards).
    remotePatterns: [{ protocol: "https", hostname: "flagcdn.com" }],
  },
};

export default nextConfig;
