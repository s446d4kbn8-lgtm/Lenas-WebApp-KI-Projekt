import MessageForm from '@/components/MessageForm'
import Header from '@/components/Header'
import { getAuthUser } from '@/lib/auth'
import Link from 'next/link'

export default async function HomePage() {
  const user = await getAuthUser()

  return (
    <>
      <Header user={user} />
      <main className="min-h-[calc(100vh-65px)] bg-zinc-950">
        <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 mb-6">
              <span className="text-violet-400 text-xl">✦</span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Hinterlasse
              <br />
              eine Nachricht
            </h1>
            <p className="text-zinc-400 text-base max-w-sm">
              {user
                ? 'Schön, dass du da bist. Schreib mir, was dich bewegt.'
                : 'Melde dich an oder erstelle ein kostenloses Konto, um eine Nachricht zu hinterlassen.'}
            </p>
          </div>

          <div>
            {user ? (
              <MessageForm />
            ) : (
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
                <p className="text-zinc-300 text-sm mb-6">
                  Du brauchst ein Konto, um eine Nachricht zu schreiben.
                </p>
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
            )}
          </div>
        </div>
      </main>
    </>
  )
}
