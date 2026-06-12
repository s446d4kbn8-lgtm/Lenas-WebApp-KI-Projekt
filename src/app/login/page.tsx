import { getAuthUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/LoginForm'

export default async function LoginPage() {
  const user = await getAuthUser()
  if (user?.role === 'admin') redirect('/admin')
  if (user) redirect('/')

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Admin-Login</h1>
          <p className="text-zinc-400 text-sm mt-1">Zugang für Administratoren</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
