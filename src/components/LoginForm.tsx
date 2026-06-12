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
      className="relative bg-white border border-stone-300 rounded-sm shadow-xl p-8 space-y-4 rotate-1"
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-red-500 shadow" />

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
          E-Mail-Adresse
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-stone-50 border border-stone-300 text-stone-900 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1.5">
          Passwort
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-stone-50 border border-stone-300 text-stone-900 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 rounded p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-400 hover:bg-orange-300 disabled:opacity-50 disabled:cursor-not-allowed border border-orange-500/40 text-stone-900 font-medium py-3 rounded shadow-sm transition-colors text-sm"
      >
        {loading ? 'Anmelden…' : 'Anmelden'}
      </button>
    </form>
  )
}
