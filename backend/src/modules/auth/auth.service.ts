import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { logger } from "../../shared/logger";
import type { Admin } from "./admin.repo";
import { getAdminStore } from "./admin.store";
import { getRefreshTokenStore } from "./refresh.store";

export type AuthPayload = { sub: string; email: string; role: "admin" };

// Dummy hash used for constant-time comparison when the admin is not found,
// preventing timing-based user enumeration attacks.
const DUMMY_HASH = "$2b$12$invalidhashfortimingprotection0000000000000000";

export async function hashPassword(plain: string): Promise<string> {
  // 12 rounds: ~300ms on modern hardware — strong enough to resist GPU cracking.
  return bcrypt.hash(plain, 12);
}

export async function upsertAdmin(email: string, password: string, name = "Site Admin") {
  const store = await getAdminStore();
  const passwordHash = await hashPassword(password);
  return store.upsert(email.toLowerCase(), {
    email: email.toLowerCase(),
    passwordHash,
    name,
    role: "admin",
  });
}

export async function ensureDefaultAdmin(): Promise<void> {
  const store = await getAdminStore();
  const existing = await store.findByEmail(env.ADMIN_EMAIL.toLowerCase());
  if (!existing) {
    await upsertAdmin(env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
    logger.info(`[auth] default admin seeded: ${env.ADMIN_EMAIL}`);
  }
}

export async function login(
  email: string,
  password: string,
  userAgent: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
  admin: Pick<Admin, "email" | "name" | "role">;
} | null> {
  const store = await getAdminStore();
  const admin = await store.findByEmail(email.toLowerCase());

  // Always run bcrypt.compare to prevent timing-based user enumeration.
  const hashToCheck = admin?.passwordHash ?? DUMMY_HASH;
  const valid = await bcrypt.compare(password, hashToCheck);
  if (!admin || !valid) return null;

  const payload: AuthPayload = { sub: admin.id, email: admin.email, role: "admin" };
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);

  const refreshStore = await getRefreshTokenStore();
  const { raw: refreshToken } = await refreshStore.create(
    admin.id,
    userAgent,
    env.REFRESH_TOKEN_EXPIRES_IN_MS,
  );

  logger.info("Admin login success", { email: admin.email });
  return { accessToken, refreshToken, admin: { email: admin.email, name: admin.name, role: admin.role } };
}

/**
 * Validates a refresh token, revokes it (rotation), and issues a new access token.
 * Returns null if the token is invalid, expired, or already revoked.
 */
export async function refreshAccessToken(
  rawRefreshToken: string,
): Promise<{ accessToken: string; admin: Pick<Admin, "email" | "name" | "role"> } | null> {
  const refreshStore = await getRefreshTokenStore();
  const record = await refreshStore.findValid(rawRefreshToken);
  if (!record) return null;

  const adminStore = await getAdminStore();
  const admin = await adminStore.findById(record.adminId);
  if (!admin) return null;

  // Rotate: one-time use — revoke this token before issuing the next.
  await refreshStore.revoke(record.id);

  const payload: AuthPayload = { sub: admin.id, email: admin.email, role: "admin" };
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);

  return { accessToken, admin: { email: admin.email, name: admin.name, role: admin.role } };
}

export async function revokeRefreshToken(raw: string): Promise<void> {
  const store = await getRefreshTokenStore();
  const record = await store.findValid(raw);
  if (record) await store.revoke(record.id);
}

export async function revokeAllRefreshTokens(adminId: string): Promise<void> {
  const store = await getRefreshTokenStore();
  await store.revokeAllFor(adminId);
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}
