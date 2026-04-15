'use client'

/**
 * CustomCursor — three visual states:
 *
 *  default   →  small dot + thin outer ring  (normal navigation)
 *  pointer   →  filled pill with arrow ↗     (buttons, nav links)
 *  view      →  expanding ring + "view" text (product cards, images)
 *
 * Bug fix: cursor is now visible immediately on first mousemove instead of
 * waiting for a window mouseenter event (which never fires if the mouse was
 * already inside the viewport on load).
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type CursorState = 'default' | 'pointer' | 'view'

function getCursorState(target: EventTarget | null): CursorState {
  if (!target) return 'default'
  const el = target as HTMLElement

  // Walk up to find the first meaningful ancestor
  const interactive =
    el.closest('button') ??
    el.closest('[role="button"]') ??
    el.closest('select') ??
    el.closest('input') ??
    el.closest('textarea')

  if (interactive) return 'pointer'

  // Product cards / image tiles carry data-cursor="view"
  // Also trigger "view" on any <a> that wraps an image (product cards)
  const viewEl =
    el.closest('[data-cursor="view"]') ??
    (el.closest('a')?.querySelector('img') ? el.closest('a') : null)

  if (viewEl) return 'view'

  // Plain anchor without an image inside → pointer
  if (el.closest('a')) return 'pointer'

  return 'default'
}

export default function CustomCursor() {
  const [renderPos, setRenderPos] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [state, setState] = useState<CursorState>('default')

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setRenderPos({ x: e.clientX, y: e.clientY })
      if (!visible) setVisible(true)
      setState(getCursorState(e.target))
    }

    const onOver = (e: MouseEvent) => setState(getCursorState(e.target))
    const onDown = () => setPressed(true)
    const onUp   = () => setPressed(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove',  onMove,  { passive: true })
    window.addEventListener('mouseover',  onOver,  { passive: true })
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mouseup',    onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseover',  onOver)
      window.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mouseup',    onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [visible])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  const { x, y } = renderPos

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999]"
          style={{ translateX: x, translateY: y }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* ── DEFAULT: dot + ring ──────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {state === 'default' && (
              <motion.div
                key="default"
                className="absolute -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: pressed ? 0.85 : 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                {/* Outer ring */}
                <div className="w-8 h-8 rounded-full border border-black/40 absolute -translate-x-1/2 -translate-y-1/2" />
                {/* Inner dot */}
                <div className="w-[5px] h-[5px] rounded-full bg-black absolute -translate-x-1/2 -translate-y-1/2" />
              </motion.div>
            )}

            {/* ── POINTER: solid circle with up-right arrow ─────────── */}
            {state === 'pointer' && (
              <motion.div
                key="pointer"
                className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: pressed ? 0.88 : 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-md">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 10L10 2M10 2H4M10 2V8" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>
            )}

            {/* ── VIEW: expanding ring + label ──────────────────────── */}
            {state === 'view' && (
              <motion.div
                key="view"
                className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: pressed ? 0.9 : 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Pulsing outer ring */}
                <motion.div
                  className="absolute w-14 h-14 rounded-full border border-black/30"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Inner filled pill */}
                <div className="relative bg-black text-white text-[9px] font-semibold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full select-none">
                  view
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
