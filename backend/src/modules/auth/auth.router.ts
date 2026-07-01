import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../../shared/http/validate";
import { authRateLimit } from "../../shared/middleware/rate-limit";
import { logger } from "../../shared/logger";
import { env } from "../../config/env";
import {
  login,
  refreshAccessToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
} from "./auth.service";
import { requireAdmin, type AuthedRequest } from "./auth.middleware";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
});

const isProd = env.NODE_ENV === "production";

// Frontend and backend live on different domains, so auth cookies are
// cross-site — SameSite=None (which requires Secure) is required for the
// browser to send them back on subsequent requests.
const COOKIE_BASE = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
} as const;

// POST /auth/login
authRouter.post("/login", authRateLimit, validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body as z.infer<typeof loginSchema>;
    const userAgent = req.get("User-Agent") ?? "unknown";
    const result = await login(email, password, userAgent);
    if (!result) {
      logger.warn("Failed login attempt", { email, ip: req.ip });
      return res.status(401).json({ ok: false, error: "INVALID_CREDENTIALS" });
    }

    // Access token: short-lived, available site-wide.
    // path must be explicit — without it, Express scopes the cookie to the
    // directory of this route ("/auth"), so it never reaches "/contact",
    // "/news", etc. and every non-/auth request looks unauthenticated.
    res.cookie("accessToken", result.accessToken, {
      ...COOKIE_BASE,
      path: "/",
      maxAge: 15 * 60 * 1_000,
    });
    // Refresh token: long-lived but scoped to /auth/refresh only.
    res.cookie("refreshToken", result.refreshToken, {
      ...COOKIE_BASE,
      maxAge: env.REFRESH_TOKEN_EXPIRES_IN_MS,
      path: "/auth/refresh",
    });

    // Return admin info only — never return raw tokens in the body.
    res.json({ ok: true, admin: result.admin });
  } catch (err) {
    next(err);
  }
});

// POST /auth/refresh — exchange a valid refresh token for a new access token.
authRouter.post("/refresh", authRateLimit, async (req, res, next) => {
  try {
    const raw = req.cookies?.refreshToken as string | undefined;
    if (!raw) {
      return res.status(401).json({ ok: false, error: "MISSING_REFRESH_TOKEN" });
    }
    const result = await refreshAccessToken(raw);
    if (!result) {
      res.clearCookie("refreshToken", { path: "/auth/refresh" });
      return res.status(401).json({ ok: false, error: "INVALID_REFRESH_TOKEN" });
    }

    res.cookie("accessToken", result.accessToken, {
      ...COOKIE_BASE,
      path: "/",
      maxAge: 15 * 60 * 1_000,
    });
    res.json({ ok: true, admin: result.admin });
  } catch (err) {
    next(err);
  }
});

// POST /auth/logout — revoke this device's refresh token and clear cookies.
authRouter.post("/logout", async (req, res, next) => {
  try {
    const raw = req.cookies?.refreshToken as string | undefined;
    if (raw) await revokeRefreshToken(raw);
    res.clearCookie("accessToken", { ...COOKIE_BASE, path: "/" });
    res.clearCookie("refreshToken", { ...COOKIE_BASE, path: "/auth/refresh" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// POST /auth/logout-all — revoke all sessions for the authenticated admin.
authRouter.post("/logout-all", requireAdmin, async (req: AuthedRequest, res, next) => {
  try {
    await revokeAllRefreshTokens(req.admin!.sub);
    res.clearCookie("accessToken", { ...COOKIE_BASE, path: "/" });
    res.clearCookie("refreshToken", { ...COOKIE_BASE, path: "/auth/refresh" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// GET /auth/me — verify the current access token is valid and return admin info.
authRouter.get("/me", requireAdmin, (req: AuthedRequest, res) => {
  res.json({ ok: true, admin: { email: req.admin!.email, role: req.admin!.role } });
});
