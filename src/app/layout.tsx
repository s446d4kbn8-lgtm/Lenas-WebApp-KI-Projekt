import type { Metadata } from 'next'
import { Caveat } from 'next/font/google'
import './globals.css'

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-caveat',
})

export const metadata: Metadata = {
  title: 'Pinnwand',
  description: 'Hinterlasse mir eine Nachricht.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${caveat.variable} min-h-screen text-stone-800 antialiased`}>
        {children}
      </body>
    </html>
  )
}
