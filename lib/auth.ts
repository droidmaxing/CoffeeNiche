import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { UserRole } from "@prisma/client";

const SESSION_COOKIE = "coffeeniche_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

export type SessionUser = {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
};

function signingKey() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("NEXTAUTH_SECRET must be configured with at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(signingKey());
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, signingKey());
    if (
      typeof payload.userId !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.email !== "string" ||
      !["OWNER", "ADMIN", "CASHIER"].includes(String(payload.role))
    ) {
      return null;
    }
    return {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
      role: payload.role as UserRole,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXTAUTH_SECRET")) {
      throw error;
    }
    return null;
  }
}

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

export async function setSessionCookie(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

export const sessionCookieName = SESSION_COOKIE;
