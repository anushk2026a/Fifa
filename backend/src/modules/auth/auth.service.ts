import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { adminRepo, type Admin } from "./admin.repo";

export type AuthPayload = { sub: string; email: string; role: "admin" };

export function hashPassword(plain: string): string {
  return bcrypt.hashSync(plain, 10);
}

/** Create the admin if it doesn't exist yet; otherwise reset its password.
 *  Used by the seed script — safe to run repeatedly. */
export function upsertAdmin(email: string, password: string, name = "Site Admin"): Admin {
  const existing = adminRepo.findOne((a) => a.email.toLowerCase() === email.toLowerCase());
  const passwordHash = hashPassword(password);
  if (existing) {
    adminRepo.deleteById(existing.id);
  }
  const row = adminRepo.insert({ email: email.toLowerCase(), passwordHash, name, role: "admin" });
  return row;
}

/** Returns a signed JWT if the credentials match an admin, else null. */
export function login(email: string, password: string): { token: string; admin: Pick<Admin, "email" | "name" | "role"> } | null {
  const admin = adminRepo.findOne((a) => a.email.toLowerCase() === email.toLowerCase());

  if (admin) {
    if (!bcrypt.compareSync(password, admin.passwordHash)) return null;
    const payload: AuthPayload = { sub: admin.id, email: admin.email, role: "admin" };
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
    return { token, admin: { email: admin.email, name: admin.name, role: admin.role } };
  }

  // Fallback for ephemeral hosts (Vercel) where the JSON file store has no
  // seeded admin — check credentials directly against env vars.
  if (
    email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase() &&
    password === env.ADMIN_PASSWORD
  ) {
    const payload: AuthPayload = { sub: "env-admin", email: env.ADMIN_EMAIL, role: "admin" };
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
    return { token, admin: { email: env.ADMIN_EMAIL, name: "Site Admin", role: "admin" } };
  }

  return null;
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}
