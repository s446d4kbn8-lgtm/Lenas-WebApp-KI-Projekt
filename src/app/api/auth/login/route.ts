import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createToken, AUTH_COOKIE_OPTIONS } from '@/lib/auth'
import { validateCsrfToken } from '@/lib/csrf'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  // CSRF-Prüfung
  if (!validateCsrfToken(req)) {
    return NextResponse.json(
      { error: 'Ungültiger Sicherheits-Token.' },
      { status: 403 }
    )
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ungültige Eingabe' }, { status: 400 })
  }

  const { email, password } = parsed.data
  const user = await db.user.findUnique({ where: { email } })

  // Immer bcrypt.compare aufrufen, um Timing-Angriffe zu erschweren
  const passwordOk = user
    ? await bcrypt.compare(password, user.passwordHash)
    : await bcrypt.compare(password, '$2b$12$invalidhashfortimingatk')

  if (!user || !passwordOk) {
    return NextResponse.json(
      { error: 'E-Mail-Adresse oder Passwort ist falsch.' },
      { status: 401 }
    )
  }

  const token = await createToken({ userId: user.id, email: user.email })

  const response = NextResponse.json({ ok: true })
  response.cookies.set({ ...AUTH_COOKIE_OPTIONS, value: token })
  return response
}
