import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dark Onboarding Tour',
  description: 'Aesthetic onboarding tour modal for a dark themed website.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-base-950 text-white antialiased">
        {children}
      </body>
    </html>
  )
}
