import MessageForm from '@/components/MessageForm'
import LogoutButton from '@/components/LogoutButton'
import { getAuthUser } from '@/lib/auth'
import Link from 'next/link'

export default async function HomePage() {
  const user = await getAuthUser()

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 mb-4">
              <span className="text-violet-400 text-xl">✦</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Pinnwand</h1>
            <p className="text-zinc-400 text-sm mt-2">
              Melde dich an oder erstelle ein Konto, um eine Nachricht zu hinterlassen.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/user-login"
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium py-3 rounded-xl transition-colors text-sm text-center"
            >
              Anmelden
            </Link>
            <Link
              href="/register"
              className="w-full border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900 text-zinc-200 font-medium py-3 rounded-xl transition-colors text-sm text-center"
            >
              Konto erstellen
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      <div className="w-full max-w-lg">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/30 mb-3">
              <span className="text-violet-400 text-lg">✦</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Pinnwand</h1>
            <p className="text-zinc-400 mt-1 text-sm">Angemeldet als {user.email}</p>
          </div>
          <LogoutButton />
        </div>
        <MessageForm />
      </div>
    </main>
  )
}
