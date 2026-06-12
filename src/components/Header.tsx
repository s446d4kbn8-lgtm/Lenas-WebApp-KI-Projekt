import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default function Header({ user }: { user?: { email: string } | null }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white text-sm font-bold">
            P
          </span>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
            Pinnwand
          </span>
        </Link>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/60 hidden sm:inline">{user.email}</span>
            <LogoutButton />
          </div>
        ) : (
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/user-login" className="text-white/70 hover:text-white transition-colors">
              Anmelden
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:opacity-90 text-white px-4 py-2 rounded-xl font-medium transition-opacity"
            >
              Registrieren
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
