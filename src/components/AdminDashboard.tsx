'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  name: string
  email: string | null
  content: string
  createdAt: string
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  )
}

function SpinIcon() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 12 5.373 12 12H4z" />
    </svg>
  )
}

export default function AdminDashboard({ messages: initial }: { messages: Message[] }) {
  const router = useRouter()
  const [messages, setMessages] = useState(initial)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Diese Nachricht wirklich löschen?')) return
    setDeletingId(id)

    const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== id))
    } else {
      alert('Fehler beim Löschen der Nachricht.')
    }
    setDeletingId(null)
  }

  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
        <p className="text-gray-400 text-lg">Noch keine Nachrichten vorhanden.</p>
        <button
          onClick={() => router.refresh()}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Aktualisieren
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          {messages.length} {messages.length === 1 ? 'Nachricht' : 'Nachrichten'}
        </p>
        <button
          onClick={() => router.refresh()}
          className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
        >
          Aktualisieren
        </button>
      </div>

      <div className="space-y-4">
        {messages.map((msg) => (
          <article
            key={msg.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                  <span className="font-semibold text-gray-900">{msg.name}</span>
                  {msg.email && (
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-blue-600 text-sm hover:underline truncate max-w-xs"
                    >
                      {msg.email}
                    </a>
                  )}
                  <span className="text-xs text-gray-400">{formatDate(msg.createdAt)}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {msg.content}
                </p>
              </div>
              <button
                onClick={() => handleDelete(msg.id)}
                disabled={deletingId === msg.id}
                title="Nachricht löschen"
                className="flex-shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-2 transition-colors disabled:opacity-50"
              >
                {deletingId === msg.id ? <SpinIcon /> : <TrashIcon />}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
