import type { NextRequest } from 'next/server'

/**
 * Double-Submit-Cookie-Muster:
 * Middleware setzt ein nicht-httpOnly-Cookie "csrf_token".
 * Client liest es via document.cookie und schickt es als X-CSRF-Token-Header.
 * Server vergleicht Cookie- und Header-Wert (Timing-sicher).
 */
export function validateCsrfToken(req: NextRequest): boolean {
  const cookieToken = req.cookies.get('csrf_token')?.value
  const headerToken = req.headers.get('x-csrf-token')

  if (!cookieToken || !headerToken) return false
  if (cookieToken.length !== headerToken.length) return false

  // Timing-sichere Zeichenvergleich (verhindert Timing-Angriffe)
  let mismatch = 0
  for (let i = 0; i < cookieToken.length; i++) {
    mismatch |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i)
  }
  return mismatch === 0
}
