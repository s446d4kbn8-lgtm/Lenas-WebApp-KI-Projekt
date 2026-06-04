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

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return false
  try {
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Geschützte Seiten: /admin/*
  if (pathname.startsWith('/admin')) {
    if (!(await isAuthenticated(request))) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Geschützte API: DELETE /api/messages/[id]
  if (
    pathname.match(/^\/api\/messages\/[^/]+$/) &&
    request.method === 'DELETE'
  ) {
    if (!(await isAuthenticated(request))) {
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
