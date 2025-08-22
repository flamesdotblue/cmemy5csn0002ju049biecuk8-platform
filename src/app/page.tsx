"use client"

import { useEffect, useState } from 'react'
import OnboardingTour, { TourStep } from '@/components/OnboardingTour'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export default function Page() {
  const [open, setOpen] = useState(false)
  const [tourSeen, setTourSeen] = useLocalStorage<boolean>('tourSeen', false)

  useEffect(() => {
    if (!tourSeen) setOpen(true)
  }, [tourSeen])

  const steps: TourStep[] = [
    {
      title: 'Welcome to your dashboard',
      description:
        'Take a quick tour to discover key features. You can navigate with your keyboard: → Next, ← Back, and Esc to close.',
      spotlightSelector: '#hero-card'
    },
    {
      title: 'Search everything',
      description: 'Use the universal search to find projects, teammates, or settings instantly.',
      spotlightSelector: '#search-input'
    },
    {
      title: 'Customize your view',
      description: 'Switch themes, reorder widgets, and tailor the layout to your workflow.',
      spotlightSelector: '#settings-button'
    }
  ]

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-gradient-to-br from-accent-500/40 to-accent-600/30 ring-1 ring-accent-600/20" />
          <h1 className="text-2xl font-semibold tracking-tight">Your Product</h1>
        </div>
        <button
          id="settings-button"
          onClick={() => setOpen(true)}
          className="focus-ring rounded-lg bg-base-800 px-4 py-2 text-sm font-medium text-white/90 shadow hover:bg-base-700"
        >
          Take a tour
        </button>
      </header>

      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div id="hero-card" className="col-span-2 rounded-xl border border-white/5 bg-base-900/50 p-6 shadow-glow">
          <h2 className="text-xl font-medium">Welcome back</h2>
          <p className="mt-2 text-white/70">
            Here’s a quick snapshot of what’s new. Click “Take a tour” anytime.
          </p>
        </div>
        <div className="rounded-xl border border-white/5 bg-base-900/40 p-6">
          <h3 className="text-sm font-semibold text-white/80">Quick actions</h3>
          <div className="mt-3 flex flex-col gap-2">
            <button className="rounded-md bg-base-800 px-3 py-2 text-left text-sm hover:bg-base-700">Create project</button>
            <button className="rounded-md bg-base-800 px-3 py-2 text-left text-sm hover:bg-base-700">Invite teammate</button>
            <button className="rounded-md bg-base-800 px-3 py-2 text-left text-sm hover:bg-base-700">View analytics</button>
          </div>
        </div>
      </section>

      <div className="mt-10">
        <label htmlFor="search-input" className="sr-only">Search</label>
        <input
          id="search-input"
          className="w-full rounded-lg border border-white/5 bg-base-900/60 px-4 py-2 text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-500/40"
          placeholder="Search..."
        />
      </div>

      <OnboardingTour
        open={open}
        onClose={() => {
          setOpen(false)
          setTourSeen(true)
        }}
        steps={steps}
      />
    </main>
  )
}
