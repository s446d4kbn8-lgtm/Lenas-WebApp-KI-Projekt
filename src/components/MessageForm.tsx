'use client'

import { useState } from 'react'

function getCsrfToken(): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

export default function MessageForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Honeypot – Bots füllen dieses Feld, Menschen nicht
    if (honeypot) {
      setStatus('success') // still silently "succeed"
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken(),
        },
        body: JSON.stringify({ name, email: email || undefined, content }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setStatus('success')
        setName('')
        setEmail('')
        setContent('')
      } else {
        setErrorMsg(data.error ?? 'Ein unbekannter Fehler ist aufgetreten.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Netzwerkfehler – bitte Seite neu laden und erneut versuchen.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-10 text-center">
        <div className="text-emerald-400 text-5xl mb-3">✓</div>
        <h2 className="text-xl font-semibold text-emerald-300 mb-1">Nachricht gesendet!</h2>
        <p className="text-emerald-400/80 text-sm mb-5">Vielen Dank – wir haben deine Nachricht erhalten.</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm text-emerald-300 underline hover:no-underline"
        >
          Weitere Nachricht senden
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 p-8 space-y-5">
      {/* Honeypot-Feld: per CSS versteckt, Bots füllen es aus */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
      />

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Name <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          minLength={2}
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dein Name"
          className="w-full bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
          E-Mail{' '}
          <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <input
          id="email"
          type="email"
          maxLength={200}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="deine@email.de"
          className="w-full bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Nachricht <span className="text-red-400">*</span>
        </label>
        <textarea
          id="content"
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Deine Nachricht..."
          className="w-full bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition resize-y"
        />
        <p className="text-xs text-zinc-500 mt-1 text-right">{content.length} / 2000</p>
      </div>

      {status === 'error' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors text-sm"
      >
        {status === 'loading' ? 'Wird gesendet…' : 'Nachricht senden'}
      </button>
    </form>
  )
}
