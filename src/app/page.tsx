import MessageForm from '@/components/MessageForm'
import Header from '@/components/Header'
import { getAuthUser } from '@/lib/auth'
import Link from 'next/link'

export default async function HomePage() {
  const user = await getAuthUser()

  return (
    <>
      <Header user={user} />
      <main className="min-h-[calc(100vh-65px)] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">
              {user ? 'Schreib mir etwas' : 'Hinterlasse eine Nachricht'}
            </h1>
            {!user && (
              <p className="text-white/60 text-sm">
                Melde dich an oder erstelle ein kostenloses Konto, um eine Nachricht zu hinterlassen.
              </p>
            )}
          </div>

          {user ? (
            <MessageForm />
          ) : (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
              <p className="text-white/70 text-sm mb-6 text-center">
                Du brauchst ein Konto, um eine Nachricht zu hinterlassen.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/user-login"
                  className="w-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:opacity-90 text-white font-medium py-3 rounded-xl transition-opacity text-sm text-center"
                >
                  Anmelden
                </Link>
                <Link
                  href="/register"
                  className="w-full border border-white/20 hover:bg-white/5 text-white font-medium py-3 rounded-xl transition-colors text-sm text-center"
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
