import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-please-change"
);

export type SessionPayload = {
  sub: string;
  role: "user" | "admin";
  email: string;
};

const COOKIE_USER = "mfrx_session";
const COOKIE_ADMIN = "mfrx_admin";

export async function sign(payload: SessionPayload) {
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verify(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function hashPw(pw: string) {
  return bcrypt.hash(pw, 10);
}
export function checkPw(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export async function setSession(payload: SessionPayload) {
  const token = await sign(payload);
  const name = payload.role === "admin" ? COOKIE_ADMIN : COOKIE_USER;
  cookies().set(name, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession(role: "user" | "admin") {
  cookies().delete(role === "admin" ? COOKIE_ADMIN : COOKIE_USER);
}

export async function getUserSession() {
  const t = cookies().get(COOKIE_USER)?.value;
  if (!t) return null;
  const p = await verify(t);
  return p?.role === "user" ? p : null;
}

export async function getAdminSession() {
  const t = cookies().get(COOKIE_ADMIN)?.value;
  if (!t) return null;
  const p = await verify(t);
  return p?.role === "admin" ? p : null;
}
