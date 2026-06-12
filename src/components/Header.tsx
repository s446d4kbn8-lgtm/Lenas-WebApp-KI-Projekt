import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default function Header({ user }: { user?: { email: string } | null }) {
  return (
    <header className="border-b-2 border-dashed border-amber-800/30">
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📌</span>
          <span className="font-handwriting text-3xl font-bold text-stone-800 -rotate-2 inline-block">
            Pinnwand
          </span>
        </Link>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-600 hidden sm:inline">{user.email}</span>
            <LogoutButton />
          </div>
        ) : (
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/user-login"
              className="bg-white border border-stone-300 px-4 py-1.5 rounded shadow-sm rotate-1 hover:rotate-0 transition-transform text-stone-700"
            >
              Anmelden
            </Link>
            <Link
              href="/register"
              className="bg-orange-300 border border-orange-400/60 px-4 py-1.5 rounded shadow-sm -rotate-1 hover:rotate-0 transition-transform text-stone-800 font-medium"
            >
              Registrieren
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
