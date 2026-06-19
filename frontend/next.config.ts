import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles Next.js natively — no static export needed.
  // output: "export" has been removed so Vercel can use its built-in
  // Next.js runtime (SSR, image optimization, etc.).
  trailingSlash: true,
};

export default nextConfig;
