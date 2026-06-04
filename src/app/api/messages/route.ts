import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateCsrfToken } from '@/lib/csrf'
import { isRateLimited } from '@/lib/rate-limit'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben').max(100),
  email: z
    .string()
    .email('Ungültige E-Mail-Adresse')
    .max(200)
    .optional()
    .or(z.literal('')),
  content: z
    .string()
    .min(10, 'Nachricht muss mindestens 10 Zeichen haben')
    .max(2000),
})

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  // CSRF-Prüfung
  if (!validateCsrfToken(req)) {
    return NextResponse.json(
      { error: 'Ungültiger Sicherheits-Token. Bitte Seite neu laden.' },
      { status: 403 }
    )
  }

  // Rate Limiting
  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte später erneut versuchen.' },
      { status: 429 }
    )
  }

  // Eingabe validieren
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? 'Ungültige Eingabe'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const { name, email, content } = parsed.data

  await db.message.create({
    data: {
      name: name.trim(),
      email: email?.trim() || null,
      content: content.trim(),
      ip,
    },
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
