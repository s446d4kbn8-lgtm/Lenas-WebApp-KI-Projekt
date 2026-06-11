import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-fallback-secret-change-in-production'
)

function generateToken(): string {
  const buf = new Uint8Array(32)
  crypto.getRandomValues(buf)
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('')
}

interface AuthPayload {
  userId: string
  email: string
  role: string
}

async function getAuthPayload(req: NextRequest): Promise<AuthPayload | null> {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: (payload.role as string) ?? 'user',
    }
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const auth = await getAuthPayload(request)

  // Geschützte Seiten: /admin/*
  if (pathname.startsWith('/admin')) {
    if (!auth || auth.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Nachricht erstellen erfordert Login
  if (pathname === '/api/messages' && request.method === 'POST') {
    if (!auth) {
      return NextResponse.json(
        { error: 'Bitte melde dich an, um eine Nachricht zu hinterlassen.' },
        { status: 401 }
      )
    }
  }

  // Geschützte API: DELETE /api/messages/[id] – nur Admin
  if (
    pathname.match(/^\/api\/messages\/[^/]+$/) &&
    request.method === 'DELETE'
  ) {
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }
  }

  const response = NextResponse.next()

  // CSRF-Cookie setzen, falls noch nicht vorhanden
  if (!request.cookies.has('csrf_token')) {
    response.cookies.set({
      name: 'csrf_token',
      value: generateToken(),
      httpOnly: false, // muss per JS lesbar sein (double-submit)
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
