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
      className="text-sm text-stone-700 hover:text-stone-900 bg-white border border-stone-300 rounded px-4 py-2 hover:bg-stone-50 disabled:opacity-50 transition-colors shadow-sm"
    >
      {loading ? 'Wird abgemeldet…' : 'Abmelden'}
    </button>
  )
}
