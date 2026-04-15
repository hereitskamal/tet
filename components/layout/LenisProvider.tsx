'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

interface LenisProviderProps {
  children: React.ReactNode
}

export default function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    // Initialize Lenis with autoRaf enabled for simplicity
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      autoRaf: false,
    })

    // Animation loop
    let animationFrameId: number

    const raf = (time: number) => {
      lenis.raf(time)
      animationFrameId = requestAnimationFrame(raf)
    }

    animationFrameId = requestAnimationFrame(raf)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      lenis.destroy()
    }
  }, [])

  return children
}
