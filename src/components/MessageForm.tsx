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
      <div className="relative bg-green-200 border border-green-300/60 rounded-sm shadow-xl p-10 text-center rotate-1">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-red-500 shadow" />
        <div className="text-green-700 text-5xl mb-3">✓</div>
        <h2 className="font-handwriting text-2xl font-bold text-green-900 mb-1">Angepinnt!</h2>
        <p className="text-green-800 text-sm mb-5">Danke – ich habe deine Nachricht erhalten.</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm text-green-900 underline hover:no-underline"
        >
          Weitere Nachricht senden
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative bg-yellow-200 border border-yellow-300/60 rounded-sm shadow-xl p-8 space-y-5 -rotate-1"
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-red-500 shadow" />

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
        <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1.5">
          Name <span className="text-red-600">*</span>
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
          className="w-full bg-white border border-stone-300 text-stone-900 placeholder-stone-400 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
          E-Mail{' '}
          <span className="font-normal text-stone-500">(optional)</span>
        </label>
        <input
          id="email"
          type="email"
          maxLength={200}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="deine@email.de"
          className="w-full bg-white border border-stone-300 text-stone-900 placeholder-stone-400 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-stone-700 mb-1.5">
          Nachricht <span className="text-red-600">*</span>
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
          className="w-full bg-white border border-stone-300 text-stone-900 placeholder-stone-400 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-y"
        />
        <p className="text-xs text-stone-500 mt-1 text-right">{content.length} / 2000</p>
      </div>

      {status === 'error' && (
        <div className="bg-red-100 border border-red-300 rounded p-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-orange-400 hover:bg-orange-300 disabled:opacity-50 disabled:cursor-not-allowed border border-orange-500/40 text-stone-900 font-medium py-3 rounded shadow-sm transition-colors text-sm"
      >
        {status === 'loading' ? 'Wird angepinnt…' : 'Anpinnen'}
      </button>
    </form>
  )
}
