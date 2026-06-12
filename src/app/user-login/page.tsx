import { getAuthUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import Header from '@/components/Header'
import Link from 'next/link'

export default async function UserLoginPage() {
  const user = await getAuthUser()
  if (user) redirect('/')

  return (
    <>
      <Header user={null} />
      <main className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 bg-zinc-950">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Anmelden</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Melde dich an, um eine Nachricht zu hinterlassen.
            </p>
          </div>
          <LoginForm redirectTo="/" />
          <p className="text-center text-sm text-zinc-400 mt-4">
            Noch kein Konto?{' '}
            <Link href="/register" className="text-violet-400 hover:underline">
              Registrieren
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
