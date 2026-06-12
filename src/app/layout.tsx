import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pinnwand',
  description: 'Hinterlasse mir eine Nachricht.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-white antialiased relative overflow-x-hidden`}>
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-32 w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-32 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl" />
        </div>
        {children}
      </body>
    </html>
  )
}
