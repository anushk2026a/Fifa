import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Content-Security-Policy
// Note: Next.js App Router requires 'unsafe-inline' for its hydration scripts
// unless you implement a nonce-based approach via middleware (next step for v2).
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,  // Next.js runtime requires these
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: https:`,
  `font-src 'self' https:`,
  `connect-src 'self' ${API_URL}`,
  `frame-ancestors 'none'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  // Prevent browsers from MIME-sniffing a response away from the declared content-type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Block rendering inside <iframe> / <frame> on other origins.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Legacy XSS filter — still used by older browsers.
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Control referrer information sent with requests.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable unnecessary browser APIs to reduce attack surface.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Force HTTPS for 2 years; include subdomains; allow preloading.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "flagcdn.com" }],
  },
  async headers() {
    return [
      {
        // Apply to every route.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
