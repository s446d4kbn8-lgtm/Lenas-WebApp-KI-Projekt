import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.log('ADMIN_EMAIL / ADMIN_PASSWORD nicht gesetzt – Seed übersprungen.')
    return
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    if (existing.role !== 'admin') {
      await prisma.user.update({ where: { email }, data: { role: 'admin' } })
      console.log(`Admin-Rolle gesetzt für: ${email}`)
    } else {
      console.log(`Admin existiert bereits: ${email}`)
    }
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await prisma.user.create({ data: { email, passwordHash, role: 'admin' } })
  console.log(`Admin-Benutzer erstellt: ${email}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
