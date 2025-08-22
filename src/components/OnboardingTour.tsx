"use client"

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'

export type TourStep = {
  title: string
  description: string
  spotlightSelector?: string
}

type Props = {
  open: boolean
  onClose: () => void
  steps: TourStep[]
}

export default function OnboardingTour({ open, onClose, steps }: Props) {
  const [index, setIndex] = useState(0)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const id = useId()

  useEffect(() => {
    if (open) {
      setIndex(0)
      const prevOverflow = document.documentElement.style.overflow
      document.documentElement.style.overflow = 'hidden'
      return () => {
        document.documentElement.style.overflow = prevOverflow
      }
    }
  }, [open])

  const canGoBack = index > 0
  const canGoNext = index < steps.length - 1

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, steps.length - 1)), [steps.length])
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), [])

  // Keyboard controls
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); handleClose() }
      if (e.key === 'ArrowRight') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, handleClose, next, prev])

  // Basic focus trap
  useEffect(() => {
    if (!open) return
    const el = dialogRef.current
    const focusable = el?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    const first = focusable?.[0]
    const last = focusable?.[focusable.length - 1]

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !focusable?.length) return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    const onOpenFocus = () => {
      setTimeout(() => {
        (closeBtnRef.current ?? first)?.focus()
      }, 0)
    }

    document.addEventListener('keydown', trap)
    onOpenFocus()
    return () => document.removeEventListener('keydown', trap)
  }, [open])

  const spotlightRect = useSpotlightRect(open ? steps[index]?.spotlightSelector : undefined)

  if (!open) return null

  return (
    <div aria-labelledby={`${id}-title`} aria-describedby={`${id}-desc`} role="dialog" aria-modal="true">
      {/* Backdrop and spotlight mask */}
      <div
        className="fixed inset-0 z-40 bg-black/70 animate-in-fade"
        onClick={handleClose}
      />

      {/* Spotlight hole using CSS clip-path */}
      <SpotlightOverlay rect={spotlightRect} onClickBackdrop={handleClose} />

      {/* Modal Panel */}
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-xl p-4 md:bottom-10">
        <div
          ref={dialogRef}
          className="backdrop-blur-supported rounded-2xl border border-white/10 bg-base-900/70 p-5 shadow-glow animate-in-scale"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 id={`${id}-title`} className="text-lg font-semibold tracking-tight">
                {steps[index]?.title}
              </h2>
              <p id={`${id}-desc`} className="mt-2 text-sm text-white/75">
                {steps[index]?.description}
              </p>
            </div>
            <button
              ref={closeBtnRef}
              onClick={handleClose}
              className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-base-800 text-white/80 hover:bg-base-700"
              aria-label="Close tour"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <ProgressDots total={steps.length} index={index} />
            <div className="flex items-center gap-2">
              {canGoBack && (
                <button onClick={prev} className="focus-ring rounded-lg border border-white/10 bg-base-800 px-3 py-2 text-sm text-white/85 hover:bg-base-700">
                  Back
                </button>
              )}
              {canGoNext ? (
                <button onClick={next} className="focus-ring rounded-lg bg-accent-600 px-3 py-2 text-sm font-medium text-base-950 hover:bg-accent-500">
                  Next
                </button>
              ) : (
                <button onClick={handleClose} className="focus-ring rounded-lg bg-accent-600 px-3 py-2 text-sm font-medium text-base-950 hover:bg-accent-500">
                  Done
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={handleClose}
              className="text-xs text-white/60 underline-offset-2 hover:text-white/80 hover:underline"
            >
              Skip tour
            </button>
            <p className="text-xs text-white/45">Tip: Use ← → keys</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProgressDots({ total, index }: { total: number; index: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Step ${index + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-accent-500' : 'w-2 bg-white/25'}`}
        />
      ))}
    </div>
  )
}

function SpotlightOverlay({ rect, onClickBackdrop }: { rect?: DOMRect | null; onClickBackdrop: () => void }) {
  if (!rect) return null
  const padding = 8
  const r = {
    top: Math.max(rect.top - padding, 0),
    left: Math.max(rect.left - padding, 0),
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
    radius: 10
  }
  const path = `M0,0 H100% V100% H0 V0 Z M${r.left},${r.top} h${r.width} v${r.height} h${-r.width} Z`
  return (
    <svg className="pointer-events-auto fixed inset-0 z-40" onClick={onClickBackdrop}>
      <defs>
        <mask id="hole">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <rect x={r.left} y={r.top} width={r.width} height={r.height} rx={r.radius} ry={r.radius} fill="black" />
        </mask>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.55)" mask="url(#hole)" />
    </svg>
  )
}

function useSpotlightRect(selector?: string) {
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (!selector) { setRect(null); return }
    const el = document.querySelector(selector) as HTMLElement | null
    if (!el) { setRect(null); return }

    const update = () => {
      const r = el.getBoundingClientRect()
      setRect(r)
    }

    update()

    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, { passive: true })

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update)
    }
  }, [selector])

  return rect
}
