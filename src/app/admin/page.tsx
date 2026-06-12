import { getAuthUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/AdminDashboard'
import LogoutButton from '@/components/LogoutButton'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')

  const messages = await db.message.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, content: true, createdAt: true },
  })

  const serialized = messages.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  }))

  return (
    <main className="min-h-screen bg-zinc-950">
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Angemeldet als {user.email}</p>
          </div>
          <LogoutButton redirectTo="/login" />
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <AdminDashboard messages={serialized} />
      </div>
    </main>
  )
}
