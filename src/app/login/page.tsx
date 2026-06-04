import { getAuthUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/LoginForm'

export default async function LoginPage() {
  const user = await getAuthUser()
  if (user) redirect('/admin')

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin-Login</h1>
          <p className="text-gray-500 text-sm mt-1">Zugang für Administratoren</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
