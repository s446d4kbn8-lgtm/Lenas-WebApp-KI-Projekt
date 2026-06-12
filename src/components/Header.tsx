import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default function Header({ user }: { user?: { email: string } | null }) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-400 text-sm">
            ✦
          </span>
          <span className="font-bold text-white tracking-tight">Pinnwand</span>
        </Link>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400 hidden sm:inline">{user.email}</span>
            <LogoutButton />
          </div>
        ) : (
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/user-login" className="text-zinc-300 hover:text-white transition-colors">
              Anmelden
            </Link>
            <Link
              href="/register"
              className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg transition-colors"
            >
              Registrieren
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
