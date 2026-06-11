import { getAuthUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import Link from 'next/link'

export default async function UserLoginPage() {
  const user = await getAuthUser()
  if (user) redirect('/')

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Anmelden</h1>
          <p className="text-gray-500 text-sm mt-1">
            Melde dich an, um eine Nachricht zu hinterlassen.
          </p>
        </div>
        <LoginForm redirectTo="/" />
        <p className="text-center text-sm text-gray-500 mt-4">
          Noch kein Konto?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Registrieren
          </Link>
        </p>
      </div>
    </main>
  )
}
