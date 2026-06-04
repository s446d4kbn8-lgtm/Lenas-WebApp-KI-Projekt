import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Auth wird bereits in middleware.ts geprüft (defense-in-depth)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.message.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Nachricht nicht gefunden' }, { status: 404 })
  }
}
