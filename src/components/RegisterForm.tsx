'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function getCsrfToken(): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

export default function RegisterForm() {
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken(),
        },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        router.push('/')
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Registrierung fehlgeschlagen.')
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
      className="bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 p-8 space-y-4"
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
          E-Mail-Adresse
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Passwort
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
        />
        <p className="text-xs text-zinc-500 mt-1">Mindestens 8 Zeichen</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors text-sm"
      >
        {loading ? 'Wird erstellt…' : 'Konto erstellen'}
      </button>
    </form>
  )
}
