import { getAuthUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import RegisterForm from '@/components/RegisterForm'
import Link from 'next/link'

export default async function RegisterPage() {
  const user = await getAuthUser()
  if (user) redirect('/')

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Konto erstellen</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Registriere dich, um eine Nachricht zu hinterlassen.
          </p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-zinc-400 mt-4">
          Schon ein Konto?{' '}
          <Link href="/user-login" className="text-violet-400 hover:underline">
            Anmelden
          </Link>
        </p>
      </div>
    </main>
  )
}
