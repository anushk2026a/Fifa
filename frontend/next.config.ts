import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Phase 1 is a fully static site (see docs/05-architecture.md).
  output: "export",
  images: {
    // Static export has no image optimization server.
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
