'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton({ redirectTo = '/' }: { redirectTo?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-sm text-zinc-400 hover:text-white border border-zinc-700 rounded-lg px-4 py-2 hover:bg-zinc-900 disabled:opacity-50 transition-colors"
    >
      {loading ? 'Wird abgemeldet…' : 'Abmelden'}
    </button>
  )
}
