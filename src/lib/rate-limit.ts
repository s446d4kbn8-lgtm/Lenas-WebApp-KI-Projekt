interface Entry {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()
const WINDOW_MS = 60 * 60 * 1000 // 1 Stunde
const MAX_REQUESTS = 5            // max. 5 Nachrichten pro IP pro Stunde

export function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || entry.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  if (entry.count >= MAX_REQUESTS) return true

  entry.count++
  return false
}

// Alte Einträge periodisch bereinigen (läuft im Hintergrund)
const cleanup = setInterval(() => {
  const now = Date.now()
  store.forEach((entry, key) => {
    if (entry.resetAt < now) store.delete(key)
  })
}, WINDOW_MS)

// Timer soll den Prozess nicht am Beenden hindern
if (typeof cleanup.unref === 'function') cleanup.unref()
