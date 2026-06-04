import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-fallback-secret-change-in-production'
)

const COOKIE_NAME = 'auth_token'
const MAX_AGE = 60 * 60 * 24 // 24 Stunden

export interface AuthPayload {
  userId: string
  email: string
}

export async function createToken(payload: AuthPayload): Promise<string> {
  return new SignJWT({ userId: payload.userId, email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return {
      userId: payload.userId as string,
      email: payload.email as string,
    }
  } catch {
    return null
  }
}

// Nur in Server Components (read-only)
export async function getAuthUser(): Promise<AuthPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export const AUTH_COOKIE_OPTIONS = {
  name: COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: MAX_AGE,
  path: '/',
}
