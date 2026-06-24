import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import type { Admin } from "./admin.repo";
import { getAdminStore } from "./admin.store";

export type AuthPayload = { sub: string; email: string; role: "admin" };

export function hashPassword(plain: string): string {
  return bcrypt.hashSync(plain, 10);
}

export async function upsertAdmin(email: string, password: string, name = "Site Admin") {
  const store = await getAdminStore();
  const passwordHash = hashPassword(password);
  return store.upsert(email.toLowerCase(), {
    email: email.toLowerCase(),
    passwordHash,
    name,
    role: "admin",
  });
}

/** Seeds the default admin from env vars if no admin exists yet. Safe to call on every cold start. */
export async function ensureDefaultAdmin(): Promise<void> {
  const store = await getAdminStore();
  const existing = await store.findByEmail(env.ADMIN_EMAIL.toLowerCase());
  if (!existing) {
    await upsertAdmin(env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
    console.log(`[auth] default admin seeded → ${env.ADMIN_EMAIL}`);
  }
}

export async function login(
  email: string,
  password: string,
): Promise<{ token: string; admin: Pick<Admin, "email" | "name" | "role"> } | null> {
  const store = await getAdminStore();
  const admin = await store.findByEmail(email.toLowerCase());
  if (!admin) return null;
  if (!bcrypt.compareSync(password, admin.passwordHash)) return null;

  const payload: AuthPayload = { sub: admin.id, email: admin.email, role: "admin" };
  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
  return { token, admin: { email: admin.email, name: admin.name, role: admin.role } };
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}
