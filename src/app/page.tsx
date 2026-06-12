import MessageForm from '@/components/MessageForm'
import Header from '@/components/Header'
import { getAuthUser } from '@/lib/auth'
import Link from 'next/link'

export default async function HomePage() {
  const user = await getAuthUser()

  return (
    <>
      <Header user={user} />
      <main className="min-h-[calc(100vh-86px)] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="font-handwriting text-5xl font-bold text-stone-800 rotate-1 inline-block">
              {user ? 'Schreib mir was!' : 'Hinterlasse eine Nachricht'}
            </h1>
            {!user && (
              <p className="text-stone-600 mt-3 text-sm">
                Melde dich an oder erstelle ein Konto, um etwas anzupinnen.
              </p>
            )}
          </div>

          {user ? (
            <MessageForm />
          ) : (
            <div className="relative bg-yellow-200 border border-yellow-300/60 rounded-sm shadow-xl p-8 -rotate-1">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-red-500 shadow" />
              <p className="text-stone-700 text-sm mb-6 text-center">
                Du brauchst ein Konto, um eine Nachricht zu hinterlassen.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/user-login"
                  className="w-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-medium py-3 rounded shadow-sm transition-colors text-sm text-center"
                >
                  Anmelden
                </Link>
                <Link
                  href="/register"
                  className="w-full bg-orange-400 hover:bg-orange-300 border border-orange-500/40 text-stone-900 font-medium py-3 rounded shadow-sm transition-colors text-sm text-center"
                >
                  Konto erstellen
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
