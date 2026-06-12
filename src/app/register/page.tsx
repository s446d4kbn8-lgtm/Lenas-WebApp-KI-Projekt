import { getAuthUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import RegisterForm from '@/components/RegisterForm'
import Header from '@/components/Header'
import Link from 'next/link'

export default async function RegisterPage() {
  const user = await getAuthUser()
  if (user) redirect('/')

  return (
    <>
      <Header user={null} />
      <main className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Konto erstellen</h1>
            <p className="text-white/60 text-sm mt-1">
              Registriere dich, um eine Nachricht zu hinterlassen.
            </p>
          </div>
          <RegisterForm />
          <p className="text-center text-sm text-white/60 mt-6">
            Schon ein Konto?{' '}
            <Link href="/user-login" className="text-fuchsia-400 font-medium hover:underline">
              Anmelden
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
