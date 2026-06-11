import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createToken, AUTH_COOKIE_OPTIONS } from '@/lib/auth'
import { validateCsrfToken } from '@/lib/csrf'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse').max(200),
  password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen haben').max(100),
})

export async function POST(req: NextRequest) {
  if (!validateCsrfToken(req)) {
    return NextResponse.json(
      { error: 'Ungültiger Sicherheits-Token. Bitte Seite neu laden.' },
      { status: 403 }
    )
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? 'Ungültige Eingabe'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const { email, password } = parsed.data

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json(
      { error: 'Diese E-Mail-Adresse ist bereits registriert.' },
      { status: 409 }
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await db.user.create({ data: { email, passwordHash, role: 'user' } })

  const token = await createToken({ userId: user.id, email: user.email, role: user.role })

  const response = NextResponse.json({ ok: true }, { status: 201 })
  response.cookies.set({ ...AUTH_COOKIE_OPTIONS, value: token })
  return response
}
