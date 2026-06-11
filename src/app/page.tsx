import MessageForm from '@/components/MessageForm'
import LogoutButton from '@/components/LogoutButton'
import { getAuthUser } from '@/lib/auth'
import Link from 'next/link'

export default async function HomePage() {
  const user = await getAuthUser()

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nachricht hinterlassen</h1>
          <p className="text-gray-500 mb-8">
            Um eine Nachricht zu hinterlassen, melde dich bitte an oder erstelle ein kostenloses Konto.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/user-login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors text-sm"
            >
              Anmelden
            </Link>
            <Link
              href="/register"
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors text-sm"
            >
              Konto erstellen
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nachricht hinterlassen</h1>
            <p className="text-gray-500 mt-2 text-sm">Angemeldet als {user.email}</p>
          </div>
          <LogoutButton />
        </div>
        <MessageForm />
      </div>
    </main>
  )
}
