'use client'

import { useState } from 'react'

function getCsrfToken(): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

export default function MessageForm() {
  const [name, setName] = useState('')
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
        body: JSON.stringify({ name, content }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setStatus('success')
        setName('')
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
      <div className="bg-emerald-500/10 backdrop-blur-xl border border-emerald-400/30 rounded-3xl shadow-2xl p-10 text-center">
        <div className="text-emerald-400 text-5xl mb-3">✓</div>
        <h2 className="text-xl font-semibold text-emerald-300 mb-1">Nachricht gesendet!</h2>
        <p className="text-emerald-200/70 text-sm mb-5">Vielen Dank – ich habe deine Nachricht erhalten.</p>
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
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 space-y-5"
    >
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
        <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1.5">
          Name <span className="text-fuchsia-400">*</span>
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
          className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-white/80 mb-1.5">
          Nachricht <span className="text-fuchsia-400">*</span>
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
          className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent transition resize-y"
        />
        <p className="text-xs text-white/40 mt-1 text-right">{content.length} / 2000</p>
      </div>

      {status === 'error' && (
        <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-3 text-sm text-red-300">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-opacity text-sm"
      >
        {status === 'loading' ? 'Wird gesendet…' : 'Nachricht senden'}
      </button>
    </form>
  )
}
