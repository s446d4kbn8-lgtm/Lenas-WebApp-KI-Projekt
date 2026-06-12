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
      className="text-sm text-white/70 hover:text-white bg-white/5 border border-white/10 rounded-xl px-4 py-2 hover:bg-white/10 disabled:opacity-50 transition-colors"
    >
      {loading ? 'Wird abgemeldet…' : 'Abmelden'}
    </button>
  )
}
