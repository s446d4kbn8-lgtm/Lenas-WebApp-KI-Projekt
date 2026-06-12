import { getAuthUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import Header from '@/components/Header'

export default async function LoginPage() {
  const user = await getAuthUser()
  if (user?.role === 'admin') redirect('/admin')
  if (user) redirect('/')

  return (
    <>
      <Header user={null} />
      <main className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Admin-Login</h1>
            <p className="text-white/60 text-sm mt-1">Zugang für Administratoren</p>
          </div>
          <LoginForm />
        </div>
      </main>
    </>
  )
}
