'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function getCsrfToken(): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

export default function LoginForm({ redirectTo = '/admin' }: { redirectTo?: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken(),
        },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        router.push(redirectTo)
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Login fehlgeschlagen.')
        setLoading(false)
      }
    } catch {
      setError('Netzwerkfehler – bitte erneut versuchen.')
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 space-y-4"
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1.5">
          E-Mail-Adresse
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1.5">
          Passwort
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent transition"
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-opacity text-sm"
      >
        {loading ? 'Anmelden…' : 'Anmelden'}
      </button>
    </form>
  )
}
